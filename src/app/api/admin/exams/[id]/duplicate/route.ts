import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
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
    const original = await Examination.findById(id).lean();

    if (!original) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    const { _id, createdAt, updatedAt, ...rest } = original as any;

    const duplicated = await Examination.create({
      ...rest,
      title: `${original.title} (Copy)`,
      status: "hidden", // duplicated exams are hidden by default
      isPublished: false,
      resultsPublished: false,
      answerKeyPublished: false,
      createdBy: auth.user._id,
      timeExtensions: [],
      globalTimeExtensionMinutes: 0,
    });

    return NextResponse.json({
      success: true,
      exam: duplicated,
      message: "Examination duplicated successfully (Saved in Hidden mode)",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to duplicate examination" },
      { status: 500 }
    );
  }
}

