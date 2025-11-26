"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, BookOpen, Briefcase, IndianRupee } from "lucide-react";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState < any > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/admin/analytics");
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Analytics & Reports</h1>
                <p className="text-gray-400">Platform insights and performance metrics</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users size={24} className="text-blue-400" />
                        </div>
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{analytics?.totalUsers || 0}</p>
                    <p className="text-green-400 text-sm mt-2">+12% this month</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <BookOpen size={24} className="text-purple-400" />
                        </div>
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Course Enrollments</p>
                    <p className="text-3xl font-bold text-white">{analytics?.totalEnrollments || 0}</p>
                    <p className="text-green-400 text-sm mt-2">+8% this month</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Briefcase size={24} className="text-green-400" />
                        </div>
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Applications</p>
                    <p className="text-3xl font-bold text-white">{analytics?.totalApplications || 0}</p>
                    <p className="text-green-400 text-sm mt-2">+15% this month</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <IndianRupee size={24} className="text-yellow-400" />
                        </div>
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">₹{analytics?.revenue || 0}</p>
                    <p className="text-green-400 text-sm mt-2">+20% this month</p>
                </div>
            </div>

            {/* Popular Courses */}
            <div className="glass-card p-6 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Popular Courses</h2>
                <div className="space-y-4">
                    {analytics?.popularCourses?.map((course: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{course.title}</h3>
                                    <p className="text-gray-400 text-sm">{course.enrollments} enrollments</p>
                                </div>
                            </div>
                            <span className="text-white font-bold">₹{course.revenue}</span>
                        </div>
                    )) || (
                            <div className="text-center py-8 text-gray-400">No data available</div>
                        )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {analytics?.recentActivity?.map((activity: any, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                            <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'enrollment' ? 'bg-blue-400' :
                                activity.type === 'application' ? 'bg-green-400' :
                                    'bg-purple-400'
                                }`} />
                            <div className="flex-1">
                                <p className="text-white">{activity.description}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )) || (
                            <div className="text-center py-8 text-gray-400">No recent activity</div>
                        )}
                </div>
            </div>
        </div>
    );
}
