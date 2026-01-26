"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FreeExperienceHighlight() {
    return (
        <section className="py-10 bg-slate-950 relative overflow-hidden border-b border-white/5">
            {/* Subtle simplified glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[100px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="mx-auto max-w-4xl bg-gradient-to-r from-slate-900/80 to-black/80 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    
                    {/* Left: Text Content */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Risk-Free Trial</span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                            Experience Quality <span className="text-emerald-400">Before You Pay</span>
                        </h3>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span>First Module Unlocked</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span>No Credit Card Req.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Action */}
                    <Link href="/courses">
                        <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400 border-0 h-12 px-6 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all text-sm group">
                            <Play size={16} className="fill-current mr-2 group-hover:scale-110 transition-transform" />
                            WATCH MODULE 1 FREE
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
