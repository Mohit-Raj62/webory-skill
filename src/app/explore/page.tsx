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
    Activity,
    ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ExploreItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
    description?: string;
    verified?: boolean;
}

interface Category {
    title: string;
    subtitle: string;
    id: string;
    items: ExploreItem[];
}

const MENU_RAIL_CATEGORIES: Category[] = [
    {
        title: "CORE DIRECTIVES",
        id: "core",
        subtitle: "Primary Platform Modules",
        items: [
            { 
                label: "HACKATHONS", 
                href: "/hackathons", 
                icon: Trophy, 
                badge: "LIVE", 
                description: "Participate in global industrial competitions", 
                verified: true
            },
            { 
                label: "MENTORSHIP", 
                href: "/mentorship", 
                icon: MessagesSquare, 
                badge: "ELITE", 
                description: "One-on-one sessions with industry veterans",
                verified: true
            },
        ]
    },
    {
        title: "INNOVATION LABS",
        id: "labs",
        subtitle: "Experimental Tech Hub",
        items: [
            { label: "WEBORY OS", href: "/simulator", icon: Monitor, badge: "STABLE", description: "Terminal-based learning environment" },
            { label: "LOGICROOM", href: "/viz", icon: Orbit, badge: "3D", description: "Advanced code visualization engine", verified: true },
            { label: "RESUME AI", href: "/resume-checker", icon: FileText, badge: "NEURAL", description: "AI-powered skill verification", verified: true },
        ]
    },
    {
        title: "PLATFORM SYNC",
        id: "sync",
        subtitle: "Global Network Transparency",
        items: [
            { label: "ABOUT US", href: "/about", icon: Info, description: "Our mission and story" },
            { label: "CAREERS", href: "/careers", icon: Briefcase, description: "Join our core engineering team" },
            { label: "AMBASSADOR", href: "/ambassador", icon: UserCircle, badge: "JOIN", description: "Spread the innovation", verified: true },
            { label: "TECH BLOG", href: "/blog", icon: BookOpen, description: "Latest platform engineering insights" },
            { label: "SUPPORT", href: "/contact", icon: Mail, description: "Direct link to neural support" },
        ]
    }
];

