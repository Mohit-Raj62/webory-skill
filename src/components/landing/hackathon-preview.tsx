"use client";

import { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import Link from "next/link";
import { 
    Zap, 
    Code, 
    Terminal, 
    Trophy, 
    Users, 
    ArrowRight, 
    ShieldCheck, 
    Cpu, 
    CheckCircle2,
    Briefcase,
    Sparkles,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HackathonPreview() {
    const [prizePool, setPrizePool] = useState(0);
    const [builders, setBuilders] = useState(0);
    const [terminalText, setTerminalText] = useState("");
    const fullText = "arena.weboryskills.in";

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTerminalText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        const controls1 = animate(0, 5, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (latest) => setPrizePool(Math.round(latest))
        });

        const controls2 = animate(0, 2500, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate: (latest) => setBuilders(Math.round(latest))
        });

        return () => {
            clearInterval(typingInterval);
            controls1.stop();
            controls2.stop();
        };
    }, []);

    return (
        <section className="relative py-24 sm:py-32 bg-[#020307] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:36px_36px] pointer-events-none" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                
                {/* Section Header */}
                <div className="max-w-3xl mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4 backdrop-blur-md">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>The Execution Track</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                        Build In The Arena. <br />
                        <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                            Fast-Track To Real Internships.
                        </span>
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl">
                        A continuous proof-of-work pipeline. Team up for intense 48-hour competitive coding hackathons, deploy production applications, and graduate directly into verified industrial internships.
                    </p>
                </div>

                {/* Pipeline Flow Master Canvas */}
                <div className="rounded-3xl sm:rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-b from-[#0c0906]/90 via-[#07090e]/95 to-[#030408]/95 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
                        
                        {/* STAGE 1: THE ULTIMATE DEVELOPER ARENA (6 Cols) */}
                        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                            <div className="space-y-5">
                                {/* Top Badges */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                                        <Zap size={13} className="animate-pulse" />
                                        <span>Phase 01: Hackathon Arena</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-gray-400">48-Hour Sprints</span>
                                </div>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                                        The Ultimate <br />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400">
                                            Developer Arena
                                        </span>
                                    </h3>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-2">
                                        Stop following passive tutorials. Pick your role <span className="text-white font-medium">(UI/UX, Backend, AI)</span>, team up, and build a live product against top builders across India.
                                    </p>
                                </div>

                                {/* Feature Bullets */}
                                <div className="space-y-2.5 pt-1">
                                    {[
                                        { icon: ShieldCheck, text: "Earn official blockchain-verified certificates" },
                                        { icon: Cpu, text: "Build with DevLab & modern cloud stacks" },
                                        { icon: Trophy, text: "Win cash prizes, premium swags, and interview referrals" }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                                <feature.icon size={13} className="text-orange-400" />
                                            </div>
                                            <span className="text-gray-300 text-xs sm:text-sm font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Terminal Telemetry Widget */}
                                <div className="rounded-2xl bg-[#07070a] border border-white/10 overflow-hidden shadow-lg">
                                    <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                                            <Terminal size={11} className="text-orange-400" />
                                            <span>{terminalText}</span>
                                            <span className="animate-pulse text-orange-400">_</span>
                                        </div>
                                    </div>

                                    <div className="p-3.5 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                                <Code size={16} />
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-white block">Build. Ship. Win.</span>
                                                <span className="text-[10px] text-gray-400">Verified Submissions</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-right">
                                                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Prize Pool</span>
                                                <span className="text-xs font-black text-white">₹{prizePool}L+</span>
                                            </div>
                                            <div className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-right">
                                                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Builders</span>
                                                <span className="text-xs font-black text-white">{builders.toLocaleString()}+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <Link href="/hackathons" className="block w-full pt-2">
                                <Button className="w-full h-11 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01]">
                                    <span className="flex items-center justify-center gap-2">
                                        Enter Developer Arena <ArrowRight size={14} />
                                    </span>
                                </Button>
                            </Link>
                        </div>

                        {/* STAGE 2: REAL-WORLD INTERNSHIPS (6 Cols) */}
                        <div className="lg:col-span-6 flex flex-col justify-between space-y-6 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-10">
                            <div className="space-y-5">
                                {/* Top Badges */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                        <Briefcase size={13} />
                                        <span>Phase 02: Industrial Internships</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Q1 Batch Enrolling
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                                        Launch Your Career with <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                            Real-World Internships
                                        </span>
                                    </h3>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-2">
                                        Don't just learn theory—apply skills on industrial codebases. Work alongside engineering mentors and build a verified portfolio that impresses hiring managers.
                                    </p>
                                </div>

                                {/* 6 Features Chips Matrix */}
                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                    {[
                                        "Industry Certification",
                                        "Real-world Projects",
                                        "Mentorship Support",
                                        "Flexible Timings",
                                        "Stipend Opportunities",
                                        "Recommendation Letters",
                                    ].map((item, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center gap-2.5 bg-white/[0.02] hover:bg-white/[0.05] p-2.5 rounded-xl border border-white/[0.05] hover:border-emerald-500/30 transition-all"
                                        >
                                            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                                <CheckCircle2 size={13} />
                                            </div>
                                            <span className="text-gray-200 font-semibold text-xs truncate">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Placement Support Trust Card */}
                                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                            <Briefcase size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white block">
                                                Verified Industrial Evaluation
                                            </span>
                                            <span className="text-[11px] text-gray-400">
                                                Direct Corporate Placement Support
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Button */}
                            <Link href="/internships" className="block w-full pt-2">
                                <Button className="w-full h-11 text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01]">
                                    <span className="flex items-center justify-center gap-2">
                                        Apply For Internships <ArrowRight size={14} />
                                    </span>
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
