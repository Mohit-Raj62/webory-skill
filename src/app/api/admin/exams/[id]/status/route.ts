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
    const { status } = await req.json();

    const allowed = ["draft", "hidden", "scheduled", "live", "completed", "archived"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${allowed.join(", ")}` },
        { status: 400 }
      );
    }

    const exam = await Examination.findById(id);
    if (!exam) {
      return NextResponse.json({ error: "Examination not found" }, { status: 404 });
    }

    exam.status = status;
    exam.isPublished = status === "live";
    await exam.save();

    return NextResponse.json({
      success: true,
      exam,
      message: `Examination is now ${status.toUpperCase()}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update examination status" },
      { status: 500 }
    );
  }
}

