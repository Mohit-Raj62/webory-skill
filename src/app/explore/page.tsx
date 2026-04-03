"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Trophy, 
    MessagesSquare, 
    Monitor, 
    Code2, 
    FileText, 
    GraduationCap, 
    Briefcase, 
    Zap, 
    Info, 
    Mail, 
    BookOpen, 
    UserCircle,
    Orbit,
    ArrowLeft,
    Sparkles,
    Search,
    Github,
    Linkedin,
    Instagram,
    Youtube,
    ShieldCheck,
    Cpu,
    Dna,
    Network,
    Terminal,
    ChevronRight,
    LayoutGrid,
    Clock,
    Activity
} from "lucide-react";
import { useRouter } from "next/navigation";

// Define Masterpiece UI Types
type ItemSize = "small" | "large" | "wide";

interface ExploreItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
    description?: string;
    size?: ItemSize;
    verified?: boolean;
    accentGlow?: string;
}

interface Category {
    title: string;
    subtitle: string;
    id: string;
    items: ExploreItem[];
}

const MASTERPIECE_CATEGORIES: Category[] = [
    {
        title: "CORE DIRECTIVES",
        id: "core",
        subtitle: "Neural Pathway Distributions",
        items: [
            { 
                label: "HACKATHONS", 
                href: "/hackathons", 
                icon: Trophy, 
                badge: "LIVE", 
                size: "wide", 
                description: "Participate in global industrial competitions", 
                verified: true,
                accentGlow: "rgba(59, 130, 246, 0.5)"
            },
            { 
                label: "MENTORSHIP", 
                href: "/mentorship", 
                icon: MessagesSquare, 
                badge: "PRO", 
                size: "small",
                verified: true,
                accentGlow: "rgba(168, 85, 247, 0.5)"
            },
        ]
    },
    {
        title: "LAB SYSTEMS",
        id: "labs",
        subtitle: "Experimental Technology Hub",
        items: [
            { label: "WEBORY OS", href: "/simulator", icon: Monitor, badge: "STABLE", size: "small" },
            { label: "LOGICROOM", href: "/viz", icon: Orbit, badge: "3D", size: "small", verified: true },
            { label: "RESUME AI", href: "/resume-checker", icon: FileText, badge: "NEURAL", size: "small", verified: true },
        ]
    },
    {
        title: "CORPORATE SYNC",
        id: "sync",
        subtitle: "Global Transparency Portal",
        items: [
            { label: "CAREERS", href: "/careers", icon: Briefcase, size: "small" },
            { label: "AMBASSADOR", href: "/ambassador", icon: UserCircle, badge: "JOIN", size: "small", verified: true },
            { label: "ABOUT SYSTEM", href: "/about", icon: Info, size: "small" },
            { label: "TECH BLOG", href: "/blog", icon: BookOpen, size: "small" },
            { label: "DIRECT COMMS", href: "/contact", icon: Mail, size: "small" },
        ]
    }
];

