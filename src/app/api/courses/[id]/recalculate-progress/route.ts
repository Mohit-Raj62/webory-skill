import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

// Recalculate progress for all enrollments of a course
// Call this after adding/removing videos from a course

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id: courseId } = params;

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get total videos count
    const totalVideos = course.videos?.length || 0;

    if (totalVideos === 0) {
      return NextResponse.json({
        message: "No videos in course, no progress to recalculate",
      });
    }

    // Find all enrollments for this course
    const enrollments = await Enrollment.find({ course: courseId });

    let updatedCount = 0;

    for (const enrollment of enrollments) {
      // Recalculate progress based on current total videos
      const watchedCount = enrollment.watchedVideos.filter(
        (w: any) => w.watchedPercentage >= 90
      ).length;

      const newProgress = Math.round((watchedCount / totalVideos) * 100);

      if (enrollment.progress !== newProgress) {
        enrollment.progress = newProgress;
        await enrollment.save();
        updatedCount++;
      }
    }

    console.log(`✅ Recalculated progress for ${updatedCount} enrollments`);

    return NextResponse.json({
      success: true,
      message: `Progress recalculated for ${updatedCount} enrollments`,
      totalEnrollments: enrollments.length,
      totalVideos: totalVideos,
    });
  } catch (error: any) {
    console.error("Error recalculating progress:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
