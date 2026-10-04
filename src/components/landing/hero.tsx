"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { animate } from "framer-motion";
import { 
    ArrowRight, 
    Code, 
    Rocket, 
    Users, 
    BookOpen, 
    ShieldCheck, 
    GraduationCap, 
    CheckCircle2, 
    Star, 
    Zap, 
    Sparkles, 
    Play,
    Check,
    Lock,
    Code2,
    Bot,
    Briefcase,
    Database
} from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import dynamic from "next/dynamic";
import { Typewriter } from "@/components/ui/typewriter";

const ParticleNetwork = dynamic(() => import("@/components/ui/particle-network").then(mod => mod.ParticleNetwork), { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black/20" /> 
});

interface HeroProps {
    initialUserCount?: number;
    initialInternshipCount?: number;
    initialCourseCount?: number;
}

/* ---------- Interactive Career Track Preview (PW Skills / Scaler High-End Style) ---------- */
interface RoadmapTrack {
    id: string;
    label: string;
    title: string;
    duration: string;
    avgSalary: string;
    projectsCount: string;
    progress: number;
    icon: any;
    accentColor: string;
    techStack: string[];
    steps: {
        title: string;
        note: string;
        state: "done" | "now" | "locked";
    }[];
}

const ROADMAP_TRACKS: RoadmapTrack[] = [
    {
        id: "fullstack",
        label: "Full-Stack AI",
        title: "Full-Stack GenAI Developer",
        duration: "14 Weeks",
        avgSalary: "₹8.5 - 18 LPA",
        projectsCount: "4 Production Apps",
        progress: 65,
        icon: Code2,
        accentColor: "#3B82F6",
        techStack: ["Next.js 15", "React 19", "TypeScript", "Node.js", "PostgreSQL", "LangChain"],
        steps: [
            { title: "HTML5, Tailwind & Modern JavaScript ES6+", note: "Module 1 • Free Preview Unlocked", state: "done" },
            { title: "React 19, TypeScript & Next.js App Router", note: "Interactive Code Labs & UI Patterns", state: "done" },
            { title: "Build AI SaaS Platform & RAG System", note: "Active Live Sprint • Hands-on Project", state: "now" },
            { title: "Node.js, Express & Scalable PostgreSQL", note: "Cloud APIs & Auth Architecture", state: "locked" },
            { title: "Verified Credential & 1:1 IIT Mentorship", note: "Official LOR & Placement Review", state: "locked" },
        ],
    },
    {
        id: "genai",
        label: "GenAI & LLMs",
        title: "Generative AI Engineer",
        duration: "12 Weeks",
        avgSalary: "₹10 - 24 LPA",
        projectsCount: "3 AI Multi-Agents",
        progress: 45,
        icon: Bot,
        accentColor: "#8B5CF6",
        techStack: ["Python", "LangChain", "OpenAI / LLaMA", "ChromaDB", "PyTorch", "RAG"],
        steps: [
            { title: "Python for AI, Linear Algebra & REST APIs", note: "Module 1 • Free Preview Unlocked", state: "done" },
            { title: "LangChain, Vector DBs & RAG Workflows", note: "Hands-on Code Labs with OpenAI", state: "done" },
            { title: "Build Autonomous Multi-Agent Workflows", note: "Active Live Sprint • Real Data System", state: "now" },
            { title: "Fine-Tuning Open Source LLMs (LoRA)", note: "GPU Training Labs on Cloud", state: "locked" },
            { title: "Deploy Production AI Systems & APIs", note: "Capstone Portfolio & Certification", state: "locked" },
        ],
    },
    {
        id: "datascience",
        label: "Data & ML",
        title: "Data Science & Machine Learning",
        duration: "12 Weeks",
        avgSalary: "₹7.5 - 16 LPA",
        projectsCount: "5 Predictive Models",
        progress: 55,
        icon: Database,
        accentColor: "#F59E0B",
        techStack: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau", "Neural Networks"],
        steps: [
            { title: "Python for Data Analysis & Advanced SQL", note: "Module 1 • Free Preview Unlocked", state: "done" },
            { title: "Data Wrangling with Pandas & NumPy", note: "Real Financial & User Datasets", state: "done" },
            { title: "Supervised & Unsupervised Machine Learning", note: "Active Live Sprint • Customer Churn Model", state: "now" },
            { title: "Deep Learning with TensorFlow & Keras", note: "Computer Vision & NLP Pipelines", state: "locked" },
            { title: "Data Analytics Portfolio & IIT Credential", note: "Industry Presentation & Case Study", state: "locked" },
        ],
    },
    {
        id: "python",
        label: "Python Core",
        title: "Python Backend & Automation",
        duration: "8 Weeks",
        avgSalary: "₹6.5 - 14 LPA",
        projectsCount: "4 Real World Scripts",
        progress: 75,
        icon: Zap,
        accentColor: "#06B6D4",
        techStack: ["Python 3.12", "FastAPI", "OOPs", "Web Scraping", "Docker", "PostgreSQL"],
        steps: [
            { title: "Python Syntax, Data Structures & Logic", note: "Module 1 • Free Preview Unlocked", state: "done" },
            { title: "OOPs, Decorators & System Design Patterns", note: "20+ Hands-on Coding Challenges", state: "done" },
            { title: "FastAPI REST API & Automated Scraper Bot", note: "Active Live Sprint • Real Data Bot", state: "now" },
            { title: "Database Integration with SQLAlchemy", note: "Secure Auth & Dockerized Deployment", state: "locked" },
            { title: "Verified Python Developer Certificate", note: "Instant QR Credential", state: "locked" },
        ],
    },
    {
        id: "internship",
        label: "Live Internship",
        title: "Production Industry Internship",
        duration: "8 Weeks",
        avgSalary: "Stipend + LOR",
        projectsCount: "Live Client Project",
        progress: 50,
        icon: Briefcase,
        accentColor: "#10B981",
        techStack: ["Live Repo", "Git PR Reviews", "Agile Sprints", "CI/CD", "Client Brief", "Verified LOR"],
        steps: [
            { title: "Client Architecture Brief & Team Onboarding", note: "Week 1 • Environment Setup", state: "done" },
            { title: "Frontend UI/UX & Responsive Core Features", note: "Weekly Code Reviews by Tech Lead", state: "done" },
            { title: "Backend API Integration & Security Audits", note: "Active • Live Sprint Testing", state: "now" },
            { title: "CI/CD Pipeline & Production Launch", note: "Live Cloud Deployment", state: "locked" },
            { title: "Experience Certificate & Letter of Recommendation", note: "Verified Company LOR signed by Director", state: "locked" },
        ],
    },
];

