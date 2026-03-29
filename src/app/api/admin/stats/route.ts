import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Settings from "@/models/Settings";

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

    // Fetch base statistics
    const [
      totalUsers,
      totalCourses,
      totalInternships,
      totalApplications,
      recentEnrollments,
      pwaSetting,
      courseRevenueResult,
      internshipRevenueResult,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Internship.countDocuments(),
      Application.countDocuments(),
      Enrollment.countDocuments({
        enrolledAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Settings.findOne({ key: "pwa_installs" }).lean(),
      Enrollment.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "courseData",
          },
        },
        { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$courseData.price", 0] } } } },
      ]),
      Application.aggregate([
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amountPaid", 0] } } } },
      ]),
    ]);

    const pwaInstalls = pwaSetting?.value || 0;
    const courseRevenue = courseRevenueResult[0]?.total || 0;
    const internshipRevenue = internshipRevenueResult[0]?.total || 0;
    const revenue = courseRevenue + internshipRevenue;

    // Optimized Top Courses with Completion Rate using Aggregation
    const enhancedTopCourses = await Course.aggregate([
        { $sort: { views: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "enrollments",
                localField: "_id",
                foreignField: "course",
                as: "enrollmentData"
            }
        },
        {
            $addFields: {
                totalEnrollments: { $size: "$enrollmentData" },
                completedEnrollments: {
                    $size: {
                        $filter: {
                            input: "$enrollmentData",
                            as: "e",
                            cond: { $eq: ["$$e.completed", true] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                title: 1,
                views: 1,
                studentsCount: 1,
                price: 1,
                completionRate: {
                    $cond: [
                        { $gt: ["$totalEnrollments", 0] },
                        { $round: [{ $multiply: [{ $divide: ["$completedEnrollments", "$totalEnrollments"] }, 100] }, 0] },
                        0
                    ]
                }
            }
        }
    ]);

    // Revenue Distribution (Top 5 Earning Courses) - Keep as is but ensure it's efficient
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

    // Top Learners (Users with most XP) with Enrollment Count using Aggregation
    const topLearnersResult = await User.aggregate([
        { $match: { role: "student" } },
        { $sort: { xp: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "enrollments",
                localField: "_id",
                foreignField: "student",
                as: "enrollmentData"
            }
        },
        {
            $addFields: {
                coursesCount: { $size: "$enrollmentData" }
            }
        },
        {
            $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                avatar: 1,
                xp: 1,
                coursesCount: 1
            }
        }
    ]);

    const topLearnersWithCount = topLearnersResult;

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
      pwaInstalls,
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
      { status: 500 },
    );
  }
}
