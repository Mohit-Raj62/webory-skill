"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
    Twitter,
    Linkedin,
    Instagram,
    Youtube
} from "lucide-react";
import { useRouter } from "next/navigation";

const EXPLORE_CATEGORIES = [
    {
        title: "CORE LEARNING",
        icon: GraduationCap,
        color: "text-blue-400",
        glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
        items: [
            { label: "Courses", href: "/courses", icon: GraduationCap, badge: "Free" },
            { label: "Internships", href: "/internships", icon: Briefcase, badge: "Hi-Res" },
            { label: "Hackathons", href: "/hackathons", icon: Trophy, badge: "Live" },
            { label: "Mentorship", href: "/mentorship", icon: MessagesSquare, badge: "Pro" },
            { label: "AI Nexus", href: "/ai-prep", icon: Zap, badge: "Elite" },
        ]
    },
    {
        title: "INNOVATION LABS",
        icon: Orbit,
        color: "text-emerald-400",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
        items: [
            { label: "WeboryOS", href: "/simulator", icon: Monitor, badge: "New" },
            { label: "DevLab", href: "/playground", icon: Code2, badge: "Beta" },
            { label: "LogicRoom", href: "/viz", icon: Orbit, badge: "Hi-Fi" },
            { label: "Resume AI", href: "/resume-checker", icon: FileText, badge: "Free" },
        ]
    },
    {
        title: "THE NETWORK",
        icon: Info,
        color: "text-purple-400",
        glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        items: [
            { label: "About", href: "/about", icon: Info },
            { label: "Careers", href: "/careers", icon: Briefcase },
            { label: "Blog", href: "/blog", icon: BookOpen },
            { label: "Contact", href: "/contact", icon: Mail },
            { label: "Ambassador", href: "/ambassador", icon: UserCircle, badge: "Join" },
        ]
    }
];

const SOCIALS = [
    { icon: Github, href: "#", color: "hover:text-white" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/webory-skills-01244b3a9", color: "hover:text-[#0077b5]" },
    { icon: Instagram, href: "https://www.instagram.com/weboryskills", color: "hover:text-[#ee2a7b]" },
    { icon: Youtube, href: "https://www.youtube.com/@CodeWithWebory", color: "hover:text-[#ff0000]" },
];

export default function ExplorePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-white pb-32 overflow-x-hidden selection:bg-blue-500/30">
            {/* Animated Control Center Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.15, 0.25, 0.15] 
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[140px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.1, 0.2, 0.1] 
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[20%] w-[80%] h-[80%] bg-purple-600/10 rounded-full blur-[140px]" 
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-150" />
            </div>

            {/* Premium Header */}
            <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-3xl border-b border-white/[0.05] shadow-2xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()}
                        className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-[0.4em] text-blue-500 uppercase italic">Control Center</span>
                        <h1 className="text-lg font-black uppercase tracking-[0.1em] italic flex items-center gap-2">
                             EXPLORE <span className="text-blue-500">HUB</span>
                             <Sparkles size={14} className="text-yellow-500 animate-pulse" />
                        </h1>
                    </div>

                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            {/* Control Center Page Content */}
            <main className="relative z-10 max-w-xl mx-auto px-6 pt-10 space-y-12">
                
                {/* Visual Search Highlight (Fake) */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition" />
                    <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-black border border-white/10">
                        <Search size={18} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-600 italic">Access neural network functions...</span>
                    </div>
                </div>

                {EXPLORE_CATEGORIES.map((category, catIdx) => (
                    <section key={catIdx} className="space-y-6">
                        {/* High-End Section Header */}
                        <div className="flex flex-col items-center">
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 ${category.color} ${category.glow}`}
                            >
                                <category.icon size={22} />
                            </motion.div>
                            <div className="flex flex-col items-center text-center">
                                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-500 mb-1 italic">
                                    {category.title}
                                </h2>
                                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-40" />
                            </div>
                        </div>

                        {/* Control Center Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {category.items.map((item, itemIdx) => (
                                <motion.div
                                    key={itemIdx}
                                    whileTap={{ scale: 0.96 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (catIdx * 0.1) + (itemIdx * 0.05) }}
                                >
                                    <Link 
                                        href={item.href}
                                        className="relative group h-full flex flex-col items-center text-center p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
                                    >
                                        {/* Premium Glow Overlay */}
                                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className={`p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-3 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-300 ${category.color}`}>
                                            <item.icon size={20} />
                                        </div>
                                        
                                        <span className="text-xs font-bold tracking-tight text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                                        
                                        {item.badge && (
                                            <div className="mt-2.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 italic">{item.badge}</span>
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Footer Section Cleanup */}
                <div className="pt-12 space-y-12 border-t border-white/[0.05]">
                    {/* Social Holograms */}
                    <div className="flex justify-center gap-8">
                        {SOCIALS.map((social, sIdx) => (
                            <Link 
                                key={sIdx} 
                                href={social.href}
                                className={`w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500 transition-all duration-300 hover:text-white hover:scale-110 hover:border-white/20 hover:bg-white/[0.05] ${social.color}`}
                            >
                                <social.icon size={18} />
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                            { label: "Refunds", href: "/refund-policy" }
                        ].map((link, lIdx) => (
                            <Link 
                                key={lIdx} 
                                href={link.href}
                                className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-black tracking-[0.2em] uppercase text-gray-500 hover:text-white hover:border-blue-500/30 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="text-center opacity-40">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500 italic">
                            System Identity: Webory Technologies
                        </p>
                        <p className="text-[8px] mt-2 tracking-widest">EST. 2024 • MSME REGISTERED</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
