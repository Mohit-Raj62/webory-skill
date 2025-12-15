"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X, User, Code2 } from "lucide-react";
import { useState } from "react";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useAuth } from "@/components/auth/session-provider";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const { user } = useAuth();

    return (
        <>
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">W</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            WEBORY <span className="text-white">SKILL's</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="/courses" className="text-sm text-gray-300 hover:text-white transition-colors">
                            Courses
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
                                        Log in
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
                        className="md:hidden text-gray-300 hover:text-white"
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
                        className="md:hidden absolute top-16 left-0 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 p-4"
                    >
                        <div className="flex flex-col space-y-4">
                            <Link href="/#features" className="text-sm text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                Features
                            </Link>
                            <Link href="/courses" className="text-sm text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
                                Courses
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
                                                Log in
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

            <FeedbackForm isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </>
    );
}
