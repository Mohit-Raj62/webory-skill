import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Activity from "@/models/Activity";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
    const userId = decoded.userId;

    const { courseId, courseName } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    await connectToDB();

    // Check if viewed in the last 1 minute (prevent spam, but allow re-visits)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const existingView = await Activity.findOne({
      student: new mongoose.Types.ObjectId(userId),
      relatedId: new mongoose.Types.ObjectId(courseId),
      type: "course_viewed",
      date: { $gte: oneMinuteAgo },
    });
    // const existingView = null; // Debug line removed

    if (!existingView) {
      await Activity.create({
        student: new mongoose.Types.ObjectId(userId),
        type: "course_viewed",
        category: "course",
        relatedId: new mongoose.Types.ObjectId(courseId),
        metadata: {
          courseName,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
