"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, FileQuestion, Zap, Award } from "lucide-react";

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
        <div className="space-y-8">
            {/* Premium Today's Progress - Balanced Version */}
            <div className="relative group">
                {/* Background Accent Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] -z-10" />
                
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Zap size={14} className="text-blue-500 animate-pulse" />
                    Today's Momentum <span className="text-slate-700 mx-2">/</span> <span className="text-white">{title}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Video Minutes Card */}
                    <div className="group/card relative bg-slate-900/40 backdrop-blur-2xl p-7 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover/card:scale-110 transition-transform duration-500">
                                <Video size={24} />
                            </div>
                            <div className="text-right">
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-tighter">Active</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black text-white tracking-tighter group-hover/card:text-blue-400 transition-colors">
                                {todayStats.videoMinutes}
                            </p>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Minutes</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 font-bold tracking-tight">Focus time spent on learning material</p>
                        
                        {/* Decorative Chart-like Element */}
                        <div className="absolute bottom-0 left-8 right-8 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/3 rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Questions Card */}
                    <div className="group/card relative bg-slate-900/40 backdrop-blur-2xl p-7 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover/card:scale-110 transition-transform duration-500">
                                <FileQuestion size={24} />
                            </div>
                            <div className="text-right">
                                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-tighter">Practice</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black text-white tracking-tighter group-hover/card:text-purple-400 transition-colors">
                                {todayStats.questionsAttempted}
                            </p>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Questions</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 font-bold tracking-tight">Active participation in assessments</p>

                        <div className="absolute bottom-0 left-8 right-8 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-1/4 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics & Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Calendar */}
                <div className="lg:col-span-1 relative group">
                    <div className="glass-card p-4 md:p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-2xl w-full">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-white tracking-tight">Monthly Analytics</h3>
                                <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-lg border border-white/5">
                                    <button
                                        onClick={previousMonth}
                                        className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest min-w-[80px] text-center">
                                        {monthNames[currentDate.getMonth()].slice(0, 3)} {currentDate.getFullYear()}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Activity for {title}</p>
                        </div>

                        <div className="overflow-hidden">
                            {/* Day names */}
                            <div className="grid grid-cols-7 gap-1.5 mb-2">
                                {dayNames.map(day => (
                                    <div key={day} className="text-center text-[8px] font-black text-slate-700 uppercase tracking-widest">
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
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">
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
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Activity Streak */}
                    <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden group/streak">
                        <div className="absolute top-0 right-0 p-8 text-orange-500/10 group-hover/streak:text-orange-500/20 transition-colors">
                            <Zap size={120} />
                        </div>
                        
                        <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Learning Momentum</h3>
                            <div className="flex items-center gap-4">
                                <div className="text-6xl font-black text-white tracking-tighter">
                                    {rankData.xp}
                                </div>
                                <div>
                                    <p className="text-orange-500 font-black uppercase text-[10px] tracking-widest">Total XP</p>
                                    <p className="text-slate-500 text-[10px] font-medium mt-1">Keep earning points!</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                const dayActivities = Object.values(dailyStats).filter(a => a.totalActivities > 0).length;
                                return (
                                <div key={i} className="flex-1 text-center">
                                    <div className={`aspect-square rounded-lg flex items-center justify-center border transition-all duration-500 mb-2 ${
                                        i < (dayActivities % 7)
                                        ? "bg-orange-500/20 border-orange-500/50 text-orange-400" 
                                        : "bg-white/5 border-white/5 text-slate-700"
                                    }`}>
                                        <Zap size={12} className={i < (dayActivities % 7) ? "animate-pulse" : ""} />
                                    </div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase">{day}</p>
                                </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Skill Mastery / Progress */}
                    <div className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden group/mastery">
                        <div className="absolute -bottom-6 -right-6 p-8 text-blue-500/10 group-hover/mastery:text-blue-500/20 transition-colors rotate-12">
                            <Award size={140} />
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Global Rank</h3>
                            <div className="flex items-center gap-4">
                                <div className="text-5xl font-black text-white tracking-tighter">#{rankData.rank || '---'}</div>
                                <div>
                                    <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest">Top {rankData.topPercentage}%</p>
                                    <p className="text-slate-500 text-[10px] font-medium mt-1">Among peers</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Mastery Level</span>
                                    <span className="text-blue-400">
                                        {rankData.xp > 5000 ? 'Expert' : rankData.xp > 1000 ? 'Professional' : 'Rookie'}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-600 to-purple-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000" 
                                        style={{ width: `${Math.min((rankData.xp / 10000) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">
                                    {rankData.xp} XP Points
                                </div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-right">Lifetime Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
