"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Code, Rocket, Users, BookOpen, PlayCircle, Zap } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import dynamic from "next/dynamic";

const ParticleNetwork = dynamic(() => import("@/components/ui/particle-network").then(mod => mod.ParticleNetwork), { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black/20" /> 
});
const BackgroundCodeAnimation = dynamic(() => import("@/components/ui/background-code-animation").then(mod => mod.BackgroundCodeAnimation), { 
    ssr: false 
});

interface HeroProps {
    initialUserCount?: number;
    initialInternshipCount?: number;
    initialCourseCount?: number;
}

// Shatter/Explosion Effect Component
function ShatterCard({ icon: Icon, label, value, index }: { icon: any, label: string, value: string, index: number }) {
    // Generate random shards with more variety
    const [shards, setShards] = useState<any[]>([]);

    useEffect(() => {
        const generatedShards = Array.from({ length: 42 }).map((_, i) => {
            const shapes = [
                "polygon(50% 0%, 0% 100%, 100% 100%)",
                "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                "polygon(0 0, 100% 0, 100% 100%)",
                "polygon(0 0, 100% 100%, 0 100%)",
                "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
            ];
            
            return {
                id: i,
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() * 300) + 50,
                rotate: (Math.random() - 0.5) * 1080,
                scale: Math.random() * 0.8 + 0.2,
                duration: Math.random() * 1.5 + 1.2,
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 20 + 10,
            };
        });
        setShards(generatedShards);
    }, []);

    return (
        <motion.div
            className="relative w-full h-full min-h-[140px] md:min-h-[160px] perspective-1000 group cursor-pointer"
            initial="initial"
            whileHover="hover"
            whileTap="hover"
            animate="initial"
        >
            {/* The Shards (Hidden initially, visible on hover) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {shards.map((shard) => (
                    <motion.div
                        key={shard.id}
                        className="absolute bg-gradient-to-bl from-white/40 to-white/5 backdrop-blur-md border-[0.5px] border-white/60 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        style={{
                            left: `${shard.left}%`,
                            top: `${shard.top}%`,
                            width: `${shard.size}%`,
                            height: `${shard.size}%`,
                            clipPath: shard.shape,
                            transformOrigin: "center center",
                        }}
                        variants={{
                            initial: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }, // Hidden initially
                            hover: { 
                                x: shard.x, 
                                y: shard.y, 
                                rotate: shard.rotate, 
                                scale: 0, 
                                opacity: [1, 1, 0], // Flash visible then fade
                                transition: { 
                                    duration: shard.duration, 
                                    ease: "easeOut",
                                    times: [0, 0.5, 1]
                                } 
                            }
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <motion.div 
                className="relative z-10 glass-card p-4 md:p-6 rounded-2xl text-center border border-white/5 h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl group-hover:bg-transparent transition-colors"
                variants={{
                    initial: { opacity: 1, scale: 1 },
                    hover: { 
                        opacity: 0, 
                        scale: 1.05,
                        transition: { duration: 0.1 } 
                    } 
                }}
            >
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-3 md:mb-4 text-blue-400 border border-white/10 group-hover:text-white/50 transition-colors">
                    <Icon className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-white/50">{value}</h3>
                <p className="text-gray-400 font-medium text-xs md:text-sm">{label}</p>
            </motion.div>


        </motion.div>
    );
}

export function Hero({ initialUserCount = 10, initialInternshipCount = 12, initialCourseCount = 5 }: HeroProps) {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const activeStudents = initialUserCount > 0 ? `${initialUserCount}+` : "10+";
    const launchedInternships = initialInternshipCount > 0 ? `${initialInternshipCount}+` : "12+";
    const availableCourses = initialCourseCount > 0 ? `${initialCourseCount}+` : "5+";

    return (
        <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>
            
            {/* Interactive Particle Network */}
            <ParticleNetwork />
            <BackgroundCodeAnimation />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col items-center gap-3 mb-8 md:mb-12">
                            {/* Primary Trust Signal */}
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl backdrop-blur-md"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase whitespace-nowrap">
                                        Govt. Recognized
                                    </span>
                                </div>
                                <div className="w-px h-3 bg-white/10" />
                                <span className="text-gray-400 text-[9px] md:text-[10px] font-mono opacity-80 whitespace-nowrap">
                                    UDYAM-BR-26-0208472
                                </span>
                            </motion.div>

                            {/* Main Title Area */}
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-block py-1 px-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] md:text-[10px] font-bold text-blue-300 uppercase tracking-widest"
                            >
                                🚀 The Future of Practical Learning
                            </motion.span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold mb-6 md:mb-8 tracking-tight leading-[1.1] drop-shadow-2xl text-white">
                            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 animate-gradient-x">Skill</span> Platform
                            <br />
                            <span className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-300 block mt-2">
                                for <span className="text-white border-b-4 border-purple-500/50">Industry-Ready</span> Careers
                            </span>
                        </h1>
                        
                        <p className="text-base sm:text-lg md:text-2xl text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light px-4">
                            Personalized AI roadmaps, hands-on projects, and industry mentorship. 
                            Build your <span className="text-white font-medium">high-income career</span> with Webory.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-6 mt-8 md:mt-12">
                            {/* The "Eye-Catcher" Component (High Visibility Emerald) */}
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }} 
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                className="relative flex items-center gap-3 md:gap-4 bg-white text-black px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.15)] md:shadow-[0_20px_50px_rgba(255,255,255,0.2)] border-2 border-emerald-400/50 -rotate-2 hover:rotate-0 transition-transform cursor-default max-w-[90vw]"
                            >
                                <div className="absolute -top-3 -right-3 w-6 h-6 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg z-20">
                                    <span className="text-[8px] md:text-[10px] font-black text-white italic">HOT</span>
                                </div>
                                <div className="p-1.5 md:p-2 bg-emerald-500 rounded-lg md:rounded-xl text-white flex-shrink-0">
                                    <Rocket className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-600 leading-none mb-0.5 md:mb-1">Unmissable Value</p>
                                    <h4 className="text-sm md:text-lg font-black leading-none whitespace-nowrap">Watch Module 1 <span className="text-emerald-500">FREE</span></h4>
                                </div>
                            </motion.div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full justify-center px-4">
                                {!isLoggedIn ? (
                                    <Link href="/signup" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-base md:text-lg h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.6)] hover:-translate-y-1 transition-all duration-300 font-bold">
                                            Get Your AI Roadmap <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/ai-weboryskills" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-base md:text-lg h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.6)] hover:-translate-y-1 transition-all duration-300 font-bold">
                                            Get Your AI Roadmap <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/courses" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full text-base md:text-lg h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-white/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 backdrop-blur-md font-bold">
                                        Browse Courses
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 2, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 px-2"
                    >
                        {[
                            { icon: Users, label: "Active Students", value: activeStudents },
                            { icon: BookOpen, label: "Courses Available", value: availableCourses },
                            { icon: Code, label: "Projects Completed", value: "50+" },
                            { icon: Rocket, label: "Internships Launched", value: launchedInternships },
                        ].map((stat, index) => (
                            <ShatterCard key={index} {...stat} index={index} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
