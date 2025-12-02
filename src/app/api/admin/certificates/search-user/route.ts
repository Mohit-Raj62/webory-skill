import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import Course from "@/models/Course"; // Ensure models are registered
import Internship from "@/models/Internship"; // Ensure models are registered

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch Enrollments
    const enrollments = await Enrollment.find({ student: user._id })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // Fetch Internships
    const applications = await Application.find({
      student: user._id,
      status: "approved",
    })
      .populate("internship", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      enrollments: enrollments.map((e) => ({
        id: e._id,
        type: "course",
        title: e.course.title,
        progress: e.progress,
        certificateId: e.certificateId,
        date: e.updatedAt,
      })),
      internships: applications.map((a) => ({
        id: a._id,
        type: "internship",
        title: a.internship.title,
        status: a.status,
        certificateId: a.certificateId,
        date: a.completedAt || a.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
