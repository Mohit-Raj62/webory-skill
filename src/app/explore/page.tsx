"use client";

import React from "react";
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
    Pulse,
    Activity,
    Settings,
    LayoutGrid
} from "lucide-react";
import { useRouter } from "next/navigation";

// Define different sizes for Bento Box items
type ItemSize = "small" | "large" | "wide";

interface ExploreItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
    description?: string;
    size?: ItemSize;
    verified?: boolean;
}

interface Category {
    title: string;
    subtitle: string;
    icon: any;
    accent: string;
    items: ExploreItem[];
}

const EXPLORE_CATEGORIES: Category[] = [
    {
        title: "Learning",
        subtitle: "Professional Development Path",
        icon: GraduationCap,
        accent: "from-blue-600/40 to-cyan-500/40",
        items: [
            { label: "Live Hackathons", href: "/hackathons", icon: Trophy, badge: "Live", size: "wide", description: "Participate and win industrial rewards", verified: true },
            { label: "Industry Mentors", href: "/mentorship", icon: MessagesSquare, badge: "Pro", size: "small", verified: true },
        ]
    },
    {
        title: "Innovation",
        subtitle: "Advanced Tech Ecosystem",
        icon: Orbit,
        accent: "from-emerald-600/40 to-teal-500/40",
        items: [
            { label: "WeboryOS", href: "/simulator", icon: Monitor, badge: "New", size: "small" },
            { label: "LogicRoom", href: "/viz", icon: Orbit, badge: "Hi-Fi", size: "small" },
            { label: "Resume Intelligence", href: "/resume-checker", icon: FileText, badge: "AI", size: "small", verified: true },
        ]
    },
    {
        title: "Platform",
        subtitle: "Corporate Transparency",
        icon: Info,
        accent: "from-purple-600/40 to-indigo-500/40",
        items: [
            { label: "Careers", href: "/careers", icon: Briefcase, size: "small" },
            { label: "About Webory", href: "/about", icon: Info, size: "small" },
            { label: "Ambassador", href: "/ambassador", icon: UserCircle, badge: "Join", size: "small", verified: true },
            { label: "Engineering Blog", href: "/blog", icon: BookOpen, size: "small" },
            { label: "Direct Support", href: "/contact", icon: Mail, size: "small" },
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

    return (
        <div className="min-h-screen bg-[#000] text-white pb-40 overflow-x-hidden selection:bg-blue-500/30">
            {/* Elite Neural Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(10,10,25,1)_0%,_rgba(0,0,0,1)_100%)]" />
                <div 
                    className="absolute inset-0 opacity-[0.15]" 
                    style={{ 
                        backgroundImage: `linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} 
                />
                <motion.div 
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full" 
                />
                <div className="absolute inset-0 bg-[#000]/20 backdrop-filter" />
            </div>

            {/* Elite Status Header */}
            <div className="relative z-50 pt-safe px-6 pt-8 pb-4">
               <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-3xl">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 py-1.5 rounded-xl bg-white/5 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Exit Hub
                    </motion.button>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none">System Status</span>
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                STABLE.v3
                            </span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <ShieldCheck size={18} className="text-gray-500" />
                    </div>
               </div>
            </div>

            <main className="relative z-10 max-w-xl mx-auto px-6 pt-4 space-y-16">
                
                {/* Visual Identity Section */}
                <header className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LayoutGrid size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black italic tracking-tight uppercase leading-none">
                                EXPLORE <span className="text-blue-500">SYSTEM</span>
                            </h1>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Core Neural Distribution</p>
                        </div>
                    </div>
                </header>

                {EXPLORE_CATEGORIES.map((category, catIdx) => (
                    <section key={catIdx} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {/* Category Label */}
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg bg-white/5 border border-white/10`}>
                                <category.icon size={16} className="text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-xs font-black uppercase tracking-[0.2em]">{category.title}</h2>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{category.subtitle}</span>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-2 gap-4">
                            {category.items.map((item, itemIdx) => (
                                <motion.div
                                    key={itemIdx}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "group relative",
                                        item.size === "wide" ? "col-span-2" : "col-span-1"
                                    )}
                                >
                                    <Link 
                                        href={item.href}
                                        className="relative block h-full p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Premium Glass Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <div className="flex flex-col h-full relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-500">
                                                    <item.icon size={item.size === "wide" ? 22 : 18} className="text-blue-400" />
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5">
                                                    {item.badge && (
                                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 italic">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {item.verified && (
                                                        <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1 mt-auto">
                                                <h3 className="text-sm font-black tracking-tight group-hover:text-blue-400 transition-colors uppercase italic">{item.label}</h3>
                                                {item.description && (
                                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-[150px]">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Footnote Identity */}
                <footer className="pt-20 space-y-12 border-t border-white/[0.05]">
                    <div className="flex justify-center gap-10">
                        {SOCIALS.map((social, sIdx) => (
                            <Link 
                                key={sIdx} 
                                href={social.href}
                                className="text-gray-600 hover:text-white transition-all transform hover:scale-125"
                            >
                                <social.icon size={20} strokeWidth={1.5} />
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="flex gap-4">
                            {["Privacy", "Terms", "Support"].map((l, i) => (
                                <Link key={i} href="#" className="text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-blue-400 transition-colors">{l}</Link>
                            ))}
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-700 italic">WEBORY TECHNOLOGIES SYSTEM</p>
                            <p className="text-[7px] text-gray-800 font-bold uppercase tracking-[0.2em] mt-1.5">Industrial Recognition • MSME REGISTERED</p>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}

// Utility function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
