"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Video, FileQuestion, Zap, Award } from "lucide-react";

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
    const [dailyStats, setDailyStats] = useState<{ [key: string]: DailyStats }>({});
    const [todayStats, setTodayStats] = useState({ videoMinutes: 0, questionsAttempted: 0 });
    const [rankData, setRankData] = useState({ xp: 0, rank: 0, topPercentage: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
        fetchRank();
    }, [currentDate, category]);

    const fetchRank = async () => {
        try {
            const res = await fetch('/api/user/rank');
            if (res.ok) {
                const data = await res.json();
                setRankData(data);
            }
        } catch (error) {
            console.error("Failed to fetch rank", error);
        }
    };

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
                    className={`aspect-square rounded-md ${getColorIntensity(activity)} flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 border border-white/10`}
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
            <div className="p-6 rounded-xl border border-white/8 bg-[#0C1020]/60 text-center text-gray-400 text-xs">
                Loading activity data...
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Today's Progress */}
            <div className="relative group">
                <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={13} className="text-blue-400 animate-pulse" />
                        <span>Today's Momentum</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-white font-bold">{title}</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Video Minutes Card */}
                    <div className="group/card relative bg-gradient-to-br from-[#0F1426]/90 via-[#0C1020]/80 to-[#0A0D1B]/90 backdrop-blur-xl p-4 sm:p-4.5 rounded-xl border border-white/8 hover:border-blue-500/30 transition-all duration-300 shadow-md hover:shadow-blue-500/5">
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover/card:scale-105 transition-transform shrink-0">
                                    <Video size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-white tracking-tight">Video Learning</h4>
                                    <p className="text-[10px] text-slate-400 font-normal">Watch time</p>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                                Today
                            </span>
                        </div>

                        <div className="flex items-baseline gap-1.5 mt-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover/card:text-blue-400 transition-colors">
                                {todayStats.videoMinutes}
                            </p>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Minutes</span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 font-normal">Focus time spent on learning material</p>

                        {/* Progress Bar Accent */}
                        <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-3">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(Math.max((todayStats.videoMinutes / 60) * 100, 8), 100)}%` }} 
                            />
                        </div>
                    </div>

                    {/* Questions Card */}
                    <div className="group/card relative bg-gradient-to-br from-[#0F1426]/90 via-[#0C1020]/80 to-[#0A0D1B]/90 backdrop-blur-xl p-4 sm:p-4.5 rounded-xl border border-white/8 hover:border-purple-500/30 transition-all duration-300 shadow-md hover:shadow-purple-500/5">
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover/card:scale-105 transition-transform shrink-0">
                                    <FileQuestion size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-white tracking-tight">Practice & Quizzes</h4>
                                    <p className="text-[10px] text-slate-400 font-normal">Assessments</p>
                                </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-semibold">
                                Practice
                            </span>
                        </div>

                        <div className="flex items-baseline gap-1.5 mt-1">
                            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover/card:text-purple-400 transition-colors">
                                {todayStats.questionsAttempted}
                            </p>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questions</span>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-1 font-normal">Active participation in assessments</p>

                        {/* Progress Bar Accent */}
                        <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-3">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(Math.max((todayStats.questionsAttempted / 20) * 100, 8), 100)}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics & Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Monthly Calendar */}
                <div className="lg:col-span-1 relative group">
                    <div className="p-4 sm:p-4.5 rounded-xl border border-white/8 bg-[#0C1020]/80 backdrop-blur-xl w-full shadow-md">
                        <div className="flex flex-col gap-2.5 mb-3.5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-white tracking-tight">Monthly Analytics</h3>
                                <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-md border border-white/5">
                                    <button
                                        onClick={previousMonth}
                                        className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                                    >
                                        <ChevronLeft size={12} />
                                    </button>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider min-w-[70px] text-center">
                                        {monthNames[currentDate.getMonth()].slice(0, 3)} {currentDate.getFullYear()}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                                    >
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 leading-none">Activity for {title}</p>
                        </div>

                        <div className="overflow-hidden">
                            {/* Day names */}
                            <div className="grid grid-cols-7 gap-1.5 mb-2">
                                {dayNames.map(day => (
                                    <div key={day} className="text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wide">
                                        {day.slice(0, 1)}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1.5">
                                {renderCalendar()}
                            </div>
                        </div>

                        {/* Legend - Compact */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                                <span>Less</span>
                                <div className="flex gap-0.5">
                                    {[0,1,2,3,4].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-sm border border-white/5 ${
                                            i === 0 ? "bg-gray-800/30" : 
                                            i === 1 ? "bg-green-900/40" : 
                                            i === 2 ? "bg-green-700/60" : 
                                            i === 3 ? "bg-green-500/70" : "bg-green-400"
                                        }`} />
                                    ))}
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance & Streak Widget */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Activity Streak */}
                    <div className="p-4 sm:p-5 rounded-xl border border-white/8 bg-[#0C1020]/80 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group/streak shadow-md">
                        <div className="absolute top-0 right-0 p-5 text-orange-500/10 group-hover/streak:text-orange-500/20 transition-colors">
                            <Zap size={70} />
                        </div>
                        
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Learning Momentum</h3>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    {rankData.xp}
                                </div>
                                <div>
                                    <p className="text-orange-400 font-bold uppercase text-[10px] tracking-wider">Total XP</p>
                                    <p className="text-slate-400 text-[10px] font-normal">Keep earning points!</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-1.5">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                const dayActivities = Object.values(dailyStats).filter(a => a.totalActivities > 0).length;
                                return (
                                <div key={i} className="flex-1 text-center">
                                    <div className={`aspect-square rounded-md flex items-center justify-center border transition-all duration-300 mb-1 ${
                                        i < (dayActivities % 7)
                                        ? "bg-orange-500/20 border-orange-500/50 text-orange-400" 
                                        : "bg-white/5 border-white/5 text-slate-600"
                                    }`}>
                                        <Zap size={11} className={i < (dayActivities % 7) ? "animate-pulse" : ""} />
                                    </div>
                                    <p className="text-[9px] font-semibold text-slate-500">{day}</p>
                                </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Skill Mastery / Progress */}
                    <div className="p-4 sm:p-5 rounded-xl border border-white/8 bg-[#0C1020]/80 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group/mastery shadow-md">
                        <div className="absolute -bottom-4 -right-4 p-5 text-blue-500/10 group-hover/mastery:text-blue-500/20 transition-colors rotate-12">
                            <Award size={80} />
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Global Rank</h3>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">#{rankData.rank || '---'}</div>
                                <div>
                                    <p className="text-blue-400 font-bold uppercase text-[10px] tracking-wider">Top {rankData.topPercentage}%</p>
                                    <p className="text-slate-400 text-[10px] font-normal">Among peers</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 space-y-2.5 relative z-10">
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider">
                                    <span className="text-slate-400">Mastery</span>
                                    <span className="text-blue-400 font-bold">
                                        {rankData.xp > 5000 ? 'Expert' : rankData.xp > 1000 ? 'Professional' : 'Rookie'}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-600 to-purple-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-700" 
                                        style={{ width: `${Math.min((rankData.xp / 10000) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-semibold uppercase tracking-wider">
                                    {rankData.xp} XP
                                </div>
                                <p className="text-[9px] font-medium text-slate-500">Lifetime Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
