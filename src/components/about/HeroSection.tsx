"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 px-3 sm:px-6 md:px-8 z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
                        <Rocket size={12} />
                        <span>Innovating Education</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-2">
                        Empowering the <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Next Generation of Engineers</span>
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                        Bridging the gap between university engineering curriculums and modern industry demands with hands-on, production-grade training.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-xs sm:max-w-none mx-auto">
                        <Link href="/courses" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto h-11 px-7 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-semibold transition-colors active:scale-95 shadow-lg shadow-blue-600/20">
                                Explore Courses
                            </Button>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full sm:w-auto h-11 px-7 rounded-xl border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors active:scale-95">
                                Partner With Us
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8 sm:mt-10 flex justify-center px-2">
                        <div className="inline-flex flex-wrap items-center justify-center text-center gap-1.5 sm:gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs text-slate-300 max-w-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>Recognized EdTech Venture • <strong className="text-white">Govt. of India (MSME)</strong></span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
