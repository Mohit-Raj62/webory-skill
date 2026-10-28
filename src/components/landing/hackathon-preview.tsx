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
        <section className="relative py-12 sm:py-16 md:py-20 bg-[#020307] overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl xl:max-w-6xl">
                
                {/* Section Header */}
                <div className="max-w-2xl mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-semibold mb-2.5 backdrop-blur-md">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>The Execution Track</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Build In The Arena. <br />
                        <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                            Fast-Track To Real Internships.
                        </span>
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xl">
                        A continuous proof-of-work pipeline. Team up for intense 48-hour competitive coding hackathons, deploy production applications, and graduate directly into verified industrial internships.
                    </p>
                </div>

                {/* Dual Track Cards (Stage 1 & Stage 2) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
                    
                    {/* STAGE 1: THE ULTIMATE DEVELOPER ARENA */}
                    <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#140e08]/85 via-[#0d0a06]/90 to-[#070705]/95 border border-orange-500/20 hover:border-orange-500/35 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-4 transition-all">
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
                        <div className="space-y-4">
                            {/* Top Badges */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold">
                                    <Zap size={12} className="animate-pulse" />
                                    <span>Phase 01: Hackathon Arena</span>
                                </div>
                                <span className="text-[10px] font-mono text-gray-400">48-Hour Sprints</span>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                                    The Ultimate <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400">
                                        Developer Arena
                                    </span>
                                </h3>
                                <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mt-1.5">
                                    Stop following passive tutorials. Pick your role <span className="text-white font-medium">(UI/UX, Backend, AI)</span>, team up, and build a live product against top builders across India.
                                </p>
                            </div>

                            {/* Feature Bullets */}
                            <div className="space-y-2 pt-0.5">
                                {[
                                    { icon: ShieldCheck, text: "Earn official blockchain-verified certificates" },
                                    { icon: Cpu, text: "Build with DevLab & modern cloud stacks" },
                                    { icon: Trophy, text: "Win cash prizes, premium swags, and interview referrals" }
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className="w-5 h-5 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                            <feature.icon size={11} className="text-orange-400" />
                                        </div>
                                        <span className="text-gray-300 text-[11px] sm:text-xs font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Terminal Telemetry Widget */}
                            <div className="rounded-xl bg-[#07070a]/90 border border-white/[0.08] overflow-hidden shadow-lg">
                                <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                                        <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                                        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                                    </div>
                                    <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                                        <Terminal size={10} className="text-orange-400" />
                                        <span>{terminalText}</span>
                                        <span className="animate-pulse text-orange-400">_</span>
                                    </div>
                                </div>

                                <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                            <Code size={14} />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-bold text-white block">Build. Ship. Win.</span>
                                            <span className="text-[9px] text-gray-400">Verified Submissions</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <div className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-right">
                                            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-bold">Prize Pool</span>
                                            <span className="text-[11px] font-black text-white">₹{prizePool}L+</span>
                                        </div>
                                        <div className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-right">
                                            <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-bold">Builders</span>
                                            <span className="text-[11px] font-black text-white">{builders.toLocaleString()}+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <Link href="/hackathons" className="block w-full pt-1">
                            <Button className="w-full h-9 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]">
                                <span className="flex items-center justify-center gap-1.5">
                                    Enter Developer Arena <ArrowRight size={13} />
                                </span>
                            </Button>
                        </Link>
                    </div>

                    {/* STAGE 2: REAL-WORLD INTERNSHIPS */}
                    <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#081514]/85 via-[#060f0e]/90 to-[#040808]/95 border border-emerald-500/20 hover:border-emerald-500/35 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between space-y-4 transition-all">
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
                        <div className="space-y-4">
                            {/* Top Badges */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                                    <Briefcase size={12} />
                                    <span>Phase 02: Industrial Internships</span>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Q1 Batch Enrolling
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                                    Launch Your Career with <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                        Real-World Internships
                                    </span>
                                </h3>
                                <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mt-1.5">
                                    Don't just learn theory—apply skills on industrial codebases. Work alongside engineering mentors and build a verified portfolio that impresses hiring managers.
                                </p>
                            </div>

                            {/* 6 Features Chips Matrix */}
                            <div className="grid grid-cols-2 gap-2 pt-0.5">
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
                                        className="flex items-center gap-2 bg-white/[0.02] hover:bg-white/[0.05] p-2 rounded-lg border border-white/[0.05] hover:border-emerald-500/30 transition-all"
                                    >
                                        <div className="w-4 h-4 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                            <CheckCircle2 size={11} />
                                        </div>
                                        <span className="text-gray-200 font-semibold text-[11px] truncate">{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Placement Support Trust Card */}
                            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Briefcase size={14} />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold text-white block">
                                            Verified Industrial Evaluation
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            Direct Corporate Placement Support
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Button */}
                        <Link href="/internships" className="block w-full pt-1">
                            <Button className="w-full h-9 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-xl shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01]">
                                <span className="flex items-center justify-center gap-1.5">
                                    Apply For Internships <ArrowRight size={13} />
                                </span>
                            </Button>
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
}
