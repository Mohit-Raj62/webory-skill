"use client";

import { Users, Target, Globe, Heart } from "lucide-react";

const stats = [
    { label: "Students Enrolled", value: "100+", icon: Users, color: "text-blue-400" },
    { label: "Expert Mentors (incl. IIT Faculty)", value: "10+", icon: Target, color: "text-purple-400" },
    { label: "Hiring Partners", value: "5+", icon: Globe, color: "text-pink-400" },
    { label: "Success Rate", value: "90%", icon: Heart, color: "text-green-400" }
];

export function StatsSection() {
    return (
        <section className="py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-transparent to-purple-500 opacity-50"></div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className={`mb-3 flex justify-center transform group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                                    <stat.icon size={32} />
                                </div>
                                <div className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
