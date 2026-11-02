import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveClass from "@/models/LiveClass";
import Course from "@/models/Course";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// GET - Fetch live classes for a specific course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    let targetId = id;
    if (!mongoose.isValidObjectId(id)) {
      const course = await Course.findOne({ slug: id }).select("_id").lean();
      if (!course) {
        return NextResponse.json({ liveClasses: [] });
      }
      targetId = course._id.toString();
    }

    const liveClasses = await LiveClass.find({
      type: "course",
      referenceId: targetId,
    })
      .sort({ date: 1 }) // Ascending order (upcoming first)
      .populate("instructor", "firstName lastName")
      .lean();

    return NextResponse.json({ liveClasses });
  } catch (error) {
    console.error("Fetch course live classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live classes" },
      { status: 500 },
    );
  }
}
