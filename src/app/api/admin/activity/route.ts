import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Activity from "@/models/Activity";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    await connectToDB();

    // Aggregation Pipeline to group by User and Course
    const activities = await Activity.aggregate([
      {
        $match: {
          type: "course_viewed",
          // Optional: Filter by last 7 days vs all time? Let's keep all time for 'High Interest'
        },
      },
      {
        $group: {
          _id: {
            student: "$student",
            courseId: "$relatedId",
            courseName: "$metadata.courseName",
          },
          count: { $sum: 1 },
          lastViewed: { $max: "$date" },
        },
      },
      { $sort: { lastViewed: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "users",
          localField: "_id.student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          student: {
            firstName: "$studentInfo.firstName",
            lastName: "$studentInfo.lastName",
            email: "$studentInfo.email",
            phone: "$studentInfo.phone",
            avatar: "$studentInfo.avatar",
          },
          courseName: "$_id.courseName",
          courseId: "$_id.courseId",
          count: "$count",
          lastViewed: "$lastViewed",
        },
      },
    ]);

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
