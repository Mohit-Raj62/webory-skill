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
      allApplications,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      Enrollment.countDocuments({
        enrolledAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Enrollment.find().populate("course").lean(),
      Application.find().populate("internship").lean(),
    ]);

    // Calculate revenue (from enrollments and applications)
    const courseRevenue = allEnrollments.reduce(
      (sum: number, enrollment: any) => {
        return sum + (enrollment.course?.price || 0);
      },
      0
    );

    const internshipRevenue = allApplications.reduce(
      (sum: number, app: any) => {
        return sum + (app.amountPaid || 0);
      },
      0
    );

    const revenue = courseRevenue + internshipRevenue;

    const topCoursesRaw = await Course.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views studentsCount price");

    // Enhanced Top Courses with Completion Rate
    const enhancedTopCourses = await Promise.all(
      topCoursesRaw.map(async (course: any) => {
        const enrollments = await Enrollment.find({
          course: course._id,
        }).select("completed");
        const total = enrollments.length;
        const completed = enrollments.filter((e) => e.completed).length;
        const completionRate = total > 0 ? (completed / total) * 100 : 0;

        return {
          ...course.toObject(),
          completionRate: Math.round(completionRate),
        };
      })
    );

    // Revenue Distribution (Top 5 Earning Courses)
    const revenueDistributionRaw = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $group: {
          _id: "$courseDetails.title",
          total: { $sum: "$courseDetails.price" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    // Top Learners (Users with most enrollments)
    const topLearnersRaw = await Enrollment.aggregate([
      {
        $group: {
          _id: "$student",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topLearners = await User.find({
      _id: { $in: topLearnersRaw.map((l) => l._id) },
    }).select("firstName lastName email avatar");

    // Map count back to user objects
    const topLearnersWithCount = topLearners
      .map((user) => {
        const learner = topLearnersRaw.find(
          (l) => l._id.toString() === user._id.toString()
        );
        return {
          ...user.toObject(),
          coursesCount: learner?.count || 0,
        };
      })
      .sort((a, b) => b.coursesCount - a.coursesCount);

    // Real User Growth (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowthRaw = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Real Revenue Trend (Last 7 Days from Enrollments)
    const revenueTrendRaw = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$courseDetails.price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalInternships,
      totalApplications,
      recentEnrollments,
      revenue,
      topCourses: enhancedTopCourses,
      topLearners: topLearnersWithCount,
      charts: {
        userGrowth: userGrowthRaw,
        revenueTrend: revenueTrendRaw,
        revenueDistribution: revenueDistributionRaw,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
