"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Video, FileQuestion } from "lucide-react";

interface DailyStats {
    date: string;
    totalActivities: number;
    videoMinutes: number;
    questionsAttempted: number;
}

interface ActivityDashboardProps {
    category: 'course' | 'internship';
    title: string;
}

export function ActivityDashboard({ category, title }: ActivityDashboardProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dailyStats, setDailyStats] = useState < { [key: string]: DailyStats } > ({});
    const [todayStats, setTodayStats] = useState({ videoMinutes: 0, questionsAttempted: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, [currentDate, category]);

    const fetchActivities = async () => {
        try {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const params = new URLSearchParams({
                category,
                startDate: startOfMonth.toISOString(),
                endDate: endOfMonth.toISOString(),
            });

            const res = await fetch(`/api/activities?${params}`);
            if (res.ok) {
                const data = await res.json();

                // Convert array to object keyed by date
                const statsMap: { [key: string]: DailyStats } = {};
                data.dailyStats.forEach((stat: DailyStats) => {
                    statsMap[stat.date] = stat;
                });
                setDailyStats(statsMap);

                // Get today's stats
                const today = new Date().toISOString().split('T')[0];
                if (statsMap[today]) {
                    setTodayStats({
                        videoMinutes: statsMap[today].videoMinutes,
                        questionsAttempted: statsMap[today].questionsAttempted,
                    });
                } else {
                    setTodayStats({ videoMinutes: 0, questionsAttempted: 0 });
                }
            }
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = () => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getColorIntensity = (count: number) => {
        if (count === 0) return "bg-gray-800/30 text-gray-600";
        if (count <= 2) return "bg-green-900/40 text-green-300";
        if (count <= 5) return "bg-green-700/60 text-green-200";
        if (count <= 7) return "bg-green-500/70 text-white";
        return "bg-green-400 text-white";
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth();
        const firstDay = getFirstDayOfMonth();
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const stats = dailyStats[dateStr];
            const activity = stats?.totalActivities || 0;

            days.push(
                <div
                    key={day}
                    className={`aspect-square rounded-xl ${getColorIntensity(activity)} flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 border border-white/10`}
                    title={stats ? `${stats.videoMinutes}min video, ${stats.questionsAttempted} questions` : 'No activity'}
                >
                    <span className="font-semibold text-xs">{day}</span>
                    {activity > 0 && (
                        <span className="text-[8px] opacity-70">{activity}</span>
                    )}
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return (
            <div className="glass-card p-6 rounded-2xl">
                <div className="text-center text-gray-400">Loading activity data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Today's Progress */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Today's Progress - {title}</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Video size={20} className="text-blue-400" />
                            <span className="text-sm text-gray-400">Video Watched</span>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{todayStats.videoMinutes}</p>
                        <p className="text-xs text-gray-500">Mins</p>
                    </div>

                    <div className="bg-black/20 p-6 rounded-xl border border-white/5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <FileQuestion size={20} className="text-purple-400" />
                            <span className="text-sm text-gray-400">Questions Attempted</span>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{todayStats.questionsAttempted}</p>
                        <p className="text-xs text-gray-500">Questions</p>
                    </div>
                </div>
            </div>

            {/* Monthly Calendar */}
            <div className="glass-card p-3 rounded-2xl max-w-md">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-white">Monthly Progress - {title}</h3>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={previousMonth}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={16} className="text-gray-400" />
                        </button>
                        <span className="text-white font-semibold min-w-[100px] text-center text-xs">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronRight size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-[15px] font-semibold text-gray-400 py-0.5">
                            {day.slice(0, 1)}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                    {renderCalendar()}
                </div>

                <div className="flex items-center gap-2 text-[15px] text-gray-400 mt-3">
                    <span>Less</span>
                    <div className="flex gap-0.5">
                        <div className="w-2 h-2 rounded bg-gray-800/30" />
                        <div className="w-2 h-2 rounded bg-green-900/40" />
                        <div className="w-2 h-2 rounded bg-green-700/60" />
                        <div className="w-2 h-2 rounded bg-green-500/70" />
                        <div className="w-2 h-2 rounded bg-green-400" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
