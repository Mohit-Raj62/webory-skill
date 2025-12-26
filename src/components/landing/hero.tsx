"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Code, Rocket, Users } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import { ParticleNetwork } from "@/components/ui/particle-network";
import { BackgroundCodeAnimation } from "@/components/ui/background-code-animation";

interface HeroProps {
    initialUserCount?: number;
}

// Shatter/Explosion Effect Component
function ShatterCard({ icon: Icon, label, value, index }: { icon: any, label: string, value: string, index: number }) {
    // Generate random shards with more variety
    const shards = Array.from({ length: 42 }).map((_, i) => {
         // Random irregular polygon shapes
        const shapes = [
            "polygon(50% 0%, 0% 100%, 100% 100%)", // Triangle
            "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", // Trapezoid
            "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)", // Pentagon ish
            "polygon(0 0, 100% 0, 100% 100%)", // Corner Triangle
            "polygon(0 0, 100% 100%, 0 100%)", // Corner Triangle 2
             "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" // Parallelogram
        ];
        
        return {
            id: i,
            x: (Math.random() - 0.5) * 400, // Explode wider
            y: (Math.random() * 300) + 50,  // Fall further
            rotate: (Math.random() - 0.5) * 1080, // Spin crazy fast
            scale: Math.random() * 0.8 + 0.2,
            duration: Math.random() * 1.5 + 1.2, // Slower: 1.2s - 2.7s
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            // Random start positions to break the grid
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 20 + 10,
        };
    });

    return (
        <motion.div
            className="relative w-full h-full min-h-[160px] perspective-1000 group cursor-pointer"
            initial="initial"
            whileHover="hover"
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
                className="relative z-10 glass-card p-6 rounded-2xl text-center border border-white/5 h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl group-hover:bg-transparent transition-colors"
                variants={{
                    initial: { opacity: 1, scale: 1 },
                    hover: { 
                        opacity: 0, 
                        scale: 1.05,
                        transition: { duration: 0.1 } 
                    } 
                }}
            >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-blue-400 border border-white/10 group-hover:text-white/50 transition-colors">
                    <Icon size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-white/50">{value}</h3>
                <p className="text-gray-400 font-medium text-sm">{label}</p>
            </motion.div>

            {/* Re-assemble Hint */}
            <motion.div
                 className="absolute -bottom-8 left-0 right-0 text-center text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity delay-300"
            >
                Restore
            </motion.div>
        </motion.div>
    );
}

export function Hero({ initialUserCount = 10 }: HeroProps) {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const activeStudents = initialUserCount > 0 ? `${initialUserCount}+` : "10+";

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
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
                            <ShatterCard key={index} {...stat} index={index} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
