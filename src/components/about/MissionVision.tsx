"use client";

import { Target, Compass, CheckCircle2 } from "lucide-react";

export function MissionVision() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Guiding Principles
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Our Mission & Vision
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Built with a clear, singular purpose: empowering students across India with genuine software engineering proficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mission Card */}
                    <div className="rounded-xl border border-slate-800 bg-[#0b101b] p-8 sm:p-10 flex flex-col justify-between shadow-lg">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center">
                                <Target size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                Our Mission
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                To eliminate the gap between college education and industry expectations. We believe every aspiring engineer deserves direct access to production-level codebases, realistic workflows, and verified industrial credentials regardless of their college tier or location.
                            </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                                <span>100% practical, project-driven learning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                                <span>Democratizing top-tier tech education for Tier-2 & Tier-3 colleges</span>
                            </div>
                        </div>
                    </div>

                    {/* Vision Card */}
                    <div className="rounded-xl border border-slate-800 bg-[#0b101b] p-8 sm:p-10 flex flex-col justify-between shadow-lg">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center">
                                <Compass size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                Our Vision
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                To become India's premier practical career launchpad where students graduate not just with certificates, but with verifiable Git contributions, deployed full-stack products, and the engineering discipline demanded by high-growth tech companies worldwide.
                            </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                                <span>Verifiable career portfolios over paper resumes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                                <span>Direct placement pipelines with high-growth technology startups</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

