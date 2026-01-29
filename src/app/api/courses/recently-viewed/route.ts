import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Activity from "@/models/Activity";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
    const userId = decoded.userId;

    await connectToDB();

    // Fetch last 10 'course_viewed' activities
    const activities = await Activity.find({
      student: new mongoose.Types.ObjectId(userId),
      type: "course_viewed",
    })
      .sort({ date: -1 })
      .limit(10)
      .populate({
        path: "relatedId",
        model: Course,
        select: "title slug price thumbnail description", // Select fields needed for card
      });

    // Filter out duplicates (Activity might have multiple views for same course)
    const uniqueCoursesMap = new Map();
    activities.forEach((activity) => {
      if (
        activity.relatedId &&
        !uniqueCoursesMap.has(activity.relatedId._id.toString())
      ) {
        uniqueCoursesMap.set(
          activity.relatedId._id.toString(),
          activity.relatedId,
        );
      }
    });

    // Return top 4 unique courses
    const uniqueCourses = Array.from(uniqueCoursesMap.values()).slice(0, 4);

    return NextResponse.json({ success: true, courses: uniqueCourses });
  } catch (error) {
    console.error("Error fetching recently viewed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
