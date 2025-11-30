import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveClass from "@/models/LiveClass";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// GET - Fetch live classes for students (filtered by enrollment)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId || decoded.id;

    // Get student's enrollments
    const enrollments = await Enrollment.find({
      student: userId,
      status: "active",
    });
    const enrolledCourseIds = enrollments.map((e) => e.course);

    // Fetch live classes
    const liveClasses = await LiveClass.find({
      $or: [
        { type: "general" }, // Public/General classes
        { type: "course", referenceId: { $in: enrolledCourseIds } }, // Classes for enrolled courses
      ],
    })
      .sort({ date: 1 }) // Ascending order (upcoming first)
      .populate("instructor", "firstName lastName")
      .populate("referenceId", "title"); // Populate course title if available

    return NextResponse.json({ liveClasses });
  } catch (error) {
    console.error("Fetch live classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live classes" },
      { status: 500 }
    );
  }
}
