"use client";

import { motion } from "framer-motion";
import { Users, Shield, Linkedin, Instagram, Github } from "lucide-react";
import Link from "next/link";

export function LeadershipSection() {
    return (
        <section className="py-24 px-4 md:px-8 relative z-10 border-t border-white/5 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <Users size={12} />
                        <span>Leadership</span>
                    </motion.div>
                    <motion.h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Founder</span>
                    </motion.h2>
                </div>
                
                <div className="max-w-6xl mx-auto glass-card rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl relative overflow-hidden shadow-2xl group/card">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>
                    
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 p-8 md:p-12 lg:p-16 text-center lg:text-left">
                        <motion.div className="relative flex-shrink-0 group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] blur-2xl opacity-30"></div>
                            <div className="w-56 h-56 md:w-80 md:h-80 rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#111] flex flex-col items-center justify-center relative z-10 shadow-2xl">
                                <span className="text-gray-200 text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">🧑🏻‍🏫</span>
                            </div>
                            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 p-3 md:p-5 text-left rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4 z-30">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 font-medium">Verified</div>
                                    <div className="text-base font-bold text-white leading-none">MSME Leader</div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <div className="flex-1 relative z-10">
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight">Mohit Sinha</h3>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-xl md:text-2xl mb-8">Founder & CEO, Webory Skills</p>
                            
                            <blockquote className="relative my-8 px-6 py-4 border-l-4 border-blue-500/50 bg-white/[0.02] text-left">
                                <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic font-serif">
                                    "Education is not just about learning facts, but training the mind to think and build. We are here to bridge the gap between academic learning and industry demands."
                                </p>
                            </blockquote>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <Link href="https://www.linkedin.com/in/mohit0sinha" target="_blank" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 shadow-lg">
                                    <Linkedin size={20} />
                                </Link>
                                <Link href="https://github.com/Mohit-Raj62" target="_blank" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300 shadow-lg">
                                    <Github size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
