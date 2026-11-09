import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import { requireAdmin } from "@/lib/exam-auth";

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
    const { studentId, extraMinutes = 5, reason = "Admin granted extension", applyToAll = false } = await req.json();

    const addedMs = Number(extraMinutes) * 60 * 1000;
    if (isNaN(addedMs) || addedMs <= 0) {
      return NextResponse.json({ error: "Invalid extra minutes" }, { status: 400 });
    }

    if (applyToAll) {
      // Extend for all active attempts and update exam global extension
      await Examination.findByIdAndUpdate(id, {
        $inc: { globalTimeExtensionMinutes: Number(extraMinutes) },
      });

      const activeAttempts = await ExaminationAttempt.find({
        examId: id,
        status: "in-progress",
      });

      for (const att of activeAttempts) {
        att.endTime = new Date(new Date(att.endTime).getTime() + addedMs);
        att.extraMinutes = (att.extraMinutes || 0) + Number(extraMinutes);
        att.activityLogs.push({
          action: "admin_time_extension_all",
          timestamp: new Date(),
          metadata: { extraMinutes, reason, grantedBy: auth.user.email },
        });
        await att.save();
      }

      return NextResponse.json({
        success: true,
        message: `Extended time by ${extraMinutes} minutes for all active students.`,
      });
    } else {
      if (!studentId) {
        return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
      }

      const attempt = await ExaminationAttempt.findOne({
        examId: id,
        studentId,
        status: "in-progress",
      });

      if (!attempt) {
        return NextResponse.json(
          { error: "No active in-progress attempt found for this student" },
          { status: 404 }
        );
      }

      attempt.endTime = new Date(new Date(attempt.endTime).getTime() + addedMs);
      attempt.extraMinutes = (attempt.extraMinutes || 0) + Number(extraMinutes);
      attempt.activityLogs.push({
        action: "admin_time_extension_student",
        timestamp: new Date(),
        metadata: { extraMinutes, reason, grantedBy: auth.user.email },
      });
      await attempt.save();

      // Log in exam record
      await Examination.findByIdAndUpdate(id, {
        $push: {
          timeExtensions: {
            studentId,
            extraMinutes: Number(extraMinutes),
            grantedAt: new Date(),
            reason,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Extended time by ${extraMinutes} minutes for student.`,
        newEndTime: attempt.endTime,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to extend examination time" },
      { status: 500 }
    );
  }
}

