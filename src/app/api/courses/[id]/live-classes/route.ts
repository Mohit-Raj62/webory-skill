import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveClass from "@/models/LiveClass";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// GET - Fetch live classes for a specific course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Optional: Check if user is enrolled (if we want to restrict visibility)
    // For now, we'll return the classes, and the frontend can handle locking/hiding join links if not enrolled.
    // Or we can just return them publically as "Upcoming Live Classes" to entice users.

    const liveClasses = await LiveClass.find({
      type: "course",
      referenceId: id,
    })
      .sort({ date: 1 }) // Ascending order (upcoming first)
      .populate("instructor", "firstName lastName");

    return NextResponse.json({ liveClasses });
  } catch (error) {
    console.error("Fetch course live classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live classes" },
      { status: 500 }
    );
  }
}
