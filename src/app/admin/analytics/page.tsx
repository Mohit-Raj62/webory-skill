import { ArrowLeft, TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import Enrollment from "@/models/Enrollment";
import Settings from "@/models/Settings";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/login?redirect=/admin/analytics");
  }

  await dbConnect();

  // Replicating the logic from /api/admin/stats to execute on the server
  const [
    totalUsers,
    totalCourses,
    totalInternships,
    totalApplications,
    recentEnrollmentsCount,
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
      { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseData" } },
      { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, total: { $sum: { $ifNull: ["$courseData.price", 0] } } } },
    ]),
    Application.aggregate([
      { $group: { _id: null, total: { $sum: { $ifNull: ["$amountPaid", 0] } } } },
    ]),
  ]);

  const pwaInstalls = (pwaSetting as any)?.value || 0;
  const courseRevenue = courseRevenueResult[0]?.total || 0;
  const internshipRevenue = internshipRevenueResult[0]?.total || 0;
  const revenue = courseRevenue + internshipRevenue;

  const enhancedTopCourses = await Course.aggregate([
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $lookup: { from: "enrollments", localField: "_id", foreignField: "course", as: "enrollmentData" } },
      { $addFields: { totalEnrollments: { $size: "$enrollmentData" }, completedEnrollments: { $size: { $filter: { input: "$enrollmentData", as: "e", cond: { $eq: ["$$e.completed", true] } } } } } },
      { $project: { title: 1, views: 1, studentsCount: 1, price: 1, completionRate: { $cond: [{ $gt: ["$totalEnrollments", 0] }, { $round: [{ $multiply: [{ $divide: ["$completedEnrollments", "$totalEnrollments"] }, 100] }, 0] }, 0] } } }
  ]);

  const revenueDistributionRaw = await Enrollment.aggregate([
    { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
    { $unwind: "$courseDetails" },
    { $group: { _id: "$courseDetails.title", total: { $sum: "$courseDetails.price" } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const userGrowthRaw = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const revenueTrendRaw = await Enrollment.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDetails" } },
    { $unwind: "$courseDetails" },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$courseDetails.price" } } },
    { $sort: { _id: 1 } },
  ]);

  const stats = JSON.parse(JSON.stringify({
    totalUsers,
    totalCourses,
    revenue,
    totalApplications,
    topCourses: enhancedTopCourses,
    charts: {
      userGrowth: userGrowthRaw,
      revenueTrend: revenueTrendRaw,
      revenueDistribution: revenueDistributionRaw,
    }
  }));

  return (
    <div className="p-4 md:p-8 space-y-8 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Analytics</h1>
          <p className="text-gray-400">Deep dive into your platform's performance</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers || 0}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${stats.revenue?.toLocaleString() || 0}`}
          color="text-green-400"
          bgColor="bg-green-500/10"
          borderColor="border-green-500/20"
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.totalCourses || 0}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
        />
        <StatCard
          icon={TrendingUp}
          label="Applications"
          value={stats.totalApplications || 0}
          color="text-orange-400"
          bgColor="bg-orange-500/10"
          borderColor="border-orange-500/20"
        />
      </div>

      {/* Charts Section */}
      <AnalyticsCharts stats={stats} />

      {/* Detailed Top Courses Table */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5">
        <h3 className="text-xl font-bold text-white mb-6">Detailed Course Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-200 uppercase bg-white/5 font-bold">
              <tr>
                <th className="px-6 py-3 rounded-l-lg">Course Title</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Views</th>
                <th className="px-6 py-3">Students</th>
                <th className="px-6 py-3">Conversion</th>
                <th className="px-6 py-3">Completion</th>
                <th className="px-6 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.topCourses?.map((course: any) => {
                 const conversionRate = course.views > 0 
                    ? ((course.studentsCount || 0) / course.views * 100).toFixed(1) 
                    : 0;

                 return (
                <tr key={course._id} className="bg-transparent hover:bg-white/5 transition-colors border-b border-white/5">
                  <td className="px-6 py-4 font-medium text-white">{course.title}</td>
                  <td className="px-6 py-4">₹{course.price}</td>
                  <td className="px-6 py-4 text-blue-400 font-bold">{course.views || 0}</td>
                  <td className="px-6 py-4 text-green-400 font-bold">{course.studentsCount || 0}</td>
                  <td className="px-6 py-4 text-yellow-500 font-bold">{conversionRate}%</td>
                  <td className="px-6 py-4 text-purple-400 font-bold">{course.completionRate || 0}%</td>
                  <td className="px-6 py-4">
                     <Link href={`/courses/${course._id}`} target="_blank">
                        <Button variant="link" size="sm" className="text-purple-400">View Page</Button>
                     </Link>
                  </td>
                </tr>
                 );
              })}
               {(!stats.topCourses || stats.topCourses.length === 0) && (
                  <tr><td colSpan={7} className="text-center py-6">No data available.</td></tr>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor, borderColor }: any) {
  return (
    <div className={`p-6 rounded-xl border ${borderColor} ${bgColor}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-black/20 ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}
