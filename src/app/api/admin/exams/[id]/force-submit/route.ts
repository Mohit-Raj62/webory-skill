import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import { requireAdmin } from "@/lib/exam-auth";
import { evaluateStudentSubmission } from "@/lib/exam-evaluation";

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
    const { attemptId, studentId } = await req.json();

    const query: any = { examId: id };
    if (attemptId) query._id = attemptId;
    else if (studentId) query.studentId = studentId;
    else {
      return NextResponse.json(
        { error: "attemptId or studentId is required" },
        { status: 400 }
      );
    }

    const attempt = await ExaminationAttempt.findOne(query);
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
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
      action: "admin_force_submit",
      timestamp: submittedAt,
      metadata: { admin: auth.user.email },
    });

    await attempt.save();

    return NextResponse.json({
      success: true,
      message: "Examination force-submitted and evaluated successfully",
      evaluation: {
        obtainedMarks: evaluation.obtainedMarks,
        totalMarks: evaluation.totalMarks,
        percentage: evaluation.percentage,
        passed: evaluation.passed,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to force-submit examination" },
      { status: 500 }
    );
  }
}

