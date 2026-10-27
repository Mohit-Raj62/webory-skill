"use client";

import { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
    ArrowRight, 
    Bot, 
    BrainCircuit, 
    CheckCircle, 
    Sparkles,
    Cpu,
    Compass
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";

const differentiators = [
    {
        title: "No random course suggestions",
        desc: "Laser-focused modules mapped directly to market demand."
    },
    {
        title: "Roadmap adapts as student progresses",
        desc: "Dynamic milestones that adjust based on quiz & code scores."
    },
    {
        title: "Focus on outcomes, not hours watched",
        desc: "Proof-of-work assignments replace passive video completion."
    },
    {
        title: "Works like a career guide, not a chatbot",
        desc: "Proactive guidance from foundational skills to job-ready portfolio."
    }
];

export function AINexusShowcase() {
    const router = useRouter();
    const { user } = useAuth();

    const [score, setScore] = useState(0);
    const [feedbackIndex, setFeedbackIndex] = useState(0);

    const feedbackMessages = [
        "Analyzing response structure & depth...",
        "Evaluating technical accuracy & algorithms...",
        "Checking communication clarity & conciseness...",
        "Identifying code optimization areas...",
        "Synthesizing personalized career feedback..."
    ];

    useEffect(() => {
        const controls = animate(65, 92, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate: (latest) => setScore(Math.round(latest))
        });
        
        const interval = setInterval(() => {
            setFeedbackIndex((prev) => (prev + 1) % feedbackMessages.length);
        }, 3000);

        return () => {
            controls.stop();
            clearInterval(interval);
        };
    }, [feedbackMessages.length]);

    return (
        <section className="py-20 sm:py-28 relative overflow-hidden bg-[#03050d]">
            {/* Ambient Lighting & Blueprint Grid */}
            <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-70 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                
                {/* Main Unified Intelligence Canvas */}
                <div className="relative rounded-3xl sm:rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-b from-[#0a0f24]/80 via-[#060814]/90 to-[#03050c]/95 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
                    
                    {/* Top Header Row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08] mb-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                                <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
                                <span>Adaptive Career Intelligence</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                WeborySkills <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI Nexus</span>
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed">
                            Simulate high-stakes technical interviews, generate dynamic learning roadmaps, and receive instant AI feedback tailored to your dream software role.
                        </p>
                    </div>

                    {/* Integrated 2-Column Product Experience */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                        
                        {/* LEFT: WHAT MAKES THIS AI DIFFERENT & CAREER ENGINE (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300 mb-2">
                                    <Sparkles size={11} /> AI DIFFERENTIATOR
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    What Makes This <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI Different?</span>
                                </h3>
                                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                    Designed exclusively for software engineers, moving beyond superficial conversational chatbots.
                                </p>
                            </div>

                            {/* Differentiator Capability Rows */}
                            <div className="space-y-3">
                                {differentiators.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all"
                                    >
                                        <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                                            <CheckCircle size={14} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white leading-snug">
                                                {item.title}
                                            </div>
                                            <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                                                {item.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Career Engine Banner */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-purple-950/20 border border-blue-500/20 space-y-3 relative overflow-hidden">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                                        <Compass size={14} className="text-blue-400" /> AI-Powered Career Engine
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        &lt; 2 mins
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    Webory Skills uses AI to design a <span className="text-white font-semibold">personalized learning roadmap</span> for every student, guiding them from skill selection to <span className="text-purple-300 font-semibold">real-world project execution</span>.
                                </p>
                                <Button 
                                    onClick={() => router.push(user ? '/ai-weboryskills' : '/signup')} 
                                    className="w-full h-9 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
                                >
                                    Get Personalized Roadmap <ArrowRight size={13} className="ml-1.5" />
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT: AI NEXUS WORKSPACE & SIMULATOR (7 cols) */}
                        <div className="lg:col-span-7 space-y-4">
                            
                            {/* Simulator Workspace Window */}
                            <div className="rounded-2xl border border-white/10 bg-[#060814]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
                                
                                {/* Window Navigation Bar */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                        <span className="ml-2 text-[11px] font-mono text-gray-400">
                                            weboryskills.in/ai-nexus/workspace
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                                            Simulation Active
                                        </span>
                                    </div>
                                </div>

                                {/* Mode Controls Bar */}
                                <div className="p-3.5 sm:p-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300">
                                            <Bot className="w-3.5 h-3.5 text-blue-400" />
                                            <span>Mock Interviews</span>
                                            <span className="text-[10px] text-blue-400/70 font-normal">Tech & HR</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs font-medium text-gray-300">
                                            <Cpu className="w-3.5 h-3.5 text-purple-400" />
                                            <span>Aptitude Tests</span>
                                            <span className="text-[10px] text-gray-500 font-normal">Logic & Quant</span>
                                        </div>
                                    </div>

                                    <Link href="/ai-prep">
                                        <Button size="sm" className="h-8 px-3.5 text-xs font-bold rounded-lg bg-white text-black hover:bg-gray-100 shadow-sm transition-all">
                                            Start Your Practice <ArrowRight size={12} className="ml-1" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Simulator Visual Container */}
                                <div className="p-3.5 sm:p-5">
                                    <div className="relative rounded-xl overflow-hidden border border-white/10 group bg-black/60">
                                        {/* Moving Laser Scanner */}
                                        <motion.div 
                                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.9)] z-20 pointer-events-none"
                                            animate={{ top: ["0%", "100%", "0%"] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        />

                                        <Image 
                                            src="/ai-nexus-preview.png" 
                                            alt="Webory AI Nexus Dashboard" 
                                            width={750} 
                                            height={380}
                                            className="w-full h-auto max-h-[280px] object-cover group-hover:scale-[1.01] transition-transform duration-700 opacity-90"
                                        />
                                        
                                        {/* Telemetry Overlay */}
                                        <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-2.5">
                                            {/* Real-time feedback stream */}
                                            <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-2.5 sm:p-3 flex-1">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                                                    <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">
                                                        AI Evaluation Stream
                                                    </span>
                                                </div>
                                                <motion.div 
                                                    key={feedbackIndex}
                                                    initial={{ opacity: 0, y: 4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    className="text-xs text-gray-200 font-mono truncate"
                                                >
                                                    &gt; {feedbackMessages[feedbackIndex]}<span className="animate-pulse text-blue-400">_</span>
                                                </motion.div>
                                            </div>

                                            {/* Confidence score badge */}
                                            <div className="flex items-center gap-3 bg-black/90 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/10 shrink-0">
                                                <div>
                                                    <div className="text-[10px] font-medium text-gray-400">Confidence</div>
                                                    <div className="text-xl font-black text-white">{score}%</div>
                                                </div>
                                                <div className="pl-3 border-l border-white/10 text-right">
                                                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono block font-bold">READY</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">Job-Ready</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
