import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import Application from "@/models/Application";
import { getAuthenticatedUser } from "@/lib/exam-auth";

export async function GET(
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

    const exam = await Examination.findById(id)
      .select("-questions.correctAnswer -questions.explanation") // Exclude answers & explanations
      .lean();

    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    // Role-based visibility check: Admins can view any exam; students can only view live or scheduled
    const isAdmin = auth.user.role === "admin" || auth.user.role === "superadmin";
    if (!isAdmin && exam.status !== "live" && exam.status !== "scheduled" && exam.status !== "completed") {
      return NextResponse.json(
        { error: "This examination is currently not available." },
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
          { error: "Access Restricted: This examination is reserved for selected internship candidates." },
          { status: 403 }
        );
      }
    }

    // Check student's attempts
    const attempts = await ExaminationAttempt.find({
      examId: id,
      studentId: auth.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const activeAttempt = attempts.find((a) => a.status === "in-progress");
    const completedAttemptsCount = attempts.filter((a) => a.status !== "in-progress").length;
    const canAttempt =
      Boolean(activeAttempt) ||
      (exam.status === "live" && completedAttemptsCount < (exam.maxAttempts || 1));

    return NextResponse.json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        subject: exam.subject,
        topic: exam.topic,
        duration: exam.duration,
        totalQuestions: exam.totalQuestions || exam.questions?.length || 0,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        passingPercentage: exam.passingPercentage,
        negativeMarking: exam.negativeMarking,
        negativeMarksPerQuestion: exam.negativeMarksPerQuestion,
        maxAttempts: exam.maxAttempts,
        status: exam.status,
        startDate: exam.startDate,
        endDate: exam.endDate,
        resultsPublished: exam.resultsPublished,
        answerKeyPublished: exam.answerKeyPublished,
      },
      attemptStatus: {
        totalAttemptsTaken: completedAttemptsCount,
        maxAttemptsAllowed: exam.maxAttempts || 1,
        canAttempt,
        hasActiveAttempt: Boolean(activeAttempt),
        activeAttemptId: activeAttempt?._id,
        latestAttemptId: attempts[0]?._id,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load examination details" },
      { status: 500 }
    );
  }
}

