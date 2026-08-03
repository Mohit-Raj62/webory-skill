import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Application from "@/models/Application";

export async function GET() {
  try {
    await dbConnect();

    // Fetch active courses
    const courses = await Course.find({ isAvailable: true })
      .select("_id title modules")
      .lean();

    // Fetch active internships
    const internships = await Internship.find({ isActive: true })
      .select("_id title modules")
      .lean();

    // Fetch pending/scheduled interviews
    const interviews = await Application.find({ 
      status: { $in: ["interview_pending", "interview_scheduled"] }
    })
      .populate("student", "firstName lastName email")
      .populate("internship", "title")
      .select("_id status student internship interviewDate")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        courses,
        internships,
        interviews,
      }
    });
  } catch (error) {
    console.error("Error fetching live options:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch live options" },
      { status: 500 }
    );
  }
}
