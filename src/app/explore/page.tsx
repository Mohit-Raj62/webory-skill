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
    ShieldCheck, 
    ArrowLeft,
    Github,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    UserCircle,
    Orbit
} from "lucide-react";
import { useRouter } from "next/navigation";

const EXPLORE_CATEGORIES = [
    {
        title: "Learning & Growth",
        icon: GraduationCap,
        color: "text-blue-400",
        items: [
            { label: "All Courses", href: "/courses", icon: GraduationCap, badge: "Free" },
            { label: "Internships", href: "/internships", icon: Briefcase, badge: "New" },
            { label: "Hackathons", href: "/hackathons", icon: Trophy, badge: "Live" },
            { label: "Mentorship", href: "/mentorship", icon: MessagesSquare, badge: "Pro" },
            { label: "AI Nexus", href: "/ai-prep", icon: Zap, badge: "NexGen" },
        ]
    },
    {
        title: "Innovation Labs",
        icon: Orbit,
        color: "text-emerald-400",
        items: [
            { label: "DevLab IDE", href: "/playground", icon: Code2, badge: "Cloud" },
            { label: "WeboryOS", href: "/simulator", icon: Monitor, badge: "OS" },
            { label: "LogicRoom", href: "/viz", icon: Orbit, badge: "Beta" },
            { label: "Resume AI", href: "/resume-checker", icon: FileText, badge: "AI" },
        ]
    },
    {
        title: "Company & Community",
        icon: Info,
        color: "text-purple-400",
        items: [
            { label: "About Us", href: "/about", icon: Info },
            { label: "Careers", href: "/careers", icon: Briefcase },
            { label: "Our Blog", href: "/blog", icon: BookOpen },
            { label: "Contact Us", href: "/contact", icon: Mail },
            { label: "Ambassador", href: "/ambassador", icon: UserCircle, badge: "Join" },
        ]
    }
];

const SOCIAL_LINKS = [
    { icon: Github, href: "#", color: "hover:text-white" },
    { icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/webory-skills-01244b3a9", color: "hover:text-[#0077b5]" },
    { icon: Instagram, href: "https://www.instagram.com/weboryskills", color: "hover:text-[#ee2a7b]" },
    { icon: Youtube, href: "https://www.youtube.com/@CodeWithWebory", color: "hover:text-[#ff0000]" },
];

export default function ExplorePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-white pb-20 overflow-x-hidden">
            {/* Background Aesthetic */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4 px-6 flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="text-center flex-1 pr-8">
                    <h1 className="text-lg font-black uppercase tracking-[0.2em] italic">Explore <span className="text-blue-500">Hub</span></h1>
                </div>
            </div>

            {/* Scrolling Content */}
            <div className="relative z-10 max-w-lg mx-auto px-6 py-10 space-y-12">
                {EXPLORE_CATEGORIES.map((category, catIdx) => (
                    <section key={catIdx} className="space-y-6">
                        <div className="flex flex-col items-center gap-2">
                             <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${category.color}`}>
                                <category.icon size={20} />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 text-center">{category.title}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {category.items.map((item, itemIdx) => (
                                <motion.div
                                    key={itemIdx}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative group"
                                >
                                    <Link 
                                        href={item.href}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                                                <item.icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 leading-none">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Legal & Social Section */}
                <div className="pt-8 space-y-10 border-t border-white/5">
                    {/* Socials */}
                    <div className="flex justify-center gap-6">
                        {SOCIAL_LINKS.map((social, sIdx) => (
                            <Link 
                                key={sIdx} 
                                href={social.href}
                                className={`text-gray-500 transition-all duration-300 hover:scale-110 active:scale-90 ${social.color}`}
                            >
                                <social.icon size={20} />
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                            { label: "Refunds", href: "/refund-policy" }
                        ].map((link, lIdx) => (
                            <Link 
                                key={lIdx} 
                                href={link.href}
                                className="py-2 px-1 text-center bg-white/[0.02] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.25em]">
                            © {new Date().getFullYear()} Webory Technologies
                        </p>
                        <p className="text-[10px] text-gray-800 mt-1">Made with ❤️ in India</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
