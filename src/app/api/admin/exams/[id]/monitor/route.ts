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
    const exam = await Examination.findById(id).select("title duration totalQuestions status globalTimeExtensionMinutes").lean();

    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const attempts = await ExaminationAttempt.find({ examId: id })
      .populate("studentId", "firstName lastName email image")
      .sort({ updatedAt: -1 })
      .lean();

    const now = new Date().getTime();

    let notStarted = 0;
    let currentlyAttempting = 0;
    let submitted = 0;
    let connectionIssues = 0;

    const studentList = attempts.map((att: any) => {
      const student = att.studentId || {};
      const lastPingTime = att.lastActivePing ? new Date(att.lastActivePing).getTime() : 0;
      const secondsSincePing = Math.floor((now - lastPingTime) / 1000);

      let connection: "online" | "idle" | "offline" = "online";
      if (secondsSincePing > 90) {
        connection = "offline";
        if (att.status === "in-progress") connectionIssues++;
      } else if (secondsSincePing > 30) {
        connection = "idle";
      }

      if (att.status === "in-progress") {
        currentlyAttempting++;
      } else if (att.status === "submitted" || att.status === "evaluated") {
        submitted++;
      }

      const endTimeMs = new Date(att.endTime).getTime();
      const remainingSeconds = Math.max(0, Math.floor((endTimeMs - now) / 1000));

      const answeredCount = (att.responses || []).filter(
        (r: any) => r.status === "answered" || r.status === "answered-marked-for-review"
      ).length;

      const reviewCount = (att.responses || []).filter(
        (r: any) => r.status === "marked-for-review" || r.status === "answered-marked-for-review"
      ).length;

      return {
        attemptId: att._id,
        studentId: student._id,
        name: `${student.firstName || "Unknown"} ${student.lastName || ""}`.trim(),
        email: student.email || "No email",
        image: student.image,
        status: att.status,
        startTime: att.startTime,
        endTime: att.endTime,
        remainingSeconds,
        totalQuestions: exam.totalQuestions,
        answeredCount,
        unansweredCount: Math.max(0, exam.totalQuestions - answeredCount),
        reviewCount,
        lastActivePing: att.lastActivePing,
        secondsSincePing,
        connectionStatus: connection,
        extraMinutes: att.extraMinutes || 0,
        score: att.evaluation?.obtainedMarks,
        percentage: att.evaluation?.percentage,
        tabSwitchCount: att.tabSwitchCount || 0,
        fullscreenExitCount: att.fullscreenExitCount || 0,
        violationCount: att.violationCount || 0,
        recentActivity: (att.activityLogs || []).slice(-4),
      };
    });

    return NextResponse.json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        duration: exam.duration,
        totalQuestions: exam.totalQuestions,
        status: exam.status,
        globalTimeExtensionMinutes: exam.globalTimeExtensionMinutes || 0,
      },
      stats: {
        totalStudents: attempts.length,
        currentlyAttempting,
        submitted,
        connectionIssues,
      },
      students: studentList,
      serverTime: new Date(),
    });
  } catch (error: any) {
    console.error("Live monitor error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch live monitoring data" },
      { status: 500 }
    );
  }
}

