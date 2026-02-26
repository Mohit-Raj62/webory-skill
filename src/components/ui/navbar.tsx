"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X, User, Code2, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useAuth } from "@/components/auth/session-provider";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const { user } = useAuth();

    const [announcement, setAnnouncement] = useState({ enabled: false, text: "" });

    useEffect(() => {
        let mounted = true;
        // Fetch global settings
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

    return (
        <>
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl transition-all duration-300">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="font-black text-xl text-white">W</span>
                        </div>
                        <span className="text-base sm:text-lg xl:text-xl font-bold">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">WEBORY </span>
                            <span className="relative">
                                <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                </span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">SKILLS</span>
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
                        {/* <Link href="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">
                            Features
                        </Link> */}
                        <Link href="/courses" className="group relative text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                            Courses
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[9px] font-black bg-emerald-500 text-black px-1.5 py-0.5 rounded leading-none">Free</span>
                        </Link>
                        <Link href="/internships" className="text-sm text-gray-300 hover:text-white transition-colors">
                            Internships
                        </Link>
                        {user && (
                            <Link href="/playground" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                                <Code2 size={16} />
                                <span>Webory DevLab</span>
                            </Link>
                        )}

                        {user && (
                            <Link href="/ai-weboryskills" className="text-sm text-gray-300 hover:text-white transition-colors">
                                Weboryskills AI
                            </Link>
                        )}

                        {user && (
                            <Link href="/ai-prep" className="text-sm text-gray-300 hover:text-white transition-colors">
                                Webory AI Nexus
                            </Link>
                        )}

                        {user && (
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Feedback
                            </button>
                        )}

                        {user ? (
                            <Link href={user.role === 'admin' ? "/admin" : "/profile"}>
                                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs border border-blue-500/50">
                                        {user.firstName[0]}
                                    </div>
                                    {user.firstName}
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden text-gray-300 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="xl:hidden absolute top-16 left-0 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 p-4"
                    >
                        <div className="flex flex-col space-y-4">
                            <Link href="/#features" className="text-sm text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                Features
                            </Link>
                            <Link href="/courses" className="text-sm text-gray-300 hover:text-white flex items-center justify-between" onClick={() => setIsOpen(false)}>
                                <span>Courses</span>
                                <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded">FREE TRIAL</span>
                            </Link>
                            <Link href="/internships" className="text-sm text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                Internships
                            </Link>
                            {user && (
                                <Link href="/playground" className="text-sm text-gray-300 hover:text-white flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <Code2 size={16} />
                                    Webory DevLab
                                </Link>
                            )}

                            {user && (
                                <Link href="/ai-weboryskills" className="text-sm text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                    Weboryskills AI
                                </Link>
                            )}

                             {user && (
                                <Link href="/ai-prep" className="text-sm text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                    Webory AI Nexus
                                </Link>
                            )}

                            {user && (
                                <button
                                    onClick={() => {
                                        setIsFeedbackOpen(true);
                                        setIsOpen(false);
                                    }}
                                    className="text-sm text-gray-300 hover:text-white text-left"
                                >
                                    Feedback
                                </button>
                            )}

                            <div className="pt-4 flex flex-col space-y-2">
                                {user ? (
                                    <Link href={user.role === 'admin' ? "/admin" : "/profile"} onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-gray-300">
                                            <User className="mr-2 h-4 w-4" /> {user.role === 'admin' ? 'Admin Panel' : 'Profile'} ({user.firstName})
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start text-gray-300">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                                            <Button variant="default" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>

            {/* High Visibility Notification Bar (Dynamic) - Below Navbar */}
            {announcement.enabled && (
                <div className="fixed top-16 w-full z-[40] bg-black/40 backdrop-blur-md border-b border-white/5 py-1.5 overflow-hidden">
                    <motion.div 
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-12 whitespace-nowrap"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <span key={i} className="text-[10px] md:text-xs font-medium text-gray-300 uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded italic font-bold">New Update</span>
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
