import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User"; // Ensure User model is registered
import Course from "@/models/Course"; // Ensure Course model is registered
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const enrollments = await Enrollment.find({})
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
      .lean();

    return NextResponse.json({ enrollments });
  } catch (error: any) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
