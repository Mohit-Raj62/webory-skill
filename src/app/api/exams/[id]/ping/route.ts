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
    const { attemptId } = await req.json();

    const attempt = await ExaminationAttempt.findOne({
      _id: attemptId,
      examId: id,
      studentId: auth.user._id,
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    const nowMs = new Date().getTime();
    const endMs = new Date(attempt.endTime).getTime();
    const remainingSeconds = Math.max(0, Math.floor((endMs - nowMs) / 1000));
    const isExpired = remainingSeconds <= 0 && attempt.status === "in-progress";

    if (attempt.status === "in-progress") {
      attempt.lastActivePing = new Date();
      attempt.connectionStatus = "online";
      await attempt.save();
    }

    return NextResponse.json({
      success: true,
      status: attempt.status,
      remainingSeconds,
      isExpired,
      endTime: attempt.endTime,
      extraMinutes: attempt.extraMinutes,
      serverTime: new Date(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to sync heartbeat" },
      { status: 500 }
    );
  }
}

