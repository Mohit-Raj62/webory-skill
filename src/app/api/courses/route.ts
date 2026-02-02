import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const includeUnavailable =
      url.searchParams.get("includeUnavailable") === "true";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "1000"); // Large default for legacy support
    const skip = (page - 1) * limit;

    const matchStage: any = {};
    if (!includeUnavailable) {
      matchStage.isAvailable = true;
    }

    // Use aggregation to calculate student count from enrollments
    const [courses, totalCount] = await Promise.all([
      Course.aggregate([
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
            enrollments: 0,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Course.countDocuments(matchStage),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasMore: page < totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
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
      { status: 500 },
    );
  }
}
