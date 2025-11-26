import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Use lean() to get plain JavaScript objects instead of Mongoose documents
    const enrollments = await Enrollment.find({ student: decoded.userId })
      .populate('course')
      .lean()
      .catch(err => {
        console.error("Enrollment query error:", err);
        return [];
      });
      
    const applications = await Application.find({ student: decoded.userId })
      .populate('internship')
      .populate('student')
      .lean()
      .catch(err => {
        console.error("Application query error:", err);
        return [];
      });

    return NextResponse.json({ 
      enrollments: enrollments || [], 
      applications: applications || [] 
    }, { status: 200 });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
