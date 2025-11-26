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

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch basic stats
    const [totalUsers, totalEnrollments, totalApplications, enrollments, applications] =
      await Promise.all([
        User.countDocuments(),
        Enrollment.countDocuments(),
        Application.countDocuments(),
        Enrollment.find().populate("course").lean(),
        Application.find().lean(),
      ]);

    // Calculate revenue
    const courseRevenue = enrollments.reduce((sum: number, enrollment: any) => {
      return sum + (enrollment.course?.price || 0);
    }, 0);

    const internshipRevenue = applications.reduce((sum: number, app: any) => {
      return sum + (app.amountPaid || 0);
    }, 0);

    const revenue = courseRevenue + internshipRevenue;

    // Get popular courses
    const courseEnrollmentCounts: { [key: string]: any } = {};
    enrollments.forEach((enrollment: any) => {
      const courseId = enrollment.course?._id?.toString();
      if (courseId) {
        if (!courseEnrollmentCounts[courseId]) {
          courseEnrollmentCounts[courseId] = {
            title: enrollment.course.title,
            enrollments: 0,
            revenue: 0,
          };
        }
        courseEnrollmentCounts[courseId].enrollments += 1;
        courseEnrollmentCounts[courseId].revenue += enrollment.course.price || 0;
      }
    });

    const popularCourses = Object.values(courseEnrollmentCounts)
      .sort((a: any, b: any) => b.enrollments - a.enrollments)
      .slice(0, 5);

    // Recent activity (mock data for now)
    const recentActivity = [
      {
        type: "enrollment",
        description: "New course enrollment",
        timestamp: new Date(),
      },
      {
        type: "application",
        description: "New internship application",
        timestamp: new Date(Date.now() - 3600000),
      },
    ];

    return NextResponse.json({
      totalUsers,
      totalEnrollments,
      totalApplications,
      revenue,
      popularCourses,
      recentActivity,
    });
  } catch (error: any) {
    // Fixed syntax error
    console.error("Analytics error:", error);
    
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
