import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuestionBank from "@/models/QuestionBank";
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
    const question = await QuestionBank.findById(id).lean();

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch question" },
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

    const updated = await QuestionBank.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      question: updated,
      message: "Question updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update question" },
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
    const deleted = await QuestionBank.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete question" },
      { status: 500 }
    );
  }
}

