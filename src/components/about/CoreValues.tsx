"use client";

import { Code2, Users, ShieldCheck, Target, HeartHandshake, Zap } from "lucide-react";

export function CoreValues() {
    const values = [
        {
            title: "Production-Grade Engineering",
            desc: "We prioritize actual code over passive video watching. Students build full-stack web and AI applications using the same tools and Git workflows used by top engineering teams.",
            icon: Code2
        },
        {
            title: "1-on-1 Senior Mentorship",
            desc: "Guidance from practicing software engineers and IIT faculty mentors. Dedicated doubt solving, architectural discussions, and mock interviews.",
            icon: Users
        },
        {
            title: "Authentic & Verifiable Credentials",
            desc: "Every certification carries valid MSME registration numbers and unique QR codes that employers can verify online in seconds.",
            icon: ShieldCheck
        },
        {
            title: "Democratized Access",
            desc: "Equal opportunity for students across Tier-2 and Tier-3 institutions. We keep our programs accessible and outcome-oriented without predatory pricing.",
            icon: HeartHandshake
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Core Principles
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Why Students & Colleges Trust Webory
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        The values that guide every curriculum decision, mentorship session, and cohort we launch.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {values.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-md group"
                        >
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

