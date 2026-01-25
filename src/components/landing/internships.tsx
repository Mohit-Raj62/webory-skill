"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";

export function Internships() {
    return (
        <section id="internships" className="py-24 relative overflow-hidden bg-slate-950/40">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="glass-card rounded-[2.5rem] p-8 md:p-14 text-center max-w-5xl mx-auto border border-white/5 bg-slate-900/20 backdrop-blur-3xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700">
                    
                    {/* Decorative Shine Effect */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                            <Zap size={12} className="fill-current" /> Career Accelerator
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white">
                            Launch Your Career with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                                Real-World Internships
                            </span>
                        </h2>
                        
                        <p className="text-lg text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                            Don't just learn—<span className="text-white font-medium italic">do</span>. Apply your skills in industrial projects, work directly with tech teams, and build a portfolio that stands out.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
                            {[
                                "Industry Certification",
                                "Real-world Projects",
                                "Mentorship Support",
                                "Flexible Timings",
                                "Stipend Opportunities",
                                "Recommendation Letters",
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 bg-white/5 hover:bg-white/[0.08] p-3.5 rounded-xl border border-white/5 transition-all duration-300">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="text-slate-300 font-bold text-sm tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/internships">
                                <Button size="lg" className="bg-white hover:bg-emerald-500 text-black hover:text-white px-10 py-7 h-auto rounded-xl font-black uppercase tracking-wider text-xs shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 group/btn">
                                    Apply Now <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1.5 transition-all" />
                                </Button>
                            </Link>
                            <span className="text-xs text-slate-500 font-medium">
                                <span className="text-emerald-500 animate-pulse mr-1.5">●</span>
                                Limited slots for Q1 Batch
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
