import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import { requireAdmin } from "@/lib/exam-auth";

export async function PATCH(
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

    const updateFields: any = {};
    if (body.resultsPublished !== undefined) {
      updateFields.resultsPublished = Boolean(body.resultsPublished);
    }
    if (body.answerKeyPublished !== undefined) {
      updateFields.answerKeyPublished = Boolean(body.answerKeyPublished);
    }
    if (body.explanationVisibility !== undefined) {
      updateFields.explanationVisibility = Boolean(body.explanationVisibility);
    }
    if (body.resultVisibility) {
      updateFields.resultVisibility = body.resultVisibility;
    }
    if (body.answerKeyVisibility) {
      updateFields.answerKeyVisibility = body.answerKeyVisibility;
    }

    const exam = await Examination.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      exam,
      message: "Visibility permissions updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update visibility permissions" },
      { status: 500 }
    );
  }
}

