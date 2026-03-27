"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 px-4 md:px-8 z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <Rocket size={12} />
                        <span>Innovating Education</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Empowering the <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Next Generation</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                        We are bridging the gap between academic learning and industry demands. Join us to master the skills that define the future of technology.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/courses">
                            <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-100 font-bold transition-transform hover:scale-105">
                                Explore Courses
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" className="h-12 px-8 rounded-full border-white/10 text-white hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
                                Partner With Us
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 flex justify-center px-4">
                        <div className="inline-flex items-center space-x-2 bg-green-500/5 border border-green-500/20 rounded-full px-4 py-2 md:px-5 md:py-2.5 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:bg-green-500/10 transition-all cursor-default group max-w-full">
                            <span className="relative flex h-2.5 w-2.5 mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-gray-200 text-sm font-medium tracking-wide">
                                Recognized by <span className="text-white font-bold">Govt. of India</span> (MSME)
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
