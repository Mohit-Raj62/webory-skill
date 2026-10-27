"use client";

import { useState, useEffect } from "react";
import { motion, animate, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    Code, 
    Rocket, 
    Users, 
    BookOpen, 
    ShieldCheck, 
    GraduationCap, 
    Star, 
    Sparkles,
    Briefcase,
    Brain,
    Laptop,
    Terminal,
    Cpu,
    ArrowRight,
    Zap,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";

interface HeroProps {
    initialUserCount?: number;
    initialInternshipCount?: number;
    initialCourseCount?: number;
    courses?: Array<{ title: string; slug?: string }>;
    internships?: Array<{ title: string; slug?: string }>;
}

// Fallback items if DB has fewer than 4 items
const DEFAULT_COURSES = [
    { title: "Data Science & Analytics", slug: "data-science" },
    { title: "Full-Stack Web Systems", slug: "full-stack-web-systems" },
    { title: "DSA & Core Algorithms", slug: "dsa-core-algorithms" },
    { title: "AI/ML Engineering", slug: "ai-ml-engineering" }
];

const DEFAULT_INTERNSHIPS = [
    { title: "Software Development", slug: "software-development" },
    { title: "AI & Data Engineer Intern", slug: "ai-data-engineer-intern" },
    { title: "Frontend & UI Systems", slug: "frontend-ui-systems" },
    { title: "Backend Cloud Systems", slug: "backend-cloud-systems" }
];

// Unified, Normal & Professional Badges Preset for Courses (Left Wing)
const COURSE_BADGE_PRESETS = [
    { 
        glow: "border-white/10 bg-[#0B0F28]/90 hover:border-blue-500/40 hover:bg-[#0E1436]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        accent: "text-blue-400",
        angle: -5,
        offset: "ml-0",
        icon: Brain,
        tag: "Course Track"
    },
    { 
        glow: "border-white/10 bg-[#0B0F28]/90 hover:border-blue-500/40 hover:bg-[#0E1436]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        accent: "text-blue-400",
        angle: -2,
        offset: "ml-6 xl:ml-10",
        icon: Sparkles,
        tag: "High Demand"
    },
    { 
        glow: "border-white/10 bg-[#0B0F28]/90 hover:border-blue-500/40 hover:bg-[#0E1436]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        accent: "text-blue-400",
        angle: -6,
        offset: "ml-2 xl:ml-4",
        icon: Laptop,
        tag: "DevLab Ready"
    },
    { 
        glow: "border-white/10 bg-[#0B0F28]/90 hover:border-blue-500/40 hover:bg-[#0E1436]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        accent: "text-blue-400",
        angle: -3,
        offset: "ml-8 xl:ml-12",
        icon: Code,
        tag: "Production Code"
    }
];

// Unified, Normal & Professional Badges Preset for Internships (Right Wing)
const INTERNSHIP_BADGE_PRESETS = [
    { 
        glow: "border-white/10 bg-[#09141F]/90 hover:border-emerald-500/40 hover:bg-[#0C1B2A]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        accent: "text-emerald-400",
        angle: 5,
        offset: "mr-0",
        icon: Terminal,
        tag: "Active Batch"
    },
    { 
        glow: "border-white/10 bg-[#09141F]/90 hover:border-emerald-500/40 hover:bg-[#0C1B2A]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        accent: "text-emerald-400",
        angle: 2,
        offset: "mr-6 xl:mr-10",
        icon: Briefcase,
        tag: "QR Verified"
    },
    { 
        glow: "border-white/10 bg-[#09141F]/90 hover:border-emerald-500/40 hover:bg-[#0C1B2A]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        accent: "text-emerald-400",
        angle: 6,
        offset: "mr-2 xl:mr-4",
        icon: Cpu,
        tag: "Mentored"
    },
    { 
        glow: "border-white/10 bg-[#09141F]/90 hover:border-emerald-500/40 hover:bg-[#0C1B2A]/95 shadow-lg shadow-black/40 text-white", 
        badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        accent: "text-emerald-400",
        angle: 3,
        offset: "mr-8 xl:mr-12",
        icon: Rocket,
        tag: "Industrial LOR"
    }
];

// Executive-Grade Metric Badge Component
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
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div 
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: glowColor }}
            />
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

