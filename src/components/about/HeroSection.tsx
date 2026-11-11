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
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Empowering the <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Next Generation of Engineers</span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                        Bridging the gap between university engineering curriculums and modern industry demands with hands-on, production-grade training.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/courses">
                            <Button className="h-11 px-7 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-semibold transition-colors">
                                Explore Courses
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" className="h-11 px-7 rounded-xl border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                                Partner With Us
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-10 flex justify-center px-4">
                        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Recognized EdTech Venture • <strong className="text-white">Govt. of India (MSME)</strong></span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
