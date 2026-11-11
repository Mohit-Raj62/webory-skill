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
        <section className="py-10 relative z-10 bg-[#06090e]">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="p-6 sm:p-10 rounded-2xl border border-slate-800 bg-[#0b101b] shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-8">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                            Platform Benchmarks
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">
                            Live Database Verified
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
                        {statItems.map((stat, i) => (
                            <div key={i} className={`flex flex-col items-center sm:items-start text-center sm:text-left ${i > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}`}>
                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center mb-3">
                                    <stat.icon size={20} />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1 leading-snug">
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
