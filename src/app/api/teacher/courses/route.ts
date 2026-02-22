import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const courses = await Course.find({ instructor: userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reqBody = await request.json();
    const {
      title,
      description,
      level,
      color,
      icon,
      price,
      outcome,
      whoIsThisFor,
      projects,
      careerOutcomes,
    } = reqBody;

    // Basic validation
    if (!title || !description || !level || !color || !icon) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 },
      );
    }

    const newCourse = new Course({
      title,
      description,
      level,
      color,
      icon,
      price: price || 0,
      instructor: userId,
      studentsCount: "0",
      outcome: outcome || "",
      whoIsThisFor: whoIsThisFor || [],
      projects: projects || [],
      careerOutcomes: careerOutcomes || [],
    });

    const savedCourse = await newCourse.save();

    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      userId,
      "CREATE_COURSE",
      `Created course: ${savedCourse.title} (${savedCourse._id})`,
      request.headers.get("x-forwarded-for") || "unknown",
    );

    return NextResponse.json({
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
