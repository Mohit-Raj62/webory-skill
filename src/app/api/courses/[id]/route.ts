import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await dbConnect();
    const url = new URL(req.url);
    const includeUnavailable =
      url.searchParams.get("includeUnavailable") === "true";

    const course = await Course.findById(params.id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!course.isAvailable && !includeUnavailable) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Increment Views
    course.views = (course.views || 0) + 1;
    await course.save();

    // Migration logic: Convert old courses with flat videos to module structure
    if (
      course.videos &&
      course.videos.length > 0 &&
      (!course.modules || course.modules.length === 0)
    ) {
      course.modules = [
        {
          title: "Course Content",
          description: "All course videos",
          order: 0,
          videos: course.videos,
        },
      ];
      await course.save();
    }

    // Flatten modules to videos array for backward compatibility
    if (course.modules && course.modules.length > 0) {
      const flattenedVideos = course.modules
        .sort((a: any, b: any) => a.order - b.order)
        .flatMap((module: any) => module.videos || []);

      console.log(
        `[GET Course] Modules: ${course.modules.length}, Flattened: ${
          flattenedVideos.length
        }, Current: ${course.videos?.length || 0}`
      );

      // Update videos array if it's different
      if (JSON.stringify(course.videos) !== JSON.stringify(flattenedVideos)) {
        course.videos = flattenedVideos;
        await course.save();
        console.log(`[GET Course] ✅ Synced ${flattenedVideos.length} videos`);
      }
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error("Fetch course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
