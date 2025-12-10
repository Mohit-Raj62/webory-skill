import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

// Quick fix endpoint to migrate module content -> videos
// DELETE THIS FILE AFTER RUNNING ONCE

export async function POST() {
  try {
    await dbConnect();

    const courseId = "69343b10b8ecb9e51296bbdc";
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    console.log("Before fix:", JSON.stringify(course.modules, null, 2));

    // Fix modules: rename 'content' to 'videos'
    const fixedModules = course.modules.map((module: any) => {
      const moduleObj = module.toObject ? module.toObject() : module;

      // If has 'content' field, rename to 'videos'
      if (moduleObj.content !== undefined) {
        return {
          title: moduleObj.title,
          description: moduleObj.description || "",
          order: moduleObj.order || 0,
          videos: moduleObj.content || [],
        };
      }

      return moduleObj;
    });

    course.modules = fixedModules;
    await course.save();

    console.log("After fix:", JSON.stringify(course.modules, null, 2));

    return NextResponse.json({
      success: true,
      message: "Course modules fixed!",
      modules: course.modules,
    });
  } catch (error) {
    console.error("Fix error:", error);
    return NextResponse.json(
      { error: "Failed to fix course" },
      { status: 500 }
    );
  }
}
