"use client";

import { Users, GraduationCap, Building2, TrendingUp } from "lucide-react";

interface StatsSectionProps {
    stats?: {
        studentsCount?: number;
        mentorsCount?: number;
        partnersCount?: number;
        successRate?: number;
    };
}

export function StatsSection({ stats }: StatsSectionProps) {
    const studentCount = stats?.studentsCount ? `${stats.studentsCount}+` : "100+";
    const mentorCount = stats?.mentorsCount ? `${stats.mentorsCount}+` : "10+";
    const partnerCount = stats?.partnersCount ? `${stats.partnersCount}+` : "5+";
    const successRate = stats?.successRate ? `${stats.successRate}%` : "90%";

    const statItems = [
        { label: "Students Enrolled", value: studentCount, icon: Users },
        { label: "Expert Mentors (incl. IIT Faculty)", value: mentorCount, icon: GraduationCap },
        { label: "Hiring Partners", value: partnerCount, icon: Building2 },
        { label: "Completion & Placement", value: successRate, icon: TrendingUp }
    ];

    return (
        <section className="py-8 sm:py-10 relative z-10 bg-[#06090e]">
            <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8">
                <div className="p-4 sm:p-8 md:p-10 rounded-2xl border border-slate-800 bg-[#0b101b] shadow-lg">
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 sm:pb-4 mb-6 sm:mb-8">
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Platform Benchmarks
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">
                            Live Database Verified
                        </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
                        {statItems.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left p-3 sm:p-0 rounded-xl bg-slate-900/30 sm:bg-transparent border border-slate-800/40 sm:border-none">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center mb-2 sm:mb-3">
                                    <stat.icon size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wider mt-1 leading-snug">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
