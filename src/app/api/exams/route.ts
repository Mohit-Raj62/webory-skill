import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import { getAuthenticatedUser } from "@/lib/exam-auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();

    // Students only ever see "live" or "scheduled" exams. Hidden and draft are NEVER visible!
    const exams = await Examination.find({
      status: { $in: ["live", "scheduled", "completed"] },
    })
      .select(
        "title description subject topic duration totalQuestions totalMarks passingPercentage status startDate endDate maxAttempts resultVisibility answerKeyVisibility isPublished resultsPublished"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Check user's attempt status for each exam
    const examIds = exams.map((e) => e._id);
    const myAttempts = await ExaminationAttempt.find({
      examId: { $in: examIds },
      studentId: auth.user._id,
    })
      .select("examId status startTime submittedAt evaluation.obtainedMarks evaluation.percentage evaluation.passed")
      .lean();

    const attemptMap = new Map<string, any>();
    myAttempts.forEach((att) => {
      attemptMap.set(att.examId.toString(), att);
    });

    const studentExams = exams.map((exam) => {
      const myAttempt = attemptMap.get(exam._id.toString());
      return {
        ...exam,
        myAttempt: myAttempt
          ? {
              status: myAttempt.status,
              submittedAt: myAttempt.submittedAt,
              score: exam.resultsPublished || exam.resultVisibility === "immediate"
                ? myAttempt.evaluation?.obtainedMarks
                : null,
              percentage: exam.resultsPublished || exam.resultVisibility === "immediate"
                ? myAttempt.evaluation?.percentage
                : null,
              passed: exam.resultsPublished || exam.resultVisibility === "immediate"
                ? myAttempt.evaluation?.passed
                : null,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      exams: studentExams,
    });
  } catch (error: any) {
    console.error("Student Exams GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examinations" },
      { status: 500 }
    );
  }
}

