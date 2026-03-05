import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    await dbConnect();
    const url = new URL(req.url);
    const includeUnavailable =
      url.searchParams.get("includeUnavailable") === "true";

    const courseId = params.id;

    // Non-blocking increment of views, then lean fetch
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $inc: { views: 1 } },
      { new: true },
    ).lean();

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (!course.isAvailable && !includeUnavailable) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Migration logic (run asynchronously if needed, but we avoid blocking the response)
    // We already have lean object so modifications are just on the object sent to user
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
      // Background update for DB without blocking
      Course.findByIdAndUpdate(courseId, { modules: course.modules })
        .exec()
        .catch((e) => console.error(e));
    } else if (course.modules && course.modules.length > 0) {
      const flattenedVideos = course.modules
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .flatMap((module: any) => module.videos || []);

      if (JSON.stringify(course.videos) !== JSON.stringify(flattenedVideos)) {
        course.videos = flattenedVideos;
        // Background update for DB
        Course.findByIdAndUpdate(courseId, { videos: flattenedVideos })
          .exec()
          .catch((e) => console.error(e));
      }
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error("Fetch course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
