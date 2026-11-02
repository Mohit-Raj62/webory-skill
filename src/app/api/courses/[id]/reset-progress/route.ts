import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Reset watched videos for current user's enrollment
export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id: courseId } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    let course;
    if (mongoose.isValidObjectId(courseId)) {
      course = await Course.findById(courseId);
    } else {
      course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const enrollment = await Enrollment.findOne({
      student: userId,
      course: course._id,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const totalVideos = course.videos?.length || 0;
    const oldWatchedCount = enrollment.watchedVideos.length;

    // Reset watched videos
    enrollment.watchedVideos = [];
    enrollment.progress = 0;
    await enrollment.save();

    return NextResponse.json({
      success: true,
      message: `Reset progress. Removed ${oldWatchedCount} watched videos.`,
      progress: 0,
      totalVideos,
    });
  } catch (error) {
    console.error("Reset progress error:", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}
