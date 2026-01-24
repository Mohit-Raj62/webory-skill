"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Internships() {
    return (
        <section id="internships" className="py-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="glass-card rounded-[2rem] p-8 md:p-16 text-center max-w-6xl mx-auto border border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
                    
                    {/* Decorative Shine Effect */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 uppercase tracking-wider">
                            Career Accelerator
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Launch Your Career with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Real Internships
                            </span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Don't just learn—<span className="text-white font-bold">do</span>. Apply your skills in real-world projects, work directly with the Webory team, and build a portfolio that stands out.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                            {[
                                "Guaranteed Certification",
                                "Real-world Projects",
                                "Mentorship Support",
                                "Flexible Timings",
                                "Performance Based Stipend",
                                "Letter of Recommendation",
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-colors duration-300">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-gray-200 font-medium text-left">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/internships">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-10 py-7 h-auto rounded-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300">
                                Apply for Internships Now
                            </Button>
                        </Link>
                        <p className="mt-6 text-sm text-gray-500">
                            Limited slots available for this batch.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
