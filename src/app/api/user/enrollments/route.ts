import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course"; // Ensure Course is registered
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Fetch enrollments and populate course details
    const enrollments = await Enrollment.find({ student: decoded.userId })
      .populate('course')
      .sort({ enrolledAt: -1 });

    return NextResponse.json({ enrollments }, { status: 200 });
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