function InteractiveRoadmapCard() {
    const [activeTrackIndex, setActiveTrackIndex] = useState(0);
    const activeTrack = ROADMAP_TRACKS[activeTrackIndex];

    return (
        <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.12] bg-[#111633]/90 p-3.5 sm:p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl overflow-hidden">
            {/* Ambient Background Glow */}
            <div
                className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[90px] opacity-20 pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: activeTrack.accentColor }}
            />

            {/* Track Selector Tabs (5 Tracks) - Scrollbar 100% Hidden */}
            <div 
                className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090C1F]/90 border border-white/[0.06] mb-3 sm:mb-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {ROADMAP_TRACKS.map((t, idx) => {
                    const isActive = idx === activeTrackIndex;
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setActiveTrackIndex(idx)}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/25 border border-white/20 scale-[1.02]"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                            }`}
                        >
                            <Icon size={13} className={isActive ? "text-emerald-400" : "opacity-70"} />
                            <span>{t.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Track Header & Outcome Tags */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Interactive Career Roadmap
                        </span>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-[#EEF0FF] tracking-tight">
                        {activeTrack.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-white/[0.06] border border-white/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-gray-300">
                        {activeTrack.duration}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-emerald-400 shadow-sm">
                        {activeTrack.avgSalary}
                    </span>
                </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mr-1">Tools:</span>
                {activeTrack.techStack.map((tech) => (
                    <span 
                        key={tech}
                        className="px-2 py-0.5 rounded-lg bg-[#090C1F] border border-white/[0.08] text-[10px] font-medium text-gray-300 shadow-sm"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Sprint Progress Bar */}
            <div className="mb-4 p-2.5 rounded-xl bg-[#090C1F]/70 border border-white/[0.04]">
                <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-1.5">
                    <span>Curriculum Sprint Progress</span>
                    <span className="text-white font-bold">{activeTrack.progress}% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1A1F45] overflow-hidden">
                    <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${activeTrack.progress}%` }}
                    />
                </div>
            </div>

            {/* Steps List */}
            <div className="relative space-y-2.5">
                {/* Subtle soft dashed guide (replaces harsh line) */}
                <div className="absolute left-[13px] top-3 bottom-3 border-l border-dashed border-white/[0.12]" aria-hidden />

                {activeTrack.steps.map((s) => (
                    <div
                        key={s.title}
                        className="relative flex items-start gap-3 group cursor-default"
                    >
                        <span
                            className={
                                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition-transform duration-200 " +
                                (s.state === "done"
                                    ? "border-blue-400 bg-blue-500 text-white shadow-sm shadow-blue-500/30"
                                    : s.state === "now"
                                    ? "border-emerald-400 bg-[#090C1F] text-emerald-400 shadow-md ring-4 ring-emerald-500/10"
                                    : "border-white/10 bg-[#090C1F] text-gray-500")
                            }
                        >
                            {s.state === "done" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                            {s.state === "now" && (
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                            {s.state === "locked" && <Lock className="h-3 w-3" />}
                        </span>
                        <div className="pt-0.5 flex-1 min-w-0">
                            <p
                                className={
                                    "text-xs sm:text-sm font-semibold tracking-tight leading-snug line-clamp-2 sm:line-clamp-none " +
                                    (s.state === "locked" ? "text-gray-400" : "text-[#EEF0FF]")
                                }
                            >
                                {s.title}
                            </p>
                            <p
                                className={
                                    "text-[11px] mt-0.5 " +
                                    (s.state === "now"
                                        ? "text-emerald-400 font-medium"
                                        : "text-gray-500")
                                }
                            >
                                {s.note}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Card Action */}
            <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                >
                    <Play size={12} className="text-emerald-400 fill-emerald-400" />
                    <span>Watch Module 1 Free</span>
                </Link>

                <Link
                    href="/ai-weboryskills"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    <Sparkles size={12} className="text-amber-400" />
                    <span>Customize Path <ArrowRight size={13} /></span>
                </Link>
            </div>
        </div>
    );
}

// Executive-Grade Live Metric Card (PW Skills / Scaler / Stripe High-Impact Design)
interface MetricBadgeProps {
    icon: any;
    label: string;
    sublabel: string;
    value: string;
    gradientClass: string;
    glowColor: string;
    borderColor: string;
    tag?: string;
}

function MetricBadge({ 
    icon: Icon, 
    label, 
    sublabel,
    value, 
    gradientClass,
    glowColor,
    borderColor,
    tag
}: MetricBadgeProps) {
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
        const hasPlus = value.includes('+');
        
        const controls = animate(0, numericValue, {
            duration: 1.8,
            ease: "easeOut",
            onUpdate: (latest) => {
                setDisplayValue(Math.round(latest) + (hasPlus ? "+" : ""));
            }
        });

        return () => controls.stop();
    }, [value]);

    return (
        <div className={`relative group rounded-2xl border border-white/[0.08] ${borderColor} bg-gradient-to-b from-[#141A3D]/95 via-[#0F1433]/90 to-[#0A0E26]/90 p-2.5 sm:p-4 backdrop-blur-xl shadow-lg shadow-black/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-default min-h-[105px] sm:min-h-[125px]`}>
            {/* Top Specular Edge Shine */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            
            {/* Dynamic ambient hover glow */}
            <div 
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: glowColor }}
            />

            {/* Top row: Icon + Tag */}
            <div className="flex items-center justify-between gap-1 mb-2 sm:mb-2.5">
                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${gradientClass} text-white shadow-md shadow-black/30 group-hover:scale-105 transition-transform duration-300 shrink-0`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                {tag && (
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-300 border border-white/[0.08]">
                        {tag}
                    </span>
                )}
            </div>

            {/* Value & Label */}
            <div>
                <h4 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#EEF0FF] tabular-nums tracking-tight drop-shadow-sm">
                    {displayValue}
                </h4>
                <p className="text-[11px] sm:text-[13px] font-bold text-gray-200 mt-0.5 tracking-tight leading-tight line-clamp-1">
                    {label}
                </p>
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight mt-0.5 line-clamp-1">
                    {sublabel}
                </p>
            </div>
        </div>
    );
}

export function Hero({ initialUserCount = 10, initialInternshipCount = 12, initialCourseCount = 5 }: HeroProps) {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const activeStudents = initialUserCount > 0 ? `${initialUserCount}+` : "10+";
    const launchedInternships = initialInternshipCount > 0 ? `${initialInternshipCount}+` : "12+";
    const availableCourses = initialCourseCount > 0 ? `${initialCourseCount}+` : "5+";

    return (
        <section className="relative pt-20 pb-8 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 overflow-hidden bg-[#0A0D1F]">
            {/* Ambient Background Lighting */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[450px] bg-gradient-to-b from-blue-600/12 via-indigo-600/8 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-gradient-to-b from-purple-600/10 via-emerald-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
            
            {/* Interactive Particle Network */}
            <ParticleNetwork />

            {/* Subtle Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
                aria-hidden 
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* 2-COLUMN PROFESSIONAL LAYOUT (PW Skills / Scaler / Modern EdTech Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* LEFT COLUMN: Pitch, Badges, Typography & CTAs (7 cols) */}
                    <div className="lg:col-span-7 text-left space-y-4 sm:space-y-6">
                        
                        {/* Credibility & Trust Badges */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Mobile Sleek Combined Pill */}
                            <div className="sm:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                </span>
                                <span>Govt. Registered</span>
                                <span className="text-white/30">•</span>
                                <span className="text-purple-300">IIT Mandi Mentored</span>
                            </div>

                            {/* Desktop & Tablet Badges */}
                            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-semibold shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Govt. Registered Startup • UDYAM-BR-26-0208472</span>
                            </div>

                            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] sm:text-xs font-semibold shadow-sm">
                                <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span>Mentored by IIT Mandi Faculty</span>
                            </div>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-[23px] min-[360px]:text-[26px] min-[400px]:text-[28px] sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] sm:leading-[1.15] text-white">
                            <span className="block sm:inline">
                                AI-Powered Skill Platform{" "}
                            </span>
                            <span className="block sm:mt-2 text-slate-300 sm:text-white font-extrabold sm:font-black">
                                <span className="text-gray-300 font-bold text-base min-[360px]:text-lg sm:text-5xl lg:text-6xl sm:font-black sm:text-white">for </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                                    <span className="sm:hidden">
                                        <Typewriter words={[
                                            "Tech Careers",
                                            "Software Engineers",
                                            "Future Developers",
                                            "High-Paying Roles"
                                        ]} />
                                    </span>
                                    <span className="hidden sm:inline">
                                        <Typewriter words={[
                                            "High-Growth Tech Careers",
                                            "Future-Proof Engineers",
                                            "Industry-Ready Developers",
                                            "High-Impact Tech Roles"
                                        ]} />
                                    </span>
                                </span>
                            </span>
                        </h1>


                        {/* Quick Trust Feature Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] sm:text-xs font-semibold text-emerald-300 shadow-sm">
                                <Zap className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400/40" />
                                Watch Module 1 Free
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-[11px] sm:text-xs font-semibold text-blue-300 shadow-sm">
                                <Code className="w-3 h-3 text-cyan-400 shrink-0" />
                                Production Projects
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-[11px] sm:text-xs font-semibold text-purple-300 shadow-sm">
                                <GraduationCap className="w-3 h-3 text-purple-400 shrink-0" />
                                1:1 IIT Mentorship
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1.5">
                            {!isLoggedIn ? (
                                <Link href="/signup" className="group w-full sm:w-auto block">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto h-11 sm:h-13 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Get Your AI Roadmap
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/ai-weboryskills" className="group w-full sm:w-auto block">
                                    <Button 
                                        size="lg" 
                                        className="w-full sm:w-auto h-11 sm:h-13 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Get Your AI Roadmap
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            )}
                            <Link href="/courses" className="w-full sm:w-auto block">
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="w-full sm:w-auto h-11 sm:h-13 px-6 sm:px-7 text-sm sm:text-base font-semibold rounded-xl border-white/20 bg-[#121633]/80 hover:bg-[#1A2048] hover:border-white/30 text-white transition-all backdrop-blur-md"
                                >
                                    <Play size={14} className="mr-2 fill-current text-blue-400" />
                                    Explore Courses
                                </Button>
                            </Link>
                        </div>

                        {/* Micro Guarantees */}
                        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-400 pt-0.5">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                No Credit Card Required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                Verified QR Certificate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                                Instant Access
                            </span>
                        </div>

                        {/* Mobile Compact 1-Row Stats Strip (Airy & Lightweight on Phones) */}
                        <div className="sm:hidden grid grid-cols-4 divide-x divide-white/10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-1 text-center shadow-sm my-2">
                            <div>
                                <div className="text-sm font-extrabold text-white">{activeStudents}</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Students</div>
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-white">{availableCourses}</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Courses</div>
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-white">50+</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Projects</div>
                            </div>
                            <div>
                                <div className="text-sm font-extrabold text-emerald-400">4.9★</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Rating</div>
                            </div>
                        </div>

                        {/* Desktop & Tablet 4 Live Metric Badges */}
                        <div className="hidden sm:block pt-2">
                            <div className="flex items-center gap-2 mb-2.5 px-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                    Live Student Impact & Platform Outcomes
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                                <MetricBadge 
                                    icon={Users}
                                    label="Active Students"
                                    sublabel="Enrolled & learning"
                                    value={activeStudents}
                                    gradientClass="bg-gradient-to-br from-blue-500 to-indigo-600"
                                    glowColor="#3B82F6"
                                    borderColor="hover:border-blue-500/50"
                                    tag="Learners"
                                />
                                <MetricBadge 
                                    icon={BookOpen}
                                    label="Certified Courses"
                                    sublabel="Industry-standard"
                                    value={availableCourses}
                                    gradientClass="bg-gradient-to-br from-purple-500 to-pink-600"
                                    glowColor="#8B5CF6"
                                    borderColor="hover:border-purple-500/50"
                                    tag="Curated"
                                />
                                <MetricBadge 
                                    icon={Code}
                                    label="Practical Projects"
                                    sublabel="Production code"
                                    value="50+"
                                    gradientClass="bg-gradient-to-br from-amber-500 to-orange-600"
                                    glowColor="#F59E0B"
                                    borderColor="hover:border-amber-500/50"
                                    tag="Hands-on"
                                />
                                <MetricBadge 
                                    icon={Rocket}
                                    label="Careers Accelerated"
                                    sublabel="Internships & LOR"
                                    value={launchedInternships}
                                    gradientClass="bg-gradient-to-br from-emerald-500 to-teal-600"
                                    glowColor="#10B981"
                                    borderColor="hover:border-emerald-500/50"
                                    tag="Outcomes"
                                />
                            </div>
                        </div>

                        {/* Social Proof Strip */}
                        <div className="hidden sm:flex pt-4 border-t border-white/[0.08] items-center gap-3.5">
                            <div className="flex -space-x-2.5 overflow-hidden">
                                {[
                                    "from-blue-500 to-indigo-600",
                                    "from-purple-500 to-pink-500",
                                    "from-amber-400 to-orange-500",
                                    "from-emerald-400 to-teal-600",
                                    "from-rose-500 to-red-600",
                                ].map((gradient, i) => (
                                    <div
                                        key={i}
                                        className={`inline-block h-8 w-8 rounded-full ring-2 ring-[#0A0D1F] bg-gradient-to-br ${gradient} flex items-center justify-center text-[11px] font-bold text-white shadow-md`}
                                    >
                                        {["M", "R", "A", "S", "P"][i]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="ml-1 text-xs font-bold text-white">4.9 / 5</span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Trusted by learners across <span className="text-gray-200 font-semibold">IITs, NITs & Top Colleges</span>
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Interactive Product Experience (Desktop & Tablet only to avoid mobile duplication) */}
                    <div className="hidden lg:block lg:col-span-5">
                        {/* Live Career Roadmap Card */}
                        <InteractiveRoadmapCard />
                    </div>

                </div>
            </div>
        </section>
    );
}