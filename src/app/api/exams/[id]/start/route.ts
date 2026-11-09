import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import Application from "@/models/Application";
import { getAuthenticatedUser } from "@/lib/exam-auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedUser();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { id } = await params;

    const exam = await Examination.findById(id).lean();
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const isAdmin = auth.user.role === "admin" || auth.user.role === "superadmin";
    if (!isAdmin && exam.status !== "live") {
      return NextResponse.json(
        { error: "Examination is not currently active or live." },
        { status: 403 }
      );
    }

    // Check internship candidate eligibility if exam is restricted
    if (!isAdmin && exam.studentEligibility?.type === "internship") {
      const eligibility = exam.studentEligibility;
      const targetInternships = eligibility.internshipIds || [];

      const hasValidApplication = await Application.findOne({
        student: auth.user._id,
        status: { $ne: "rejected" },
        $or: [
          { assignedExam: id },
          ...(targetInternships.length > 0 ? [{ internship: { $in: targetInternships } }] : [{ status: "exam_pending" }]),
        ],
      });

      if (!hasValidApplication) {
        return NextResponse.json(
          { error: "Access Restricted: You must be shortlisted for this internship to take this assessment." },
          { status: 403 }
        );
      }
    }

    // Check existing attempts
    const existingAttempts = await ExaminationAttempt.find({
      examId: id,
      studentId: auth.user._id,
    }).sort({ createdAt: -1 });

    let activeAttempt = existingAttempts.find((a) => a.status === "in-progress");

    if (!activeAttempt) {
      // Check maximum attempts
      const completedCount = existingAttempts.filter((a) => a.status !== "in-progress").length;
      if (completedCount >= (exam.maxAttempts || 1)) {
        return NextResponse.json(
          { error: "Maximum attempts reached for this examination." },
          { status: 403 }
        );
      }

      // Create new attempt
      const startTime = new Date();
      const extraMinutes = exam.globalTimeExtensionMinutes || 0;
      const totalDurationMinutes = exam.duration + extraMinutes;
      const endTime = new Date(startTime.getTime() + totalDurationMinutes * 60 * 1000);

      // Initialize default response statuses for all questions
      const initialResponses = (exam.questions || []).map((q: any) => ({
        questionId: q._id.toString(),
        selectedAnswer: null,
        status: "not-visited",
        updatedAt: new Date(),
      }));

      activeAttempt = await ExaminationAttempt.create({
        examId: id,
        studentId: auth.user._id,
        attemptNumber: completedCount + 1,
        status: "in-progress",
        startTime,
        endTime,
        totalDurationMinutes: exam.duration,
        extraMinutes,
        lastActivePing: new Date(),
        connectionStatus: "online",
        responses: initialResponses,
        activityLogs: [
          {
            action: "exam_started",
            timestamp: new Date(),
            metadata: { userAgent: req.headers.get("user-agent") },
          },
        ],
      });
    } else {
      // Resumed attempt
      activeAttempt.lastActivePing = new Date();
      activeAttempt.connectionStatus = "online";
      activeAttempt.activityLogs.push({
        action: "exam_resumed",
        timestamp: new Date(),
      });
      await activeAttempt.save();
    }

    // Calculate remaining seconds strictly from server deadline
    const nowMs = new Date().getTime();
    const endMs = new Date(activeAttempt.endTime).getTime();
    const remainingSeconds = Math.max(0, Math.floor((endMs - nowMs) / 1000));

    // Strip answers and explanations from questions for secure client transmission
    let safeQuestions = (exam.questions || []).map((q: any) => ({
      _id: q._id.toString(),
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options || [],
      marks: q.marks,
      negativeMarks: exam.negativeMarking
        ? (q.negativeMarks || exam.negativeMarksPerQuestion || 0)
        : 0,
      difficulty: q.difficulty,
      subject: q.subject || exam.subject || "General",
      topic: q.topic,
      codeSnippet: q.codeSnippet,
      language: q.language,
    }));

    // Randomize questions if configured
    if (exam.randomizeQuestions) {
      // Deterministic pseudo-random shuffle seeded by attempt ID so order stays identical on reload
      safeQuestions = shuffleWithSeed(safeQuestions, activeAttempt._id.toString());
    }

    return NextResponse.json({
      success: true,
      attemptId: activeAttempt._id,
      startTime: activeAttempt.startTime,
      endTime: activeAttempt.endTime,
      remainingSeconds,
      serverTime: new Date(),
      totalDurationMinutes: activeAttempt.totalDurationMinutes + activeAttempt.extraMinutes,
      exam: {
        _id: exam._id,
        title: exam.title,
        subject: exam.subject || "General Assessment",
        topic: exam.topic || "",
        duration: exam.duration,
        totalQuestions: safeQuestions.length,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        negativeMarking: exam.negativeMarking,
        negativeMarksPerQuestion: exam.negativeMarksPerQuestion,
        questionNavigation: exam.questionNavigation,
        autoSubmission: exam.autoSubmission,
        enableProctoring: exam.enableProctoring !== false,
        maxTabSwitches: exam.maxTabSwitches || 3,
        requireFullscreen: exam.requireFullscreen !== false,
        disableCopyPaste: exam.disableCopyPaste !== false,
        autoSubmitOnViolations: exam.autoSubmitOnViolations !== false,
      },
      securityState: {
        tabSwitchCount: activeAttempt.tabSwitchCount || 0,
        fullscreenExitCount: activeAttempt.fullscreenExitCount || 0,
        violationCount: activeAttempt.violationCount || 0,
      },
      student: {
        name: `${auth.user.firstName || ""} ${auth.user.lastName || ""}`.trim() || auth.user.email || "Candidate",
        email: auth.user.email,
        image: auth.user.image,
      },
      questions: safeQuestions,
      savedResponses: activeAttempt.responses || [],
    });
  } catch (error: any) {
    console.error("Exam start error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to start examination" },
      { status: 500 }
    );
  }
}

function shuffleWithSeed(array: any[], seedStr: string) {
  const result = [...array];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }

  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    const j = Math.floor(rnd * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

