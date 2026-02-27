"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Code2, Sparkles, MessageSquare, GraduationCap, Briefcase, BrainCircuit, Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useAuth } from "@/components/auth/session-provider";

const NavLink = ({ href, children, onClick, badge, icon: Icon }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    badge?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
}) => (
    <Link
        href={href}
        onClick={onClick}
        className="group relative lg:text-xs xl:text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1 xl:gap-1.5 py-1.5 px-1 xl:px-2"
    >
        {Icon && <Icon size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />}
        <span>{children}</span>
        {badge && (
            <span className="relative flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full leading-none tracking-wide">
                    {badge}
                </span>
            </span>
        )}
        <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 group-hover:w-full" />
    </Link>
);

const MobileNavLink = ({ href, children, onClick, badge, icon: Icon, index }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    badge?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
    >
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center justify-between py-3 px-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
        >
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                        <Icon size={15} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                )}
                <span className="text-sm font-medium">{children}</span>
            </div>
            {badge && (
                <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </Link>
    </motion.div>
);

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();

    const [announcement, setAnnouncement] = useState({ enabled: false, text: "" });

    useEffect(() => {
        let mounted = true;
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (mounted && data.announcementBar) {
                    setAnnouncement(data.announcementBar);
                }
            })
            .catch(err => console.error("Failed to fetch settings", err));

        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                    scrolled
                        ? "bg-black/70 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-black/20"
                        : "bg-black/20 backdrop-blur-xl border-b border-white/[0.04]"
                }`}
            >
                {/* Subtle top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-9 h-9 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300"
                        >
                            <span className="font-black text-lg text-white">W</span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>
                        <span className="text-base sm:text-lg xl:text-xl font-bold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400">WEBORY </span>
                            <span className="relative">
                                <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                </span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 font-extrabold">SKILLS</span>
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-0.5 xl:gap-2">
                        <NavLink href="/courses" icon={GraduationCap} badge="Free">Courses</NavLink>
                        <NavLink href="/internships" icon={Briefcase}>Internships</NavLink>

                        {user && <NavLink href="/playground" icon={Code2}>DevLab</NavLink>}
                        {user && <NavLink href="/ai-weboryskills" icon={Bot}>Weboryskills AI</NavLink>}
                        {user && <NavLink href="/ai-prep" icon={BrainCircuit}>AI Nexus</NavLink>}

                        {user && (
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="group relative lg:text-xs xl:text-sm text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-1 xl:gap-1.5 py-1.5 px-1 xl:px-2"
                            >
                                <MessageSquare size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span>Feedback</span>
                                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 group-hover:w-full" />
                            </button>
                        )}

                        <div className="w-px h-6 bg-white/10 mx-2" />

                        {user ? (
                            <Link href={user.role === 'admin' ? "/admin" : "/profile"}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-2 xl:px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] xl:text-xs font-bold text-white shadow-inner">
                                        {user.firstName[0]}
                                    </div>
                                    <span className="text-xs xl:text-sm font-medium text-gray-200">{user.firstName}</span>
                                </motion.div>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-300">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
                                        >
                                            <Sparkles size={14} className="mr-1" />
                                            Get Started
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-all"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Menu size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="bg-black/90 backdrop-blur-2xl border-t border-white/[0.06] px-4 py-4 space-y-1">
                                <MobileNavLink href="/courses" icon={GraduationCap} badge="FREE" onClick={() => setIsOpen(false)} index={0}>
                                    Courses
                                </MobileNavLink>
                                <MobileNavLink href="/internships" icon={Briefcase} onClick={() => setIsOpen(false)} index={1}>
                                    Internships
                                </MobileNavLink>

                                {user && (
                                    <MobileNavLink href="/playground" icon={Code2} onClick={() => setIsOpen(false)} index={2}>
                                        Webory DevLab
                                    </MobileNavLink>
                                )}
                                {user && (
                                    <MobileNavLink href="/ai-weboryskills" icon={Bot} onClick={() => setIsOpen(false)} index={3}>
                                        Weboryskills AI
                                    </MobileNavLink>
                                )}
                                {user && (
                                    <MobileNavLink href="/ai-prep" icon={BrainCircuit} onClick={() => setIsOpen(false)} index={4}>
                                        Webory AI Nexus
                                    </MobileNavLink>
                                )}

                                {user && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25, duration: 0.3 }}
                                    >
                                        <button
                                            onClick={() => { setIsFeedbackOpen(true); setIsOpen(false); }}
                                            className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                                                <MessageSquare size={15} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <span className="text-sm font-medium">Feedback</span>
                                        </button>
                                    </motion.div>
                                )}

                                {/* Divider */}
                                <div className="my-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                {/* Auth Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.3 }}
                                    className="space-y-2"
                                >
                                    {user ? (
                                        <Link href={user.role === 'admin' ? "/admin" : "/profile"} onClick={() => setIsOpen(false)}>
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-blue-500/30 transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                    {user.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{user.firstName}</p>
                                                    <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Admin Panel' : 'View Profile'}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1">
                                                <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl border border-white/[0.08]">
                                                    Log In
                                                </Button>
                                            </Link>
                                            <Link href="/signup" onClick={() => setIsOpen(false)} className="flex-1">
                                                <Button variant="default" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-xl shadow-lg shadow-blue-500/20 font-semibold">
                                                    <Sparkles size={14} className="mr-1" />
                                                    Get Started
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Announcement Bar */}
            {announcement.enabled && (
                <div className="fixed top-16 w-full z-[40] bg-black/50 backdrop-blur-md border-b border-white/[0.05] py-1.5 overflow-hidden">
                    <motion.div
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-12 whitespace-nowrap"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <span key={i} className="text-[10px] md:text-xs font-medium text-gray-300 uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full italic font-bold text-[10px]">New Update</span>
                                {announcement.text}
                            </span>
                        ))}
                    </motion.div>
                </div>
            )}

            <FeedbackForm isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </>
    );
}
