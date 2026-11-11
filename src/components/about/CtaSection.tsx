"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#0b101b] p-8 sm:p-12 md:p-14 text-center shadow-2xl">
                <div className="max-w-2xl mx-auto space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
                        Ready to Build Your Career?
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Start Your Industrial Engineering Journey
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Join ambitious college students and graduates who are building production systems, securing MSME-verified certifications, and launching real tech careers.
                    </p>

                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                        <Link href="/courses">
                            <Button className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors flex items-center gap-2">
                                <span>Browse Courses</span>
                                <ArrowRight size={15} />
                            </Button>
                        </Link>
                        <Link href="/internships">
                            <Button variant="outline" className="h-11 px-6 rounded-lg border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white font-medium text-sm transition-colors">
                                Explore Internships
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="ghost" className="h-11 px-4 text-slate-400 hover:text-white text-sm">
                                Contact Advisory Team
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Govt. Registered Startup • ISO & MSME Certified Programs</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
