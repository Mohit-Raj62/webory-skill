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

    // Get courses created by this teacher
    const courses = await Course.find({ instructor: userId });

    // Calculate total students (assuming studentsCount is stored as string "0" or number)
    let totalStudents = 0;
    courses.forEach((course) => {
      const count = parseInt(course.studentsCount) || 0;
      totalStudents += count;
    });

    const stats = {
      totalCourses: courses.length,
      totalStudents: totalStudents,
      totalEarnings: 0, // Placeholder for now
    };

    return NextResponse.json({
      message: "Stats fetched successfully",
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
