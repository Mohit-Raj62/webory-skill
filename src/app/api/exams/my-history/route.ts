import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import "@/models/Examination";
import { getAuthenticatedUser } from "@/lib/exam-auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();

    const attempts = await ExaminationAttempt.find({
      studentId: auth.user._id,
      status: { $in: ["submitted", "evaluated"] },
    })
      .populate("examId", "title subject topic duration totalMarks passingMarks resultsPublished resultVisibility answerKeyPublished")
      .sort({ submittedAt: -1 })
      .lean();

    const history = attempts.map((att: any) => {
      const exam = att.examId || {};
      const isResultPublished =
        exam.resultsPublished === true || exam.resultVisibility === "immediate";

      return {
        attemptId: att._id,
        examId: exam._id,
        examTitle: exam.title || "Examination",
        subject: exam.subject || "General",
        topic: exam.topic || "",
        submittedAt: att.submittedAt,
        durationMinutes: exam.duration || 0,
        totalMarks: exam.totalMarks || 0,
        isResultPublished,
        score: isResultPublished ? att.evaluation?.obtainedMarks : null,
        percentage: isResultPublished ? att.evaluation?.percentage : null,
        passed: isResultPublished ? att.evaluation?.passed : null,
        timeTakenSeconds: att.evaluation?.timeTakenSeconds || 0,
        canViewAnswerKey: exam.answerKeyPublished === true,
      };
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    console.error("Student exam history error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examination history" },
      { status: 500 }
    );
  }
}

