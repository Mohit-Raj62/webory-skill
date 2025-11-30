"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";

export default function TeacherDashboard() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalEarnings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/teacher/stats");
                const data = await res.json();
                if (res.ok) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-white">Loading stats...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Courses */}
                <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <BookOpen className="text-blue-500" size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                            <TrendingUp size={16} /> +12%
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Total Courses</h3>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalCourses}</p>
                </div>

                {/* Total Students */}
                <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users className="text-purple-500" size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                            <TrendingUp size={16} /> +5%
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalStudents}</p>
                </div>

                {/* Total Earnings */}
                <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <DollarSign className="text-green-500" size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                            <TrendingUp size={16} /> +8%
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">Total Earnings</h3>
                    <p className="text-3xl font-bold text-white mt-1">₹{stats.totalEarnings}</p>
                </div>
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 text-center text-gray-400">
                    No recent activity to show.
                </div>
            </div>
        </div>
    );
}
