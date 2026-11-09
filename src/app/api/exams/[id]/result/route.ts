import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
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

    const exam = await Examination.findById(id).lean();
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const attempt = await ExaminationAttempt.findOne({
      examId: id,
      studentId: auth.user._id,
      status: { $in: ["submitted", "evaluated"] },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!attempt) {
      return NextResponse.json(
        { error: "No completed submission found for this examination." },
        { status: 404 }
      );
    }

    const isAdmin = auth.user.role === "admin" || auth.user.role === "superadmin";

    // Permission checks
    const isResultVisible =
      isAdmin || exam.resultVisibility === "immediate" || exam.resultsPublished === true;

    const isAnswerKeyVisible =
      isAdmin ||
      exam.answerKeyVisibility === "immediate" ||
      exam.answerKeyPublished === true;

    const isExplanationVisible =
      isAdmin ||
      (isAnswerKeyVisible && exam.explanationVisibility !== false);

    // If results are hidden by admin
    if (!isResultVisible) {
      return NextResponse.json({
        success: true,
        examTitle: exam.title,
        status: "submitted",
        isResultVisible: false,
        isAnswerKeyVisible: false,
        message:
          "Your examination has been submitted successfully! Results will be published by the administrator/instructor.",
        submittedAt: attempt.submittedAt,
      });
    }

    const evaluation = attempt.evaluation || {
      totalQuestions: 0,
      attemptedQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      unattemptedQuestions: 0,
      totalMarks: 0,
      obtainedMarks: 0,
      percentage: 0,
      passed: false,
      timeTakenSeconds: 0,
    };

    // Prepare question breakdown based on answer key visibility permissions
    let questionBreakdown: any[] = [];
    if (isAnswerKeyVisible && evaluation.questionBreakdown) {
      questionBreakdown = evaluation.questionBreakdown.map((item: any) => ({
        questionId: item.questionId,
        questionText: item.questionText,
        questionType: item.questionType,
        options: item.options,
        selectedAnswer: item.selectedAnswer,
        correctAnswer: item.correctAnswer,
        isCorrect: item.isCorrect,
        marksAwarded: item.marksAwarded,
        explanation: isExplanationVisible ? item.explanation : null,
        difficulty: item.difficulty,
        topic: item.topic,
      }));
    }

    return NextResponse.json({
      success: true,
      examTitle: exam.title,
      examSubject: exam.subject,
      examTopic: exam.topic,
      isResultVisible: true,
      isAnswerKeyVisible,
      isExplanationVisible,
      submittedAt: attempt.submittedAt,
      startTime: attempt.startTime,
      summary: {
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
      },
      questionBreakdown,
    });
  } catch (error: any) {
    console.error("Student Result GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examination results" },
      { status: 500 }
    );
  }
}

