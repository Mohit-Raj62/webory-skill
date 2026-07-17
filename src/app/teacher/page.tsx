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
                <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl shadow-inner border border-blue-500/20">
                            <BookOpen className="text-blue-500" size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                            <TrendingUp size={16} /> +12%
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">Total Courses</h3>
                    <p className="text-3xl lg:text-4xl font-bold text-white mt-1">{stats.totalCourses}</p>
                </div>

                {/* Total Students */}
                <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl shadow-inner border border-purple-500/20">
                            <Users className="text-purple-500" size={24} />
                        </div>
                        <span className="text-green-500 text-sm font-medium flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                            <TrendingUp size={16} /> +5%
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">Total Students</h3>
                    <p className="text-3xl lg:text-4xl font-bold text-white mt-1">{stats.totalStudents}</p>
                </div>

                {/* Total Earnings */}
                <div className="p-6 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-900/40 to-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden group hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-500/30 transition-all duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30 shadow-inner">
                            <DollarSign className="text-green-400" size={24} />
                        </div>
                        <span className="text-green-400 text-sm font-bold flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                            <TrendingUp size={16} /> +8%
                        </span>
                    </div>
                    <h3 className="text-green-300/80 text-sm font-medium uppercase tracking-wider mb-1 relative z-10">Total Earnings</h3>
                    <p className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200 mt-1 relative z-10">₹{stats.totalEarnings}</p>
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
