import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

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
    let course;
    if (mongoose.isValidObjectId(courseId)) {
      course = await Course.findByIdAndUpdate(
        courseId,
        { $inc: { views: 1 } },
        { new: true },
      ).lean();
    }
    if (!course) {
      course = await Course.findOneAndUpdate(
        { slug: courseId },
        { $inc: { views: 1 } },
        { new: true },
      ).lean();
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Access control: if course is not publicly available, check whether user has permission
    if (!course.isAvailable && !includeUnavailable) {
      let isAuthorized = false;

      try {
        const cookieStore = await cookies();
        const cookieToken = cookieStore.get("token")?.value;
        const authHeader = req.headers.get("authorization");
        const bearerToken = authHeader?.startsWith("Bearer ")
          ? authHeader.substring(7)
          : null;
        const token = cookieToken || bearerToken;

        if (token) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!,
          ) as { userId: string };

          if (decoded?.userId) {
            // Check 1: Has the user enrolled/bought this course?
            const enrollment = await Enrollment.findOne({
              student: decoded.userId,
              course: course._id,
            })
              .select("_id")
              .lean();

            if (enrollment) {
              isAuthorized = true;
            } else {
              // Check 2: Is the user an admin, superadmin, teacher, or course instructor?
              const user = await User.findById(decoded.userId)
                .select("role")
                .lean();

              if (user) {
                const isAdminOrTeacher = [
                  "admin",
                  "superadmin",
                  "teacher",
                ].includes(user.role);

                const isInstructor =
                  course.instructor?.toString() === decoded.userId ||
                  (Array.isArray(course.coInstructors) &&
                    course.coInstructors.some(
                      (ci: any) => ci?.toString() === decoded.userId,
                    ));

                if (isAdminOrTeacher || isInstructor) {
                  isAuthorized = true;
                }
              }
            }
          }
        }
      } catch {
        // Token invalid, expired or unauthenticated; isAuthorized remains false
      }

      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 },
        );
      }
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
      Course.findByIdAndUpdate(course._id, { modules: course.modules })
        .exec()
        .catch((e) => console.error(e));
    } else if (course.modules && course.modules.length > 0) {
      const flattenedVideos = course.modules
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .flatMap((module: any) => module.videos || []);

      if (JSON.stringify(course.videos) !== JSON.stringify(flattenedVideos)) {
        course.videos = flattenedVideos;
        // Background update for DB
        Course.findByIdAndUpdate(course._id, { videos: flattenedVideos })
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
