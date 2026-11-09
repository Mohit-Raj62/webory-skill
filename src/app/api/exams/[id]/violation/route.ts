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
    const { attemptId, violationType = "tab_switch", details = "" } = await req.json();

    const exam = await Examination.findById(id).lean();
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const maxAllowed = exam.maxTabSwitches ?? 3;

    // Atomically increment violation metrics directly in MongoDB
    const incField: any = {
      violationCount: 1,
    };
    if (violationType === "tab_switch") {
      incField.tabSwitchCount = 1;
    } else if (violationType === "fullscreen_exit") {
      incField.fullscreenExitCount = 1;
    }

    const updatedAttempt = await ExaminationAttempt.findOneAndUpdate(
      {
        _id: attemptId,
        examId: id,
        studentId: auth.user._id,
      },
      {
        $inc: incField,
        $push: {
          activityLogs: {
            action: `security_violation_${violationType}`,
            timestamp: new Date(),
            metadata: {
              violationType,
              details,
              userAgent: req.headers.get("user-agent"),
            },
          },
        },
      },
      { new: true, lean: true }
    );

    if (!updatedAttempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    if (updatedAttempt.status !== "in-progress") {
      return NextResponse.json({
        success: false,
        alreadySubmitted: true,
        status: updatedAttempt.status,
      });
    }

    const currentTabSwitches = Number(updatedAttempt.tabSwitchCount || 0);
    const shouldAutoSubmit =
      exam.enableProctoring !== false &&
      exam.autoSubmitOnViolations !== false &&
      violationType === "tab_switch" &&
      currentTabSwitches >= maxAllowed;

    if (shouldAutoSubmit) {
      const submittedAt = new Date();
      const evaluation = evaluateStudentSubmission({
        questions: exam.questions,
        responses: updatedAttempt.responses,
        startTime: updatedAttempt.startTime,
        submittedAt,
        negativeMarking: exam.negativeMarking,
        negativeMarksPerQuestion: exam.negativeMarksPerQuestion,
        passingPercentage: exam.passingPercentage,
        passingMarks: exam.passingMarks,
      });

      await ExaminationAttempt.updateOne(
        { _id: attemptId },
        {
          $set: {
            status: "submitted",
            submittedAt,
            evaluation,
          },
          $push: {
            activityLogs: {
              action: "auto_submitted_security_violations",
              timestamp: submittedAt,
              metadata: {
                reason: "Max tab switch violations exceeded",
                tabSwitches: currentTabSwitches,
              },
            },
          },
        }
      );

      return NextResponse.json({
        success: true,
        autoSubmitted: true,
        tabSwitchCount: currentTabSwitches,
        maxAllowed,
        message: "Maximum tab switch limit exceeded. Examination automatically submitted.",
      });
    }

    return NextResponse.json({
      success: true,
      autoSubmitted: false,
      tabSwitchCount: currentTabSwitches,
      fullscreenExitCount: updatedAttempt.fullscreenExitCount || 0,
      maxAllowed,
      warningsRemaining: Math.max(0, maxAllowed - currentTabSwitches),
    });
  } catch (error: any) {
    console.error("Violation logging error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to log violation" },
      { status: 500 }
    );
  }
}

