import { ArrowLeft, TrendingUp, Users, IndianRupee, BookOpen, Briefcase } from "lucide-react";
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

  const enhancedTopInternships = await Internship.aggregate([
      { $lookup: { from: "applications", localField: "_id", foreignField: "internship", as: "applicationData" } },
      { $addFields: { 
          totalApplications: { $size: "$applicationData" }, 
          paidApplications: { $size: { $filter: { input: "$applicationData", as: "a", cond: { $gt: ["$$a.amountPaid", 0] } } } },
          totalRevenue: { $sum: "$applicationData.amountPaid" }
      } },
      { $project: { title: 1, price: 1, totalApplications: 1, paidApplications: 1, totalRevenue: 1 } },
      { $sort: { totalApplications: -1 } },
      { $limit: 5 }
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
    totalInternships,
    revenue,
    courseRevenue,
    internshipRevenue,
    totalApplications,
    topCourses: enhancedTopCourses,
    topInternships: enhancedTopInternships,
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

      {/* Financial Overview */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <IndianRupee className="text-green-400" size={20} />
          Financial Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={IndianRupee}
            label="Course Revenue"
            value={`₹${stats.courseRevenue?.toLocaleString() || 0}`}
            color="text-teal-400"
            bgColor="bg-teal-500/10"
            borderColor="border-teal-500/20"
          />
          <StatCard
            icon={IndianRupee}
            label="Internship Revenue"
            value={`₹${stats.internshipRevenue?.toLocaleString() || 0}`}
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
            borderColor="border-emerald-500/20"
          />
          <div className="p-6 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-900/40 to-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden group hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/30 transition-all duration-500"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 shadow-inner">
                <IndianRupee size={28} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-300/80 uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
                  ₹{stats.revenue?.toLocaleString() || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={20} />
          Platform Metrics
        </h2>
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
            icon={BookOpen}
            label="Total Courses"
            value={stats.totalCourses || 0}
            color="text-purple-400"
            bgColor="bg-purple-500/10"
            borderColor="border-purple-500/20"
          />
          <StatCard
            icon={Briefcase}
            label="Total Internships"
            value={stats.totalInternships || 0}
            color="text-pink-400"
            bgColor="bg-pink-500/10"
            borderColor="border-pink-500/20"
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
      </div>

      {/* Charts Section */}
      <AnalyticsCharts stats={stats} />

      {/* Detailed Top Courses Table */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-6 flex items-center gap-3">
          <BookOpen className="text-blue-400" size={24} />
          Detailed Course Performance
        </h3>
        
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-xs uppercase tracking-wider">
                <th className="px-4 py-4 font-semibold">Course Title</th>
                <th className="px-4 py-4 font-semibold text-center">Price</th>
                <th className="px-4 py-4 font-semibold text-center">Views</th>
                <th className="px-4 py-4 font-semibold text-center">Students</th>
                <th className="px-4 py-4 font-semibold text-center">Conversion</th>
                <th className="px-4 py-4 font-semibold text-center">Completion</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.topCourses?.map((course: any) => {
                 const conversionRate = course.views > 0 
                    ? ((course.studentsCount || 0) / course.views * 100).toFixed(1) 
                    : 0;

                 return (
                <tr key={course._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                     <p className="font-bold text-white group-hover:text-blue-300 transition-colors">{course.title}</p>
                     <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {course._id}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-700">₹{course.price}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-blue-400 font-black text-lg">{course.views || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-emerald-400 font-black text-lg">{course.studentsCount || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-yellow-400 font-bold">{conversionRate}%</span>
                       <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(Number(conversionRate), 100)}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-purple-400 font-bold">{course.completionRate || 0}%</span>
                       <div className="w-16 h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${course.completionRate || 0}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                     <Link href={`/courses/${course._id}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors rounded-xl">View Page</Button>
                     </Link>
                  </td>
                </tr>
                 );
              })}
               {(!stats.topCourses || stats.topCourses.length === 0) && (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">No data available.</td></tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Top Internships Table */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-6 flex items-center gap-3">
          <Briefcase className="text-orange-400" size={24} />
          Detailed Internship Performance
        </h3>
        
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-xs uppercase tracking-wider">
                <th className="px-4 py-4 font-semibold">Internship Title</th>
                <th className="px-4 py-4 font-semibold text-center">Price</th>
                <th className="px-4 py-4 font-semibold text-center">Applications</th>
                <th className="px-4 py-4 font-semibold text-center">Paid Students</th>
                <th className="px-4 py-4 font-semibold text-center">Total Revenue</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.topInternships?.map((internship: any) => {
                 return (
                <tr key={internship._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                     <p className="font-bold text-white group-hover:text-orange-300 transition-colors">{internship.title}</p>
                     <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {internship._id}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-gray-700">₹{internship.price}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-blue-400 font-black text-lg">{internship.totalApplications || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-emerald-400 font-black text-lg">{internship.paidApplications || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 font-black text-xl tracking-tight">₹{internship.totalRevenue || 0}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                     <Link href={`/internships/${internship._id}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 transition-colors rounded-xl">View Page</Button>
                     </Link>
                  </td>
                </tr>
                 );
              })}
               {(!stats.topInternships || stats.topInternships.length === 0) && (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">No data available.</td></tr>
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
    <div className={`p-6 rounded-2xl border ${borderColor} ${bgColor} hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center gap-4">
        <div className={`p-3.5 rounded-xl bg-black/20 ${color} shadow-sm border border-white/5`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400 tracking-wide">{label}</p>
          <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}
