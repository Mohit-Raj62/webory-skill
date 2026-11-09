import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import "@/models/User";
import "@/models/Course";
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
    const exam = await Examination.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("courseId", "title slug")
      .lean();

    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    // Attach statistics
    const attemptsCount = await ExaminationAttempt.countDocuments({ examId: id });
    const submittedCount = await ExaminationAttempt.countDocuments({
      examId: id,
      status: { $in: ["submitted", "evaluated"] },
    });

    return NextResponse.json({
      success: true,
      exam,
      stats: {
        totalAttempts: attemptsCount,
        totalSubmitted: submittedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examination" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const body = await req.json();

    if (body.questions && Array.isArray(body.questions)) {
      body.totalQuestions = body.questions.length;
      body.totalMarks = body.questions.reduce(
        (sum: number, q: any) => sum + (Number(q.marks) || 1),
        0
      );
      if (!body.passingMarks && body.passingPercentage) {
        body.passingMarks = Math.round(
          (body.totalMarks * body.passingPercentage) / 100
        );
      }
    }

    if (body.status === "live") {
      body.isPublished = true;
    }

    const updated = await Examination.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      exam: updated,
      message: "Examination updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update examination" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const exam = await Examination.findByIdAndDelete(id);
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    // Clean up attempts
    await ExaminationAttempt.deleteMany({ examId: id });

    return NextResponse.json({
      success: true,
      message: "Examination and its student records deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete examination" },
      { status: 500 }
    );
  }
}