export function Hero({ 
    initialUserCount = 10, 
    initialInternshipCount = 12, 
    initialCourseCount = 5,
    courses = [],
    internships = []
}: HeroProps) {
    const { user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);

    const activeStudents = initialUserCount > 0 ? `${initialUserCount}+` : "10+";
    const launchedInternships = initialInternshipCount > 0 ? `${initialInternshipCount}+` : "12+";
    const availableCourses = initialCourseCount > 0 ? `${initialCourseCount}+` : "5+";

    // Guarantee 4 dynamic slots on each wing
    const displayCourses = Array.from({ length: 4 }).map((_, i) => courses[i] || DEFAULT_COURSES[i]);
    const displayInternships = Array.from({ length: 4 }).map((_, i) => internships[i] || DEFAULT_INTERNSHIPS[i]);

    return (
        <section className="relative pt-20 pb-8 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 overflow-hidden bg-[#04060e]">
            {/* Ambient Multi-Layer Aura Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/18 via-indigo-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-1/4 left-4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/4 right-4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Softened High-Tech Lined Blueprint Grid with Atmospheric Blur */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none backdrop-blur-[1px]" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                <div className="flex flex-col items-center space-y-6 sm:space-y-8">
                        
                    {/* Top Webory Credibility Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300 shadow-sm backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="font-semibold text-emerald-400">Govt. Registered Startup</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-300">Mentored by IIT Mandi Faculty</span>
                    </div>

                    {/* SPACIOUS INTERACTIVE SHOWCASE STAGE (Responsive & Overflow-Safe) */}
                    <div 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsHovered(prev => !prev)}
                        className="relative w-full py-4 sm:py-10 lg:py-16 min-h-0 lg:min-h-[460px] flex items-center justify-center cursor-default group"
                    >
                        
                        {/* LEFT FLANK: Webory Holographic Course Badges (Spread Out & Tilted) */}
                        <div className={`hidden lg:flex absolute -left-4 xl:-left-12 2xl:-left-20 top-1/2 -translate-y-1/2 flex-col items-start gap-6 xl:gap-7 z-20 w-[260px] xl:w-[290px] transition-all duration-300 ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                            {displayCourses.map((course, idx) => {
                                const preset = COURSE_BADGE_PRESETS[idx % COURSE_BADGE_PRESETS.length];
                                const Icon = preset.icon;
                                return (
                                    <motion.div
                                        key={`course-${course.slug || idx}-${course.title}`}
                                        initial={false}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                            x: isHovered ? 0 : 50,
                                            rotate: isHovered ? preset.angle : 0,
                                            scale: isHovered ? 1 : 0.85
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            rotate: preset.angle - 2,
                                            transition: { duration: 0.15 }
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: isHovered ? idx * 0.05 : 0
                                        }}
                                        className={`${preset.offset}`}
                                    >
                                        <Link 
                                            href="/courses"
                                            className={`group/badge flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-xl border ${preset.glow} transition-all duration-300 hover:border-blue-400/60 block`}
                                        >
                                            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                <Icon size={13} className={preset.accent} />
                                            </div>
                                            <div className="text-left">
                                                <span className="text-white text-xs font-bold block truncate max-w-[170px] xl:max-w-[200px] group-hover/badge:text-cyan-300 transition-colors">
                                                    {course.title}
                                                </span>
                                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border inline-block ${preset.badgeBg}`}>
                                                    {preset.tag}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* CENTER STAGE: Beautifully Crafted Headline & Call-to-Action */}
                        <div className="relative z-10 px-4 max-w-xl text-center space-y-4 sm:space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Next-Gen Career Launchpad</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.12] drop-shadow-sm">
                                Master In-Demand Skills. <br />
                                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(52,211,153,0.3)]">
                                    Build Real-World Careers.
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-gray-300 font-normal max-w-lg mx-auto leading-relaxed pt-0.5">
                                Accelerate your engineering journey with <span className="text-white font-medium">adaptive AI roadmaps</span>, live <span className="text-white font-medium">48-hour competitive hackathons</span>, and <span className="text-white font-medium">verified industrial internships</span>.
                            </p>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/career-roadmap" className="w-full sm:w-auto inline-block">
                                    <button 
                                        type="button"
                                        className="w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                                    >
                                        <span>Get Started Free</span>
                                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </Link>

                                <Link href="/courses" className="w-full sm:w-auto inline-block">
                                    <button 
                                        type="button"
                                        className="w-full sm:w-auto h-12 px-5 text-sm font-semibold text-gray-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] transition-all"
                                    >
                                        Explore Catalog
                                    </button>
                                </Link>
                            </div>

                            {/* Mobile Interactive Touch Hint Pill */}
                            <div className="lg:hidden pt-2 flex items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsHovered(prev => !prev);
                                    }}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300 shadow-lg ${
                                        isHovered 
                                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/10' 
                                            : 'bg-white/[0.06] border-white/15 text-gray-200 active:scale-95'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-emerald-400' : 'bg-gray-400'} animate-pulse`} />
                                    <span>{isHovered ? "Hide Live Programs ✕" : "Touch to preview Live Courses & Internships ✨"}</span>
                                </button>
                            </div>

                            {/* Mobile Fanned-Out Programs Showcase (Appears on Touch) */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -8 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -8 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="lg:hidden w-full pt-4 space-y-3 overflow-hidden text-left"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                Live Tracks
                                            </span>
                                            <span className="text-[10px] text-emerald-400 font-medium">
                                                Tap to explore
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2.5">
                                            {/* 4 Courses Column */}
                                            <div className="flex flex-col gap-2.5">
                                                {displayCourses.map((course, idx) => {
                                                    const preset = COURSE_BADGE_PRESETS[idx % COURSE_BADGE_PRESETS.length];
                                                    const Icon = preset.icon;
                                                    return (
                                                        <Link
                                                            key={`mob-course-${course.slug || idx}-${course.title}`}
                                                            href="/courses"
                                                            className={`flex flex-col p-2.5 rounded-xl backdrop-blur-xl border ${preset.glow} transition-all duration-200 active:scale-95 block`}
                                                            style={{ transform: `rotate(${preset.angle * 0.4}deg)` }}
                                                        >
                                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                                <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                                                                    <Icon size={11} className={preset.accent} />
                                                                </div>
                                                                <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${preset.badgeBg}`}>
                                                                    {preset.tag}
                                                                </span>
                                                            </div>
                                                            <span className="text-white text-[11px] font-bold line-clamp-2 leading-tight">
                                                                {course.title}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>

                                            {/* 4 Internships Column */}
                                            <div className="flex flex-col gap-2.5">
                                                {displayInternships.map((internship, idx) => {
                                                    const preset = INTERNSHIP_BADGE_PRESETS[idx % INTERNSHIP_BADGE_PRESETS.length];
                                                    const Icon = preset.icon;
                                                    return (
                                                        <Link
                                                            key={`mob-intern-${internship.slug || idx}-${internship.title}`}
                                                            href="/internships"
                                                            className={`flex flex-col p-2.5 rounded-xl backdrop-blur-xl border ${preset.glow} transition-all duration-200 active:scale-95 block`}
                                                            style={{ transform: `rotate(${preset.angle * 0.4}deg)` }}
                                                        >
                                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                                <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                                                                    <Icon size={11} className={preset.accent} />
                                                                </div>
                                                                <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${preset.badgeBg}`}>
                                                                    {preset.tag}
                                                                </span>
                                                            </div>
                                                            <span className="text-white text-[11px] font-bold line-clamp-2 leading-tight">
                                                                {internship.title}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT FLANK: Webory Holographic Internship Badges (Spread Out & Tilted) */}
                        <div className={`hidden lg:flex absolute -right-4 xl:-right-12 2xl:-right-20 top-1/2 -translate-y-1/2 flex-col items-end gap-6 xl:gap-7 z-20 w-[260px] xl:w-[290px] transition-all duration-300 ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                            {displayInternships.map((internship, idx) => {
                                const preset = INTERNSHIP_BADGE_PRESETS[idx % INTERNSHIP_BADGE_PRESETS.length];
                                const Icon = preset.icon;
                                return (
                                    <motion.div
                                        key={`internship-${internship.slug || idx}-${internship.title}`}
                                        initial={false}
                                        animate={{
                                            opacity: isHovered ? 1 : 0,
                                            x: isHovered ? 0 : -50,
                                            rotate: isHovered ? preset.angle : 0,
                                            scale: isHovered ? 1 : 0.85
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            rotate: preset.angle + 2,
                                            transition: { duration: 0.15 }
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: isHovered ? idx * 0.05 : 0
                                        }}
                                        className={`${preset.offset}`}
                                    >
                                        <Link 
                                            href="/internships"
                                            className={`group/badge flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-xl border ${preset.glow} transition-all duration-300 hover:border-emerald-400/60 block`}
                                        >
                                            <div className="text-right">
                                                <span className="text-white text-xs font-bold block truncate max-w-[170px] xl:max-w-[200px] group-hover/badge:text-emerald-300 transition-colors">
                                                    {internship.title}
                                                </span>
                                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border inline-block ${preset.badgeBg}`}>
                                                    {preset.tag}
                                                </span>
                                            </div>
                                            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                <Icon size={13} className={preset.accent} />
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                    </div>


                    {/* Mobile Compact 1-Row Stats Strip */}
                    <div className="sm:hidden grid grid-cols-4 divide-x divide-white/10 bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-1 text-center shadow-sm my-2 w-full">
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
                    <div className="hidden sm:block pt-4 w-full max-w-4xl">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                    Live Student Impact & Outcomes
                                </span>
                            </div>

                            {/* Social Proof Pill */}
                            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-sm backdrop-blur-sm">
                                <div className="flex -space-x-2 overflow-hidden">
                                    {[
                                        "from-blue-500 to-indigo-600",
                                        "from-purple-500 to-pink-500",
                                        "from-amber-400 to-orange-500",
                                        "from-emerald-400 to-teal-600",
                                        "from-rose-500 to-red-600",
                                    ].map((gradient, i) => (
                                        <div
                                            key={i}
                                            className={`inline-block h-5 w-5 rounded-full ring-1.5 ring-[#0A0D1F] bg-gradient-to-br ${gradient} flex items-center justify-center text-[8px] font-bold text-white shadow-sm`}
                                        >
                                            {["M", "R", "A", "S", "P"][i]}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    <div className="flex items-center text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                                        ))}
                                        <span className="ml-1 text-[11px] font-bold text-white">4.9 / 5</span>
                                    </div>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-[11px] text-gray-400">
                                        Trusted across <span className="text-gray-200 font-semibold">IITs & NITs</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
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

                </div>
            </div>
        </section>
    );
}