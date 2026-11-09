import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import "@/models/User";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import { requireAdmin } from "@/lib/exam-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const filterStatus = searchParams.get("status") || "all"; // all, passed, failed

    const exam = await Examination.findById(id).lean();
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const query: any = {
      examId: id,
      status: { $in: ["submitted", "evaluated"] },
    };

    if (filterStatus === "passed") {
      query["evaluation.passed"] = true;
    } else if (filterStatus === "failed") {
      query["evaluation.passed"] = false;
    }

    let attempts = await ExaminationAttempt.find(query)
      .populate("studentId", "firstName lastName email image phone")
      .sort({ "evaluation.obtainedMarks": -1, "evaluation.timeTakenSeconds": 1 })
      .lean();

    if (search.trim()) {
      const s = search.toLowerCase();
      attempts = attempts.filter((att: any) => {
        const name = `${att.studentId?.firstName || ""} ${att.studentId?.lastName || ""}`.toLowerCase();
        const email = (att.studentId?.email || "").toLowerCase();
        return name.includes(s) || email.includes(s);
      });
    }

    // Calculate Analytics
    const totalSubmissions = attempts.length;
    let totalScoreSum = 0;
    let highestScore = 0;
    let lowestScore = totalSubmissions > 0 ? Infinity : 0;
    let passedCount = 0;
    const questionCorrectCountMap: Record<string, number> = {};

    attempts.forEach((att: any) => {
      const marks = att.evaluation?.obtainedMarks || 0;
      totalScoreSum += marks;
      if (marks > highestScore) highestScore = marks;
      if (marks < lowestScore) lowestScore = marks;
      if (att.evaluation?.passed) passedCount++;

      (att.evaluation?.questionBreakdown || []).forEach((qb: any) => {
        if (!questionCorrectCountMap[qb.questionId]) {
          questionCorrectCountMap[qb.questionId] = 0;
        }
        if (qb.isCorrect) {
          questionCorrectCountMap[qb.questionId]++;
        }
      });
    });

    if (lowestScore === Infinity) lowestScore = 0;
    const averageScore = totalSubmissions > 0
      ? Math.round((totalScoreSum / totalSubmissions) * 10) / 10
      : 0;
    const passPercentage = totalSubmissions > 0
      ? Math.round((passedCount / totalSubmissions) * 100)
      : 0;

    // Leaderboard with ranks
    const leaderboard = attempts.map((att: any, idx: number) => ({
      rank: idx + 1,
      attemptId: att._id,
      studentId: att.studentId?._id,
      name: `${att.studentId?.firstName || "Student"} ${att.studentId?.lastName || ""}`.trim(),
      email: att.studentId?.email,
      image: att.studentId?.image,
      score: att.evaluation?.obtainedMarks || 0,
      totalMarks: exam.totalMarks,
      percentage: att.evaluation?.percentage || 0,
      passed: att.evaluation?.passed || false,
      timeTakenSeconds: att.evaluation?.timeTakenSeconds || 0,
      submittedAt: att.submittedAt,
    }));

    // Question analytics
    const questionAnalytics = (exam.questions || []).map((q: any) => {
      const qId = q._id.toString();
      const correctCount = questionCorrectCountMap[qId] || 0;
      const accuracyRate = totalSubmissions > 0
        ? Math.round((correctCount / totalSubmissions) * 100)
        : 0;

      return {
        questionId: qId,
        questionText: q.questionText,
        difficulty: q.difficulty,
        marks: q.marks,
        correctCount,
        accuracyRate,
      };
    });

    return NextResponse.json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        resultsPublished: exam.resultsPublished,
        answerKeyPublished: exam.answerKeyPublished,
        explanationVisibility: exam.explanationVisibility,
        resultVisibility: exam.resultVisibility,
        answerKeyVisibility: exam.answerKeyVisibility,
      },
      analytics: {
        totalSubmissions,
        averageScore,
        highestScore,
        lowestScore,
        passedCount,
        failedCount: totalSubmissions - passedCount,
        passPercentage,
      },
      leaderboard,
      questionAnalytics,
      attempts,
    });
  } catch (error: any) {
    console.error("Admin Results error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examination results" },
      { status: 500 }
    );
  }
}

// POST endpoint for manual adjustment of marks
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { id } = await params;
    const { attemptId, adjustmentAmount, reason } = await req.json();

    const attempt = await ExaminationAttempt.findOne({ _id: attemptId, examId: id });
    if (!attempt || !attempt.evaluation) {
      return NextResponse.json({ error: "Attempt or evaluation not found" }, { status: 404 });
    }

    const exam = await Examination.findById(id);
    const oldMarks = attempt.evaluation.obtainedMarks;
    const newMarks = Math.max(0, oldMarks + Number(adjustmentAmount));
    const newPercentage = exam && exam.totalMarks > 0
      ? Math.round((newMarks / exam.totalMarks) * 10000) / 100
      : 0;
    const passed = exam ? newMarks >= exam.passingMarks : true;

    attempt.evaluation.obtainedMarks = newMarks;
    attempt.evaluation.percentage = newPercentage;
    attempt.evaluation.passed = passed;
    attempt.activityLogs.push({
      action: "admin_manual_marks_adjustment",
      timestamp: new Date(),
      metadata: {
        adjustedBy: auth.user.email,
        oldMarks,
        newMarks,
        adjustmentAmount,
        reason,
      },
    });

    await attempt.save();

    return NextResponse.json({
      success: true,
      message: "Marks adjusted successfully",
      newMarks,
      newPercentage,
      passed,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to adjust marks" },
      { status: 500 }
    );
  }
}

