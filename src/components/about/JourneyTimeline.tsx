"use client";

import { Calendar, Rocket, Award, Users, ChevronRight } from "lucide-react";

export function JourneyTimeline() {
    const milestones = [
        {
            year: "2024",
            title: "The Genesis & Core Vision",
            desc: "Founded by Mohit Sinha to solve the growing divide between college theory and corporate engineering demands. Started with small pilot batches focused 100% on live codebases.",
            icon: Rocket,
            tag: "Inception"
        },
        {
            year: "2025",
            title: "MSME Recognition & College Alliances",
            desc: "Granted official MSME Startup recognition (UDYAM-BR-26-0208472). Partnered with institutional networks like JBIT College and onboarded distinguished mentors from IIT Mandi.",
            icon: Award,
            tag: "Accreditation"
        },
        {
            year: "2026",
            title: "The AI Systems Era & 10,000+ Community",
            desc: "Expanded into Gen AI engineering tracks, interactive project simulators, QR-verifiable certification portals, and direct industrial hiring pipelines for ambitious tech talent across India.",
            icon: Users,
            tag: "Scale & Impact"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Our Journey & Milestones
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        From a Student Vision to a National Platform
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Every step in our growth has been driven by one simple commitment: making world-class engineering education accessible, practical, and career-defining.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {milestones.map((milestone, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-xl border border-slate-800 bg-[#0b101b] p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-md group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-black text-blue-400 font-mono tracking-tight">
                                        {milestone.year}
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">
                                        {milestone.tag}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {milestone.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    {milestone.desc}
                                </p>
                            </div>

                            <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                                <span>Milestone {idx + 1} of 3</span>
                                <milestone.icon size={16} className="text-blue-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

