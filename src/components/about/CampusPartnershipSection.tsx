"use client";

import { GraduationCap, Building2, CheckCircle2, ArrowRight, Laptop, Award, Users } from "lucide-react";
import Link from "next/link";

export function CampusPartnershipSection() {
    const offerings = [
        {
            title: "Semester Credit & Industrial Training",
            desc: "Formal evaluation and project completion reports aligned with university engineering syllabus and college credits.",
            icon: Award
        },
        {
            title: "Faculty & On-Campus Tech Bootcamps",
            desc: "Joint hands-on workshops in Full-Stack, AI, and Cloud Architecture led by IIT alumni and senior engineering mentors.",
            icon: Laptop
        },
        {
            title: "Institutional Placement Pipeline",
            desc: "Direct referrals and priority hiring interviews for partner college students with leading tech startups and IT companies.",
            icon: Users
        },
        {
            title: "Official MoU & Verification Integration",
            desc: "Structured institutional Memorandums of Understanding with co-branded certificates and dedicated college coordinator portals.",
            icon: Building2
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="rounded-2xl border border-slate-800 bg-[#0b101b] p-8 sm:p-12 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left Column: Heading & Institutional Badge */}
                        <div className="lg:col-span-5 space-y-5 text-left">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                                Webory For Higher Education
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                                University & Campus Partnerships
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                We collaborate with engineering colleges, universities, and Training & Placement Cells (TPOs) to deliver curriculum-integrated industrial training and valid internship credits.
                            </p>

                            {/* Featured Association Tag */}
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Featured Academic Association
                                </div>
                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                    <GraduationCap size={16} className="text-blue-400" />
                                    <span>In Association with JBIT College</span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Campus industrial bootcamps, project guidance, and official joint credential verification.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link href="/contact">
                                    <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2">
                                        <span>Partner Your College / Campus</span>
                                        <ArrowRight size={15} />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: 4 Offerings Grid */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {offerings.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <h3 className="text-sm font-bold text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

