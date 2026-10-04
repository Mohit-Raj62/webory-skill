"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, GraduationCap, Briefcase, Award, X } from "lucide-react";

interface Activity {
    id: number;
    name: string;
    avatarColor: string;
    initials: string;
    action: string;
    course: string;
    time: string;
    icon: any;
    iconColor: string;
    badgeText: string;
}

const ACTIVITIES: Activity[] = [
    {
        id: 1,
        name: "Mohit R.",
        avatarColor: "from-blue-500 to-indigo-600",
        initials: "MR",
        action: "earned +500 XP",
        course: "Wall of Fame Leaderboard",
        time: "Just now",
        icon: Trophy,
        iconColor: "text-amber-400",
        badgeText: "Leaderboard",
    },
    {
        id: 2,
        name: "Ridhima S.",
        avatarColor: "from-purple-500 to-pink-500",
        initials: "RS",
        action: "completed Module 1 Free Preview",
        course: "Full-Stack GenAI Developer",
        time: "1m ago",
        icon: Zap,
        iconColor: "text-emerald-400",
        badgeText: "Module Complete",
    },
    {
        id: 3,
        name: "Anshika S.",
        avatarColor: "from-emerald-500 to-teal-600",
        initials: "AS",
        action: "unlocked Verified Credential",
        course: "IIT Mandi Mentored Track",
        time: "3m ago",
        icon: GraduationCap,
        iconColor: "text-purple-400",
        badgeText: "Certified",
    },
    {
        id: 4,
        name: "Ayush M.",
        avatarColor: "from-amber-400 to-orange-500",
        initials: "AM",
        action: "submitted live sprint project",
        course: "Production Web Internship",
        time: "5m ago",
        icon: Briefcase,
        iconColor: "text-blue-400",
        badgeText: "Internship Sprint",
    },
    {
        id: 5,
        name: "Tanya K.",
        avatarColor: "from-rose-500 to-red-600",
        initials: "TK",
        action: "scored 100% on DevLab challenge",
        course: "Python 3.12 Backend Master",
        time: "8m ago",
        icon: Award,
        iconColor: "text-amber-300",
        badgeText: "100% Score",
    },
];

export function LiveStudentActivity() {
    const [mounted, setMounted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isVisible || isPaused || !mounted) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        }, 5500);

        return () => clearInterval(interval);
    }, [isVisible, isPaused, mounted]);

    if (!mounted || !isVisible) return null;

    const current = ACTIVITIES[currentIndex];
    const Icon = current.icon;

    return (
        <aside
            aria-label="Live student activity notification"
            className="hidden md:block fixed bottom-6 left-6 z-40 max-w-[370px] select-none pointer-events-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    className="relative group rounded-2xl border border-white/[0.12] bg-[#0E1330]/95 backdrop-blur-2xl p-3 sm:p-3.5 shadow-2xl shadow-black/60 hover:border-white/25 transition-all duration-300 overflow-hidden"
                >
                    {/* Top Specular Edge Shine */}
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    {/* Ambient subtle glow */}
                    <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

                    <div className="flex items-start gap-2.5 sm:gap-3">
                        {/* Student Avatar with Pulsing Online Beacon */}
                        <div className="relative shrink-0">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${current.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/10`}>
                                {current.initials}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0E1330]" />
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-xs font-bold text-white truncate">
                                    {current.name}
                                </span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-white/[0.08] text-gray-300 border border-white/[0.08] shrink-0">
                                    {current.badgeText}
                                </span>
                            </div>

                            <p className="text-[11px] text-gray-300 leading-tight truncate">
                                <span className="text-emerald-400 font-semibold">{current.action}</span>
                            </p>

                            <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5 flex items-center gap-1">
                                <Icon size={11} className={current.iconColor} />
                                <span>{current.course}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">{current.time}</span>
                            </p>
                        </div>

                        {/* Dismiss button */}
                        <button
                            type="button"
                            aria-label="Dismiss notification"
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 shrink-0"
                        >
                            <X size={12} />
                        </button>
                    </div>

                    {/* Auto-rotation Progress Line */}
                    <div className="mt-2.5 h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                            key={current.id}
                            initial={{ width: "0%" }}
                            animate={{ width: isPaused ? "100%" : "100%" }}
                            transition={{ duration: 5.5, ease: "linear" }}
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </aside>
    );
}