const SOCIALS = [
    { icon: Github, href: "#" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/webory-skills-01244b3a9" },
    { icon: Instagram, href: "https://www.instagram.com/weboryskills" },
    { icon: Youtube, href: "https://www.youtube.com/@CodeWithWebory" },
];

export default function ExplorePage() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
        };
        updateClock();
        const interval = setInterval(updateClock, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-32 overflow-x-hidden selection:bg-blue-500/30 font-mono tracking-tighter">
            
            {/* Masterpiece Nebula Backdrop */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 brightness-150 z-20" />
                <div 
                    className="absolute inset-0 opacity-[0.03] z-10" 
                    style={{ 
                        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }} 
                />

                {/* Flowing Nebula Blobs */}
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -left-1/4 w-[120%] h-[120%] bg-blue-600/10 blur-[150px] rounded-full" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -right-1/4 w-[130%] h-[130%] bg-purple-600/10 blur-[180px] rounded-full" 
                />
            </div>

            {/* Masterpiece Elite Interface Header */}
            <div className="relative z-50 pt-safe px-6 pt-10">
                <header className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                         <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => router.back()}
                            className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all backdrop-blur-2xl"
                        >
                            <ArrowLeft size={18} />
                        </motion.button>

                        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 px-5 py-2.5 rounded-full backdrop-blur-3xl">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Link</span>
                            </div>
                            <div className="w-px h-3 bg-white/10" />
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock size={12} />
                                <span className="text-[10px] font-black">{currentTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 mt-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-white/20 flex items-center justify-center shadow-2xl">
                                <LayoutGrid size={32} className="text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-none">
                                SYSTEM <span className="text-blue-500">CONSOLE</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <Terminal size={12} className="text-gray-600" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Webory Identity Distribution Hub</span>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <main className="relative z-10 max-w-xl mx-auto px-6 pt-16 space-y-24">
                
                {MASTERPIECE_CATEGORIES.map((category, catIdx) => (
                    <section key={category.id} className="space-y-10">
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500/80 italic">{category.title}</h2>
                                    <div className="h-px w-8 bg-blue-500/30" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{category.subtitle}</p>
                            </div>
                            <Activity size={18} className="text-gray-800" />
                        </div>

                        {/* Staggered Masterpiece Grid */}
                        <div className="grid grid-cols-2 gap-5">
                            {category.items.map((item, itemIdx) => (
                                <motion.div
                                    key={itemIdx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (itemIdx * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    whileTap={{ scale: 0.94 }}
                                    className={cn(
                                        "group relative h-full",
                                        item.size === "wide" ? "col-span-2" : "col-span-1"
                                    )}
                                >
                                    <Link 
                                        href={item.href}
                                        className="relative block h-full p-6 rounded-[2.5rem] bg-[#0A0A0A]/80 border border-white/[0.05] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] backdrop-blur-3xl hover:bg-[#0F0F0F] hover:border-blue-500/30 transition-all duration-500 group overflow-hidden"
                                    >
                                        {/* Luxury Glass Highlight */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex flex-col h-full relative z-10">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="relative">
                                                     <div className="absolute inset-0 bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                                     <div className="relative p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-500 shadow-xl">
                                                        <item.icon size={item.size === "wide" ? 28 : 22} />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col items-end gap-2">
                                                    {item.badge && (
                                                        <div className="px-3 py-1 rounded-full bg-white/[0.02] border border-white/5">
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 italic">
                                                                {item.badge}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.verified && (
                                                        <ShieldCheck size={14} className="text-blue-500 animate-pulse" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-black tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic leading-none">{item.label}</h3>
                                                    <ChevronRight size={16} className="text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </div>
                                                {item.description && (
                                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider leading-relaxed pr-8">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Final Masterpiece Identity */}
                <footer className="pt-24 pb-12 space-y-16 border-t border-white/[0.03]">
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic">NEURAL LINK</h4>
                            <div className="flex flex-col gap-3">
                                {SOCIALS.map((social, sIdx) => (
                                    <Link key={sIdx} href={social.href} className="text-gray-600 hover:text-white flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest transition-colors group">
                                        <social.icon size={12} className="group-hover:scale-125 transition-transform" />
                                        {social.icon.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4 text-right">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">AUTHENTICITY</h4>
                             <div className="space-y-1 opacity-40">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">ID: 2604-03-V4</p>
                                <p className="text-[8px] font-bold text-gray-600 tracking-widest">MSME REGISTERED</p>
                             </div>
                             <div className="flex justify-end gap-3 pt-4">
                                <Cpu size={14} className="text-gray-800" />
                                <Dna size={14} className="text-gray-800" />
                                <Network size={14} className="text-gray-800" />
                             </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-8 opacity-60">
                        <div className="flex gap-10">
                            {["PRIVACY", "TERMS", "SUPPORT"].map((l, i) => (
                                <Link key={i} href="#" className="text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-blue-500 transition-colors">{l}</Link>
                            ))}
                        </div>
                        <div className="text-center space-y-2">
                             <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto" />
                             <p className="text-[8px] font-black uppercase tracking-[0.8em] text-gray-700 italic">WEBORY TECHNOLOGIES CONSOLE</p>
                             <p className="text-[7px] text-gray-800 font-bold uppercase tracking-[0.2em]">OPERATING SYSTEMS • EST. 2024</p>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}

// Utility function
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
