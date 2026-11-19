"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
    return (
        <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#0b101b] p-5 sm:p-10 md:p-14 text-center shadow-2xl">
                <div className="max-w-2xl mx-auto space-y-4">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                        Ready to Build Your Career?
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Start Your Industrial Engineering Journey
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                        Join ambitious college students and graduates who are building production systems, securing MSME-verified certifications, and launching real tech careers.
                    </p>

                    <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 max-w-md sm:max-w-none mx-auto">
                        <Link href="/courses" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-600/20">
                                <span>Browse Courses</span>
                                <ArrowRight size={15} />
                            </Button>
                        </Link>
                        <Link href="/internships" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-lg border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white font-medium text-xs sm:text-sm transition-colors active:scale-95">
                                Explore Internships
                            </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button variant="ghost" className="w-full sm:w-auto h-11 px-4 text-slate-400 hover:text-white text-xs sm:text-sm active:scale-95">
                                Contact Advisory Team
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-5 sm:pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                        <span>Govt. Registered Startup • ISO & MSME Certified Programs</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