const SOCIALS = [
    { icon: Github, href: "#", name: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/webory-skills-01244b3a9", name: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/weboryskills", name: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@CodeWithWebory", name: "YouTube" },
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
        <div className="min-h-screen bg-[#050505] text-white pb-10 overflow-x-hidden selection:bg-blue-500/30 font-mono tracking-tighter">
            
            {/* Masterpiece Nebula Backdrop */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 brightness-150 z-20" />
                <div 
                    className="absolute inset-0 opacity-[0.02] z-10" 
                    style={{ 
                        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} 
                />

                {/* Flowing Nebula Blobs */}
                <motion.div 
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[500px] bg-blue-600/10 blur-[150px] rounded-full" 
                />
            </div>

            {/* Premium Header Control Rail */}
            <div className="relative z-50 pt-safe px-4 sm:px-6 pt-32">
                <header className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex items-center justify-between gap-2">
                         <div className="flex items-center gap-2 sm:gap-3">
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => router.back()}
                                className="bg-white/[0.03] border border-white/10 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all backdrop-blur-2xl whitespace-nowrap"
                            >
                                <ArrowLeft size={14} />
                                BACK
                            </motion.button>
                         </div>

                        <div className="flex items-center gap-2 sm:gap-4 bg-white/[0.03] border border-white/5 px-3 sm:px-4 py-2 rounded-full backdrop-blur-3xl shadow-xl min-w-0">
                            <span className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                ONLINE
                            </span>
                            <div className="w-px h-3 bg-white/10" />
                            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 whitespace-nowrap">
                                <Clock size={12} />
                                <span className="text-[9px] sm:text-[10px] font-black">{currentTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-5 mt-2">
                         <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-3xl flex-shrink-0">
                                <LayoutGrid size={24} className="text-blue-500 sm:w-[28px] sm:h-[28px]" />
                                <div className="absolute inset-0 bg-blue-500/10 blur-xl -z-10" />
                         </div>
                         <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-white leading-none truncate">
                                EXPLORE <span className="text-blue-400">INDEX</span>
                            </h1>
                            <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-2 truncate">Industrial Navigation Unit v.5</p>
                         </div>
                    </div>
                </header>
            </div>

            <main className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
                
                {MENU_RAIL_CATEGORIES.map((category, catIdx) => (
                    <section key={category.id} className="mb-16 sm:mb-20 last:mb-0 space-y-5 sm:space-y-6">
                        {/* Technical Section Divider */}
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] sm:tracking-[0.5em] italic">{category.title}</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-blue-500/20 to-transparent" />
                             </div>
                             <p className="border-l border-blue-500/30 pl-3 text-[8px] sm:text-[9px] font-bold text-gray-600 uppercase tracking-widest">{category.subtitle}</p>
                        </div>

                        {/* Premium Vertical Rail */}
                        <div className="flex flex-col gap-2.5 sm:gap-3">
                            {category.items.map((item, itemIdx) => (
                                <motion.div
                                    key={itemIdx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (catIdx * 0.1) + (itemIdx * 0.05), duration: 0.6 }}
                                    whileTap={{ scale: 0.98, x: 5 }}
                                    className="group relative"
                                >
                                    <Link 
                                        href={item.href}
                                        className="relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0A0A0A] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-300 backdrop-blur-3xl overflow-hidden shadow-sm shadow-blue-500/5 group"
                                    >
                                        {/* Interaction Glow */}
                                        <div className="absolute inset-y-0 left-0 w-1 bg-blue-500/0 group-hover:bg-blue-500/60 transition-all" />
                                        
                                        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all shadow-xl flex-shrink-0">
                                                <item.icon size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <h3 className="text-xs sm:text-sm font-black tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors truncate">{item.label}</h3>
                                                    {item.verified && (
                                                         <ShieldCheck size={10} className="text-blue-500 sm:w-[12px] sm:h-[12px]" />
                                                    )}
                                                </div>
                                                <p className="text-[8px] sm:text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-none truncate">{item.description || "Access neural functionality"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-2">
                                            {item.badge && (
                                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 italic hidden min-[360px]:inline-block">
                                                    {item.badge}
                                                </span>
                                            )}
                                            <ChevronRight size={14} className="text-gray-700 sm:w-[16px] sm:h-[16px] group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Final Professional Identity Rail */}
                <footer className="pt-10 sm:pt-12 pb-8 sm:pb-10 space-y-8 sm:space-y-10 border-t border-white/5">
                    <div className="flex flex-col items-center gap-8 sm:gap-10">
                        {/* Premium Social Rail */}
                        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
                            {SOCIALS.map((social, sIdx) => (
                                <Link 
                                    key={sIdx} 
                                    href={social.href} 
                                    className="group flex flex-col items-center gap-1.5 sm:gap-2"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:scale-110 transition-all duration-300 shadow-xl">
                                        <social.icon size={18} className="sm:w-[20px] sm:h-[20px]" strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-700 group-hover:text-blue-500 transition-colors">
                                        {social.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-4 text-center w-full">
                             <div className="flex justify-center gap-4 sm:gap-6">
                                {["PRIVACY", "TERMS", "SUPPORT"].map((l, i) => (
                                    <Link key={i} href="#" className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-blue-400 transition-colors italic">{l}</Link>
                                ))}
                            </div>
                            
                            {/* Detailed Branding Hub */}
                            <div className="flex flex-col items-center gap-3 w-full">
                                <div className="flex items-center gap-2 sm:gap-3">
                                     <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-[8px] font-black">W</div>
                                     </div>
                                     <div className="flex flex-col items-start leading-none gap-0.5">
                                        <span className="text-xs sm:text-sm font-black tracking-tighter italic">WEBORY <span className="text-blue-500">SKILLS</span></span>
                                        <span className="text-[6px] sm:text-[7px] font-bold text-gray-700 tracking-widest uppercase">Official Industry Platform</span>
                                     </div>
                                </div>
                                <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto opacity-50" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4 sm:space-y-5">
                        <div className="space-y-1.5 opacity-60">
                             <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-gray-700 italic">WEBORY TECHNOLOGIES INC.</p>
                             <p className="text-[6px] sm:text-[7px] text-gray-800 font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-none">Industrial Navigation Operating System • EST. 2024</p>
                        </div>
                        <div className="flex justify-center gap-4 sm:gap-6 opacity-20 group-hover:opacity-100 transition-all">
                                <Cpu size={12} className="sm:w-[14px] sm:h-[14px] text-gray-800" />
                                <Activity size={12} className="sm:w-[14px] sm:h-[14px] text-gray-800" />
                                <Dna size={12} className="sm:w-[14px] sm:h-[14px] text-gray-800" />
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
