import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch statistics
    const [
      totalUsers,
      totalCourses,
      totalInternships,
      totalApplications,
      recentEnrollments,
      allEnrollments,
      allApplications
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      Enrollment.countDocuments({
        enrolledAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      Enrollment.find().populate('course').lean(),
      Application.find().populate('internship').lean()
    ]);

    // Calculate revenue (from enrollments and applications)
    const courseRevenue = allEnrollments.reduce((sum: number, enrollment: any) => {
      return sum + (enrollment.course?.price || 0);
    }, 0);

    const internshipRevenue = allApplications.reduce((sum: number, app: any) => {
      return sum + (app.amountPaid || 0);
    }, 0);

    const revenue = courseRevenue + internshipRevenue;

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalInternships,
      totalApplications,
      recentEnrollments,
      revenue,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
