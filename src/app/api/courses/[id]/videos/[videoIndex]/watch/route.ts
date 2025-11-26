import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string; videoIndex: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id: courseId, videoIndex } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const { watchedPercentage = 100 } = await req.json();

    // Find enrollment
    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    // Get course to know total videos
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const videoIdx = parseInt(videoIndex);
    const video = course.videos[videoIdx];

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if video already watched
    const existingWatch = enrollment.watchedVideos.find(
      (w: any) => w.videoIndex === videoIdx
    );

    if (existingWatch) {
      // Update watched percentage
      existingWatch.watchedPercentage = Math.max(existingWatch.watchedPercentage, watchedPercentage);
      existingWatch.watchedAt = new Date();
    } else {
      // Add new watched video
      enrollment.watchedVideos.push({
        videoIndex: videoIdx,
        videoTitle: video.title,
        watchedAt: new Date(),
        watchedPercentage: watchedPercentage,
      });
    }

    // Calculate progress: count videos watched >= 90%
    const watchedCount = enrollment.watchedVideos.filter(
      (w: any) => w.watchedPercentage >= 90
    ).length;
    const totalVideos = course.videos.length;
    const newProgress = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    // Update progress
    enrollment.progress = newProgress;

    await enrollment.save();

    console.log(`Video ${videoIdx} marked as watched. Progress: ${newProgress}%`);

    return NextResponse.json({
      success: true,
      progress: newProgress,
      watchedVideos: enrollment.watchedVideos.length,
      totalVideos: totalVideos,
    });

  } catch (error: any) {
    console.error("Error marking video as watched:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
