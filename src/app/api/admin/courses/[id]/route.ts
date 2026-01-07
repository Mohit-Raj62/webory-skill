import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// DELETE course
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Find course first to get assets
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 1. Collect all Cloudinary URLs
    const imageVars = [course.thumbnail, course.certificateImage].filter(
      (url) => url && url.includes("cloudinary")
    );

    // Collect video URLs
    let videoUrls: string[] = [];

    // Legacy videos
    if (course.videos && course.videos.length > 0) {
      videoUrls.push(
        ...course.videos
          .map((v: any) => v.url)
          .filter((u: string) => u && u.includes("cloudinary"))
      );
    }

    // Module videos
    if (course.modules && course.modules.length > 0) {
      course.modules.forEach((mod: any) => {
        if (mod.videos && mod.videos.length > 0) {
          videoUrls.push(
            ...mod.videos
              .map((v: any) => v.url)
              .filter((u: string) => u && u.includes("cloudinary"))
          );
        }
      });
    }

    // 2. Delete from Cloudinary
    // Import dynamically or use the utility functions if available
    // We need to import the utility functions at top level, but for this edit I will add import
    const { deleteFromCloudinary } = await import("@/lib/cloudinary-utils");

    if (imageVars.length > 0) {
      await deleteFromCloudinary(imageVars, "image");
    }

    if (videoUrls.length > 0) {
      await deleteFromCloudinary(videoUrls, "video");
    }

    // Delete enrollments for this course
    await Enrollment.deleteMany({ course: id });

    // Delete course
    await Course.findByIdAndDelete(id);

    // Log Activity
    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      decoded.userId || decoded.id,
      "DELETE_COURSE",
      `Deleted course: ${course.title} (${id})`,
      req.headers.get("x-forwarded-for") || "unknown"
    );

    return NextResponse.json({
      message: "Course and associated assets deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();
    console.log("PUT /api/admin/courses/[id] - Incoming data:", data);
    console.log(
      "PUT /api/admin/courses/[id] - Collaboration info:",
      data.collaboration
    );

    // 1. Fetch current course to compare
    const currentCourse = await Course.findById(id);
    if (!currentCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Identify orphaned assets
    const { deleteFromCloudinary } = await import("@/lib/cloudinary-utils");
    const assetsToDelete: { urls: string[]; type: "image" | "video" }[] = [];

    // Check Thumbnail
    if (
      data.thumbnail &&
      currentCourse.thumbnail &&
      data.thumbnail !== currentCourse.thumbnail &&
      currentCourse.thumbnail.includes("cloudinary")
    ) {
      assetsToDelete.push({ urls: [currentCourse.thumbnail], type: "image" });
    }

    // Check Certificate Image
    if (
      data.certificateImage &&
      currentCourse.certificateImage &&
      data.certificateImage !== currentCourse.certificateImage &&
      currentCourse.certificateImage.includes("cloudinary")
    ) {
      assetsToDelete.push({
        urls: [currentCourse.certificateImage],
        type: "image",
      });
    }

    // Check Videos (Orphaned ones)
    // Flatten current videos
    let oldVideoUrls: string[] = [];
    if (currentCourse.videos && currentCourse.videos.length > 0) {
      oldVideoUrls.push(...currentCourse.videos.map((v: any) => v.url));
    }
    if (currentCourse.modules && currentCourse.modules.length > 0) {
      currentCourse.modules.forEach((mod: any) => {
        if (mod.videos && mod.videos.length > 0) {
          oldVideoUrls.push(...mod.videos.map((v: any) => v.url));
        }
      });
    }

    // Handle module-based updates
    if (data.modules && data.modules.length > 0) {
      // Flatten modules to videos array for backward compatibility
      const flattenedVideos = data.modules
        .sort((a: any, b: any) => a.order - b.order)
        .flatMap((module: any) => module.videos || []);
      data.videos = flattenedVideos;
    }

    // Flatten new videos
    let newVideoUrls: string[] = [];
    if (data.videos && data.videos.length > 0) {
      newVideoUrls.push(...data.videos.map((v: any) => v.url));
    } else if (data.modules && data.modules.length > 0) {
      data.modules.forEach((mod: any) => {
        if (mod.videos && mod.videos.length > 0) {
          newVideoUrls.push(...mod.videos.map((v: any) => v.url));
        }
      });
    }

    // Find difference: present in old but NOT in new
    const orphanedVideos = oldVideoUrls.filter(
      (url) => url && !newVideoUrls.includes(url) && url.includes("cloudinary")
    );
    if (orphanedVideos.length > 0) {
      assetsToDelete.push({ urls: orphanedVideos, type: "video" });
    }

    // 3. Execute Deletion (Non-blocking)
    (async () => {
      try {
        for (const item of assetsToDelete) {
          await deleteFromCloudinary(item.urls, item.type);
        }
      } catch (e) {
        console.error("Background asset cleanup failed:", e);
      }
    })();

    const course = await Course.findByIdAndUpdate(id, data, {
      new: true,
      strict: false,
    });
    console.log("PUT /api/admin/courses/[id] - Updated course:", course);

    // Log Activity
    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      decoded.userId || decoded.id,
      "UPDATE_COURSE",
      `Updated course: ${data.title || course?.title || id}`,
      req.headers.get("x-forwarded-for") || "unknown"
    );

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
