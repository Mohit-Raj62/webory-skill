import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Consistent authentication using helper
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role via database check
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const [enrollments, totalCount] = await Promise.all([
      Enrollment.find({})
        .populate({
          path: "student",
          model: User,
          select: "firstName lastName email",
        })
        .populate({
          path: "course",
          model: Course,
          select: "title",
        })
        .sort({ enrolledAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enrollment.countDocuments({}),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      enrollments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasMore: page < totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching enrollments:", error);

    // Return 401 for authentication or session issues
    if (
      error.message?.includes("jwt") ||
      error.message?.includes("Session expired") ||
      error.message?.includes("Not authenticated")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
