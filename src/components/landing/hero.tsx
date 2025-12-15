"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Rocket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/session-provider";

export function Hero() {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const [activeStudents, setActiveStudents] = useState("10+");

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const res = await fetch("/api/stats/users");
                if (res.ok) {
                    const data = await res.json();
                    if (data.totalUsers) {
                        setActiveStudents(data.totalUsers > 0 ? `${data.totalUsers}+` : "10+");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
                // Keep default "10+" on error
            }
        };
        fetchUserStats();
    }, []);

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-6 backdrop-blur-sm">
                            🚀 Launching the Future of EdTech
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Master Skills. <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Build Your Future.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                            The ultimate platform for students to learn real-world skills, complete internships, and launch their careers. Join the Webory revolution today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {!isLoggedIn ? (
                                <Link href="/signup">
                                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-lg h-12 px-8">
                                        Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/profile">
                                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-lg h-12 px-8">
                                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                            <Link href="/internships">
                                <Button size="lg" variant="glass" className="w-full sm:w-auto text-lg h-12 px-8">
                                    View Internships
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 2, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: Users, label: "Active Students", value: activeStudents },
                            { icon: Code, label: "Projects Completed", value: "50+" },
                            { icon: Rocket, label: "Internships Launched", value: "12+" },
                        ].map((stat, index) => (
                            <div key={index} className="glass-card p-6 rounded-2xl text-center">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-400">
                                    <stat.icon size={24} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
