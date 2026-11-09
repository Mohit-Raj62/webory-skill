import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ExaminationAttempt from "@/models/ExaminationAttempt";
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
    const { attemptId, questionId, selectedAnswer, status } = await req.json();

    if (!attemptId || !questionId) {
      return NextResponse.json(
        { error: "attemptId and questionId are required" },
        { status: 400 }
      );
    }

    const attempt = await ExaminationAttempt.findOne({
      _id: attemptId,
      examId: id,
      studentId: auth.user._id,
      status: "in-progress",
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Active attempt not found or already submitted" },
        { status: 404 }
      );
    }

    // Check if time expired
    const now = new Date().getTime();
    if (now > new Date(attempt.endTime).getTime() + 10000) {
      // 10s grace
      return NextResponse.json(
        { error: "Time has expired for this examination", timeExpired: true },
        { status: 400 }
      );
    }

    // Update response in array
    const existingIndex = attempt.responses.findIndex(
      (r) => r.questionId === questionId
    );

    const updatedResponse = {
      questionId,
      selectedAnswer,
      status: status || (selectedAnswer !== null ? "answered" : "not-answered"),
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      attempt.responses[existingIndex] = updatedResponse as any;
    } else {
      attempt.responses.push(updatedResponse as any);
    }

    attempt.lastActivePing = new Date();
    attempt.connectionStatus = "online";
    await attempt.save();

    return NextResponse.json({
      success: true,
      message: "Answer auto-saved",
      updatedAt: updatedResponse.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save answer" },
      { status: 500 }
    );
  }
}

