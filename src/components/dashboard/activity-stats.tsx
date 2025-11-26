"use client";

import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Video, FileQuestion } from "lucide-react";

interface DayActivity {
    date: number;
    activity: number;
    videosWatched: number;
    questionsAttempted: number;
}

export function ContributionActivity() {
    const [activityData, setActivityData] = useState < DayActivity[] > ([]);

    useEffect(() => {
        // Generate mock activity data for the last 30 days
        const generateMockData = () => {
            const data: DayActivity[] = [];
            const today = new Date();

            for (let i = 29; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const activity = Math.floor(Math.random() * 10);
                data.push({
                    date: date.getDate(),
                    activity,
                    videosWatched: Math.floor(Math.random() * 5),
                    questionsAttempted: Math.floor(Math.random() * 8)
                });
            }
            return data;
        };

        setActivityData(generateMockData());
    }, []);

    const getColorIntensity = (count: number) => {
        if (count === 0) return "bg-gray-800/50";
        if (count <= 2) return "bg-blue-900/50";
        if (count <= 5) return "bg-blue-700/70";
        if (count <= 7) return "bg-blue-500/80";
        return "bg-blue-400";
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                    <Calendar size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Contribution Activity</h3>
                    <p className="text-sm text-gray-400">Last 30 days of learning activity</p>
                </div>
            </div>

            <div className="grid grid-cols-10 gap-1">
                {activityData.map((day, index) => (
                    <div
                        key={index}
                        className={`aspect-square rounded-sm ${getColorIntensity(day.activity)} transition-all hover:scale-110 cursor-pointer flex items-center justify-center text-xs text-white/50`}
                        title={`Day ${day.date}: ${day.activity} activities`}
                    >
                        {day.date}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mt-4">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-800/50" />
                    <div className="w-3 h-3 rounded-sm bg-blue-900/50" />
                    <div className="w-3 h-3 rounded-sm bg-blue-700/70" />
                    <div className="w-3 h-3 rounded-sm bg-blue-500/80" />
                    <div className="w-3 h-3 rounded-sm bg-blue-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}

export function TodayProgress() {
    const [todayData, setTodayData] = useState({
        minsWatched: 0,
        questionsAttempted: 0
    });

    useEffect(() => {
        setTodayData({
            minsWatched: Math.floor(Math.random() * 120),
            questionsAttempted: Math.floor(Math.random() * 15)
        });
    }, []);

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Today's Progress</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-6 rounded-xl border border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Video size={20} className="text-blue-400" />
                        <span className="text-sm text-gray-400">Video Watched</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{todayData.minsWatched}</p>
                    <p className="text-xs text-gray-500">Mins</p>
                </div>

                <div className="bg-black/20 p-6 rounded-xl border border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <FileQuestion size={20} className="text-purple-400" />
                        <span className="text-sm text-gray-400">Questions Attempted</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{todayData.questionsAttempted}</p>
                    <p className="text-xs text-gray-500">Questions</p>
                </div>
            </div>
        </div>
    );
}

export function MonthlyProgress() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthData, setMonthData] = useState < { [key: number]: number } > ({});

    useEffect(() => {
        // Generate mock data for the current month
        const data: { [key: number]: number } = {};
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            data[i] = Math.floor(Math.random() * 10);
        }
        setMonthData(data);
    }, [currentDate]);

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
        if (count <= 2) return "bg-blue-900/40 text-blue-300";
        if (count <= 5) return "bg-blue-700/60 text-blue-200";
        if (count <= 7) return "bg-blue-500/70 text-white";
        return "bg-blue-400 text-white";
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
            const activity = monthData[day] || 0;
            days.push(
                <div
                    key={day}
                    className={`aspect-square rounded-lg ${getColorIntensity(activity)} flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 border border-white/10`}
                >
                    <span className="text-xs font-semibold">{day}</span>
                    {activity > 0 && (
                        <span className="text-[10px] opacity-70">{activity}</span>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Monthly Progress</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-gray-400" />
                    </button>
                    <span className="text-white font-semibold min-w-[140px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mt-6">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-gray-800/30" />
                    <div className="w-4 h-4 rounded bg-blue-900/40" />
                    <div className="w-4 h-4 rounded bg-blue-700/60" />
                    <div className="w-4 h-4 rounded bg-blue-500/70" />
                    <div className="w-4 h-4 rounded bg-blue-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
