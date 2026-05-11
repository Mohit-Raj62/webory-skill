import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveClass from "@/models/LiveClass";

export const dynamic = "force-dynamic";

// GET - Fetch live classes for a specific internship
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const liveClasses = await LiveClass.find({
      type: "internship",
      referenceId: id,
    })
      .sort({ date: 1 }) // Ascending order (upcoming first)
      .populate("instructor", "firstName lastName")
      .lean();

    return NextResponse.json({ liveClasses });
  } catch (error) {
    console.error("Fetch internship live classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live classes" },
      { status: 500 },
    );
  }
}
