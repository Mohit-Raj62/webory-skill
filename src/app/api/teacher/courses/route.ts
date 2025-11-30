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
    const { title, description, level, color, icon, price } = reqBody;

    // Basic validation
    if (!title || !description || !level || !color || !icon) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
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
    });

    const savedCourse = await newCourse.save();

    return NextResponse.json({
      message: "Course created successfully",
      data: savedCourse,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
