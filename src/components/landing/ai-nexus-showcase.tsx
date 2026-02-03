"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, BrainCircuit, Mic } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function AINexusShowcase() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="glass-card rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-12 items-center p-8 md:p-16">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                                <BrainCircuit className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-semibold text-blue-300 tracking-wide uppercase">Introducing</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                Webory <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Nexus</span>
                            </h2>
                            
                            <p className="text-lg text-gray-300 leading-relaxed">
                                Experience the future of career preparation. Our advanced AI mentor simulates real-world interviews and aptitude tests, providing instant, personalized feedback to help you land your dream job.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Bot className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Mock Interviews</div>
                                        <div className="text-xs text-gray-400">Technical & HR Roles</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <BrainCircuit className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Aptitude Tests</div>
                                        <div className="text-xs text-gray-400">Logical & Quantitative</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link href="/ai-prep">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg shadow-blue-500/25 rounded-xl group transition-all duration-300 hover:scale-[1.02]">
                                        Start Your Practice <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Image Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                <Image 
                                    src="/ai-nexus-preview.png" 
                                    alt="Webory AI Nexus Dashboard" 
                                    width={600} 
                                    height={400}
                                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                                />
                                
                                {/* Overlay UI Elements */}
                                <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                                    <div>
                                        <div className="text-sm font-medium text-blue-400 mb-1">AI Confidence Score</div>
                                        <div className="text-3xl font-bold text-white">92%</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-gray-400 font-mono">SYSTEM ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
