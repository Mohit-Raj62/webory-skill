import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function GET(
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
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

    const resolvedCourseId = course._id;

    // Find enrollment
    const enrollment = await Enrollment.findOne({ student: userId, course: resolvedCourseId });
    
    if (!enrollment) {
      return NextResponse.json({ 
        progress: 0,
        watchedVideos: [],
        totalVideos: course.videos?.length || 0
      });
    }

    return NextResponse.json({
      progress: enrollment.progress,
      watchedVideos: enrollment.watchedVideos,
      totalVideos: course.videos?.length || 0,
    });

  } catch (error: any) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
