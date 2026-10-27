"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BookOpen, 
    Briefcase, 
    ShieldCheck, 
    Trophy, 
    HeartHandshake, 
    Users, 
    PlayCircle, 
    Shield, 
    Brain, 
    Target, 
    CheckCircle,
    Sparkles,
    ArrowRight,
    Quote,
    UserCircle,
    Lightbulb,
    Rocket,
    BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const WHY_WEBORY_GROUPS = [
    {
        id: "choose-us",
        title: "Why Students Choose Us",
        shortTitle: "Why Choose Us",
        items: [
            {
                icon: BookOpen,
                title: "Personalized AI Roadmap",
                description: "Get a clear, custom learning path tailored to your career goals using AI.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20"
            },
            {
                icon: Briefcase,
                title: "Industry-Relevant Skills",
                description: "Learn what companies are actually hiring for, not outdated college syllabus.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
            },
            {
                icon: HeartHandshake,
                title: "Real-World Projects",
                description: "Build production apps to solve real problems, not dummy To-Do list apps.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20"
            },
            {
                icon: Users,
                title: "Mentor Support",
                description: "Get guidance from IIT Mandi faculty and experienced tech leads at every stage.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20"
            },
            {
                icon: Trophy,
                title: "Career-Focused Results",
                description: "We focus on making you employable and career-ready, not just collecting certificates.",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20"
            }
        ],
    },
    {
        id: "student-benefits",
        title: "Benefits for Students",
        shortTitle: "Student Benefits",
        items: [
            {
                icon: ShieldCheck,
                title: "Verified Startup",
                description: "Trust in a registered tech startup dedicated to bringing you verified learning.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
            },
            {
                icon: Users,
                title: "Dev Community Access",
                description: "Join hundreds of student developers, exchange code reviews, and collaborate.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20"
            },
            {
                icon: Trophy,
                title: "Guaranteed Internship Pool",
                description: "Get evaluated directly for internship placements upon course completion.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20"
            },
            {
                icon: PlayCircle,
                title: "Free Experience Access",
                description: "Explore module 1 without card requirement and experience the teaching quality.",
                color: "text-pink-400",
                bg: "bg-pink-500/10",
                border: "border-pink-500/20"
            }
        ]
    }
];

const TRUST_APPROACH = [
    {
        title: "Structured Roadmaps",
        desc: "Step-by-step milestones",
        icon: Target,
        color: "text-blue-400",
    },
    {
        title: "Real Projects",
        desc: "Production codebases",
        icon: Briefcase,
        color: "text-emerald-400",
    },
    {
        title: "Live Mentorship",
        desc: "IIT & Dev guidance",
        icon: Brain,
        color: "text-purple-400",
    }
];

const roadmapSteps = [
    {
        icon: UserCircle,
        title: "Step 1: Choose Your Career Goal",
        description: "Select your goal (Web Dev, AI, etc.) and current level. We adapt to you.",
        details: ["Web Developer", "AI / Data", "Beginner/Intermediate"],
    },
    {
        icon: Brain,
        title: "Step 2: AI Roadmap Generator",
        description: "We automatically create a learning path, weekly plan, and project timeline.",
        details: ["Learning path", "Weekly plan", "Projects timeline"],
        highlight: "Every student gets a personalized roadmap.",
    },
    {
        icon: Lightbulb,
        title: "Step 3: Learning + Projects",
        description: "Follow structured lessons and hands-on assignments-not just watching.",
        details: ["Structured lessons", "Hands-on assignments", "Real-world projects"],
    },
    {
        icon: BarChart,
        title: "Step 4: AI Mentor Guidance",
        description: "Your AI mentor tracks progress, suggests next steps, and highlights gaps.",
        details: ["Tracks progress", "Suggests next steps", "Highlights gaps"],
    },
    {
        icon: Rocket,
        title: "Step 5: Job Readiness",
        description: "Gain practical skills, a project portfolio, and job readiness support.",
        details: ["Practical skills", "Project portfolio", "Job readiness"],
    },
];

