"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // --- Chart Configuration ---
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#ccc" }, // Dark mode text
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#ccc" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#ccc" },
      },
    },
  };

  // Process Real Data for Charts
  const processChartData = (data: any[], type: 'count' | 'total') => {
      const labels = [];
      const values = [];
      const today = new Date();
      
      for(let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          labels.push(dateStr); // e.g., "2023-10-27"
          
          const found = data?.find((item: any) => item._id === dateStr);
          values.push(found ? found[type] : 0);
      }
      return { labels, values };
  };

  const revenueChart = processChartData(stats?.charts?.revenueTrend || [], 'total');
  const userChart = processChartData(stats?.charts?.userGrowth || [], 'count');

  const revenueData = {
    labels: revenueChart.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: revenueChart.values,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const userGrowthData = {
    labels: userChart.labels,
    datasets: [
      {
        label: "New Users",
        data: userChart.values,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
      },
    ],
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
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
          value={stats?.totalUsers || 0}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${stats?.revenue?.toLocaleString() || 0}`}
          color="text-green-400"
          bgColor="bg-green-500/10"
          borderColor="border-green-500/20"
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats?.totalCourses || 0}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
        />
        <StatCard
          icon={TrendingUp}
          label="Applications"
          value={stats?.totalApplications || 0}
          color="text-orange-400"
          bgColor="bg-orange-500/10"
          borderColor="border-orange-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Revenue Trend (Last 7 Days)</h3>
          <Line options={chartOptions} data={revenueData} />
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">User Growth (Last 7 Days)</h3>
          <Bar options={chartOptions} data={userGrowthData} />
        </div>
         <div className="glass-card p-6 rounded-2xl lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Revenue Distribution by Course</h3>
            <div className="h-64 flex justify-center">
                 <Doughnut 
                    data={{
                        labels: stats?.charts?.revenueDistribution?.map((d: any) => d._id) || [],
                        datasets: [{
                            data: stats?.charts?.revenueDistribution?.map((d: any) => d.total) || [],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                            ],
                            borderWidth: 0
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'right', labels: { color: '#ccc' } } }
                    }} 
                />
            </div>
        </div>
      </div>

      {/* Detailed Top Courses Table */}
      <div className="glass-card p-6 rounded-2xl">
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
              {stats?.topCourses?.map((course: any) => {
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
               {(!stats?.topCourses || stats?.topCourses.length === 0) && (
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
