import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import { getAuthenticatedUser } from "@/lib/exam-auth";
import { evaluateStudentSubmission } from "@/lib/exam-evaluation";

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
    const { attemptId, isAutoSubmit = false } = await req.json();

    const attempt = await ExaminationAttempt.findOne({
      _id: attemptId,
      examId: id,
      studentId: auth.user._id,
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    if (attempt.status !== "in-progress") {
      return NextResponse.json(
        { error: "Examination has already been submitted.", alreadySubmitted: true },
        { status: 400 }
      );
    }

    const exam = await Examination.findById(id);
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const submittedAt = new Date();
    const evaluation = evaluateStudentSubmission({
      questions: exam.questions,
      responses: attempt.responses,
      startTime: attempt.startTime,
      submittedAt,
      negativeMarking: exam.negativeMarking,
      negativeMarksPerQuestion: exam.negativeMarksPerQuestion,
      passingPercentage: exam.passingPercentage,
      passingMarks: exam.passingMarks,
    });

    attempt.status = "submitted";
    attempt.submittedAt = submittedAt;
    attempt.evaluation = evaluation;
    attempt.activityLogs.push({
      action: isAutoSubmit ? "auto_submitted_timer_expired" : "student_submitted",
      timestamp: submittedAt,
    });

    await attempt.save();

    const canViewResult =
      exam.resultVisibility === "immediate" || exam.resultsPublished === true;
    const canViewAnswerKey =
      exam.answerKeyVisibility === "immediate" || exam.answerKeyPublished === true;

    return NextResponse.json({
      success: true,
      message: "Examination submitted successfully!",
      isAutoSubmit,
      canViewResult,
      canViewAnswerKey,
      evaluation: canViewResult
        ? {
            totalQuestions: evaluation.totalQuestions,
            attemptedQuestions: evaluation.attemptedQuestions,
            correctAnswers: evaluation.correctAnswers,
            incorrectAnswers: evaluation.incorrectAnswers,
            unattemptedQuestions: evaluation.unattemptedQuestions,
            totalMarks: evaluation.totalMarks,
            obtainedMarks: evaluation.obtainedMarks,
            percentage: evaluation.percentage,
            passed: evaluation.passed,
            timeTakenSeconds: evaluation.timeTakenSeconds,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Exam submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit examination" },
      { status: 500 }
    );
  }
}