export function WhyWeboryAndTrust() {
    const [activeTab, setActiveTab] = useState("choose-us");
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [activeApproachIndex, setActiveApproachIndex] = useState(0);

    const currentGroup = WHY_WEBORY_GROUPS.find((g) => g.id === activeTab) || WHY_WEBORY_GROUPS[0];

    return (
        <section id="why-webory-and-trust" className="py-20 sm:py-28 relative overflow-hidden bg-[#04060e]">
            {/* Ambient Multi-Layer Lighting */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
            
            {/* Softened High-Tech Lined Blueprint Grid with Atmospheric Blur */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none backdrop-blur-[1px]" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                {/* Unified Header */}
                <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-semibold shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Platform Excellence & Verified Credibility</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                        Why <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Webory Skills</span> & Why Learners <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Trust Us</span>
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        A complete ecosystem designed to bridge the gap between learning and earning, backed by industry mentorship and transparent career outcomes.
                    </p>
                </div>

                {/* ========================================================= */}
                {/* ROW 1: WHY WEBORY SKILLS & WHY LEARNERS TRUST US (2 COLS) */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-stretch mb-20 sm:mb-28">
                    
                    {/* COLUMN 1: WHY WEBORY SKILLS? */}
                    <div className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-[#0B0F28]/85 border border-white/10 hover:border-blue-500/30 shadow-2xl shadow-black/50 backdrop-blur-2xl relative overflow-hidden group/left transition-all duration-300">
                        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

                        <div className="relative z-10">
                            {/* Card Header & Tab Switcher */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.08]">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        <BookOpen size={12} />
                                        <span>Core Platform Value</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        Why Webory Skills?
                                    </h3>
                                </div>

                                {/* Tab Toggle */}
                                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start sm:self-auto backdrop-blur-md">
                                    {WHY_WEBORY_GROUPS.map((g) => {
                                        const isActive = g.id === activeTab;
                                        return (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveTab(g.id);
                                                    setActiveItemIndex(0);
                                                }}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                                                    isActive 
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-white/20"
                                                        : "text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                {g.shortTitle}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-2.5 mb-6">
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-2.5"
                                    >
                                        {currentGroup.items.map((item, idx) => {
                                            const Icon = item.icon;
                                            const isActive = activeItemIndex === idx;

                                            return (
                                                <div
                                                    key={item.title}
                                                    onMouseEnter={() => setActiveItemIndex(idx)}
                                                    className={`p-3.5 sm:p-4 rounded-2xl flex items-start gap-3.5 transition-all duration-200 cursor-pointer border ${
                                                        isActive
                                                            ? "bg-white/[0.06] border-blue-500/40 shadow-lg shadow-blue-500/10 translate-x-1"
                                                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                                                    }`}
                                                >
                                                    <div className={`p-2.5 rounded-xl shrink-0 ${item.bg} ${item.color} border ${item.border} shadow-sm`}>
                                                        <Icon size={18} className={isActive ? "scale-110 transition-transform" : ""} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                                                                isActive ? "text-white" : "text-gray-200"
                                                            }`}>
                                                                {item.title}
                                                            </h4>
                                                            {isActive && (
                                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Bottom Feature Pill Footer */}
                        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-gray-400 relative z-10">
                            <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                                100% Industry Aligned & Job-Ready
                            </span>
                            <Link 
                                href="/courses" 
                                className="inline-flex items-center gap-1 text-blue-400 hover:text-cyan-300 font-semibold transition-colors"
                            >
                                Explore Courses <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>


                    {/* COLUMN 2: WHY LEARNERS TRUST WEBORY SKILLS */}
                    <div className="flex flex-col justify-between rounded-3xl p-6 sm:p-8 bg-[#09141F]/85 border border-white/10 hover:border-emerald-500/30 shadow-2xl shadow-black/50 backdrop-blur-2xl relative overflow-hidden group/right transition-all duration-300">
                        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

                        <div className="space-y-5 relative z-10">
                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                                        <Shield size={12} />
                                        <span>Verified Trust & Proof</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                        Why Learners Trust Webory
                                    </h3>
                                </div>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>UDYAM Registered</span>
                                </div>
                            </div>

                            {/* Dual Mentorship Pillars */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className="h-8 w-8 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                                            <Users size={16} />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-white leading-tight">Tech Leads & Devs</h5>
                                            <span className="text-[10px] text-blue-400 font-mono font-semibold uppercase tracking-wider">Practitioners</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        "We teach how to thrive in real software jobs with code reviews & system design."
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className="h-8 w-8 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                                            <Brain size={16} />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-white leading-tight">IIT Mandi Mentored</h5>
                                            <span className="text-[10px] text-purple-400 font-mono font-semibold uppercase tracking-wider">Faculty Aligned</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                        Curriculum architecture aligned with real tech hiring demands.
                                    </p>
                                </div>
                            </div>

                            {/* Three Pillars of Learning Approach */}
                            <div>
                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Our Approach: Designed for Employability
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {TRUST_APPROACH.map((item, idx) => {
                                        const Icon = item.icon;
                                        const isActive = activeApproachIndex === idx;

                                        return (
                                            <button
                                                key={item.title}
                                                type="button"
                                                onClick={() => setActiveApproachIndex(idx)}
                                                className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                    isActive 
                                                        ? "bg-white/[0.08] border-emerald-500/40 shadow-md shadow-emerald-500/10 scale-[1.02]"
                                                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                                                }`}
                                            >
                                                <Icon size={16} className={`${item.color} mb-1.5`} />
                                                <h6 className="text-xs font-bold text-white truncate">{item.title}</h6>
                                                <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 leading-tight">
                                                    {item.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Verified Student Voice */}
                            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 relative">
                                <Quote className="absolute right-3 top-3 text-white/5 w-8 h-8 pointer-events-none" />
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] flex items-center justify-center border border-blue-500/30">
                                        B
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white leading-none">Beta Learner</p>
                                        <p className="text-[10px] text-blue-400 font-mono">Web Development Track</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-300 italic leading-relaxed">
                                    "The roadmap made learning structured and practical. I always knew what to build next, not just watching random tutorials."
                                </p>
                            </div>

                            {/* Transparency Guarantee Box */}
                            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 text-center relative">
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#07111b] border border-emerald-500/30 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                                    Transparency Pledge
                                </span>
                                <p className="text-xs text-gray-200 leading-relaxed mt-0.5">
                                    "We don't promise overnight shortcuts. We build genuine hard skills that make you employable."
                                </p>
                            </div>
                        </div>

                        {/* Bottom Action CTA */}
                        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap relative z-10 mt-6">
                            <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                                <CheckCircle size={13} className="text-emerald-400" />
                                UDYAM & MSME Recognized
                            </span>
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button 
                                    size="sm" 
                                    className="w-full sm:w-auto h-9 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                >
                                    About Webory <ArrowRight size={13} className="ml-1.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>


                {/* ========================================================= */}
                {/* ROW 2: AI-POWERED LEARNING ROADMAP & MENTORSHIP           */}
                {/* (ORIGINAL 5-STEP DESIGN PRESERVED WITH ZERO CHANGES)      */}
                {/* ========================================================= */}
                <div className="pt-6 border-t border-white/[0.08]">
                    <div className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            AI Generating Route...
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6 text-white"
                        >
                            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Learning Roadmap & Mentorship</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-sm sm:text-xl text-gray-300 font-medium"
                        >
                            Not Just another course list. A personalized path built around your career goal.
                        </motion.p>
                    </div>

                    {/* Steps Flow */}
                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-white/5 z-0 overflow-hidden rounded-full">
                            <motion.div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true, margin: "100px" }}
                                transition={{ duration: 4, ease: "linear" }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {roadmapSteps.map((step, index) => {
                                // Dynamic gradients based on index
                                const gradients = [
                                    "from-blue-500 to-cyan-500",
                                    "from-cyan-500 to-teal-500",
                                    "from-teal-500 to-green-500",
                                    "from-green-500 to-indigo-500",
                                    "from-indigo-500 to-purple-500"
                                ];
                                const currentGradient = gradients[index % gradients.length];
                                
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30, filter: "grayscale(100%)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "grayscale(0%)" }}
                                        viewport={{ once: true, margin: "100px" }}
                                        transition={{ delay: index * 0.8, duration: 0.5 }}
                                        className="relative z-10 group will-change-transform will-change-opacity"
                                    >
                                        <div className="glass-card p-6 rounded-3xl border border-white/5 h-full bg-gradient-to-b from-white/5 to-black/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
                                            
                                            {/* Giant Watermark Number */}
                                            <div className="absolute -right-4 -top-8 text-[120px] font-bold text-white/[0.03] select-none pointer-events-none leading-none z-0">
                                                {index + 1}
                                            </div>

                                            {/* Flow Arrow (except last item) */}
                                            {index < roadmapSteps.length - 1 && (
                                                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-white/20">
                                                    <ArrowRight size={16} />
                                                </div>
                                            )}

                                            <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${currentGradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <step.icon size={26} />
                                            </div>
                                            
                                            <h3 className="relative z-10 text-lg font-bold text-white mb-3 leading-tight">{step.title.split(":")[1] || step.title}</h3>
                                            <p className="relative z-10 text-sm text-gray-400 mb-5 leading-relaxed min-h-[60px]">{step.description}</p>
                                            
                                            {step.highlight && (
                                                <div className="relative z-10 mb-4 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300 font-semibold flex items-center gap-2">
                                                    <Sparkles size={12} /> {step.highlight}
                                                </div>
                                            )}

                                            <div className="relative z-10 space-y-2 pt-4 border-t border-white/5">
                                                {step.details.map((detail, idx) => (
                                                    <div key={idx} className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentGradient} mr-2`} />
                                                        {detail}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
