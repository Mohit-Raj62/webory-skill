import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const includeUnavailable =
      url.searchParams.get("includeUnavailable") === "true";

    const matchStage: any = {};
    if (!includeUnavailable) {
      matchStage.isAvailable = true;
    }

    // Use aggregation to calculate student count from enrollments
    const courses = await Course.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },
      {
        $addFields: {
          studentsCount: { $size: "$enrollments" },
        },
      },
      {
        $project: {
          enrollments: 0, // Remove enrollments array from response
        },
      },
    ]);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const course = await Course.create(data);
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
