"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Terminal, Cpu, Zap, Globe, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/auth/session-provider";

const features = [
    {
        icon: Terminal,
        title: "Multi-Language Support",
        description: "Practice Python, Java, C++, JavaScript, and more in a unified environment.",
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        icon: Zap,
        title: "Zero Setup Required",
        description: "No need to install compilers or IDEs. Start coding directly in your browser.",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10"
    },
    {
        icon: Globe,
        title: "Cloud-Based Execution",
        description: "Your code runs on our powerful servers. High performance, even on low-end devices.",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10"
    }
];

export function DevLabPreview() {
    const { user } = useAuth();
    const [codeStep, setCodeStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCodeStep((prev) => (prev >= 16 ? 0 : prev + 1));
        }, 500); // 500ms per step
        return () => clearInterval(interval);
    }, []);
    return (
        <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-[#04060e]">
            {/* Ambient Multi-Layer Lighting & Blueprint Grid */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none backdrop-blur-[1px]" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl xl:max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3 shadow-sm"
                        >
                            <Sparkles size={13} className="text-blue-400" />
                            <span>Stop Installing, Start Coding</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2.5 sm:mb-3 leading-tight tracking-tight will-change-transform will-change-opacity"
                        >
                            Experience the Power of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                                Webory DevLab
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className="text-gray-300 text-xs sm:text-sm mb-5 sm:mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                        >
                            The ultimate cloud-based coding playground. Build, test, and run your code instantly without the hassle of local environments.
                        </motion.p>

                        <div className="space-y-2.5 mb-6 text-left">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "100px" }}
                                    transition={{ delay: 0.2 + index * 0.08 }}
                                    className="flex items-start gap-3 will-change-transform will-change-opacity"
                                >
                                    <div className={`p-2 rounded-lg ${feature.bg} ${feature.color} flex-shrink-0 shadow-sm border border-white/5`}>
                                        <feature.icon size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xs sm:text-sm mb-0.5">{feature.title}</h4>
                                        <p className="text-gray-400 text-[11px] sm:text-xs leading-snug">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href={user ? "/playground" : "/login"} className="inline-block w-full sm:w-auto">
                                <Button size="default" className="w-full sm:w-auto h-11 px-6 sm:px-8 text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] group">
                                    Launch DevLab Now
                                    <Code2 size={16} className="ml-2 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Visual (Code Editor Mockup) */}
                    <div className="flex-1 w-full max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            {/* Editor Window */}
                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0B0F28]/90 backdrop-blur-2xl shadow-2xl relative z-10">
                                {/* Window Header */}
                                <div className="bg-white/5 border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                                        <span className="ml-2 text-[11px] text-gray-400 font-mono tracking-wide">weboryskills.py</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300 font-mono">
                                        <Cpu size={11} className="text-purple-400" />
                                        <span>Cloud Runtime</span>
                                    </div>
                                </div>
                                {/* Window Body */}
                                <div className="p-3.5 sm:p-5 bg-black/50 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto h-[230px] sm:h-[250px]">
                                    <pre className="text-gray-300">
                                        <div className={codeStep > 0 ? "opacity-100" : "opacity-0 transition-opacity"}><span className="text-purple-400">import</span> weboryskills <span className="text-purple-400">as</span> ws</div>
                                        <div className={codeStep > 1 ? "opacity-100 h-2.5" : "opacity-0 h-2.5 transition-opacity"}></div>
                                        <div className={codeStep > 2 ? "opacity-100" : "opacity-0 transition-opacity"}><span className="text-blue-400"># Start your journey</span></div>
                                        <div className={codeStep > 3 ? "opacity-100" : "opacity-0 transition-opacity"}>student = ws.<span className="text-yellow-400">Student</span>(<span className="text-emerald-400">"New User"</span>)</div>
                                        <div className={codeStep > 4 ? "opacity-100 h-2.5" : "opacity-0 h-2.5 transition-opacity"}></div>
                                        <div className={codeStep > 5 ? "opacity-100" : "opacity-0 transition-opacity"}><span className="text-purple-400">def</span> <span className="text-yellow-400">achieve_success</span>(student):</div>
                                        <div className={codeStep > 6 ? "opacity-100" : "opacity-0 transition-opacity"}>&nbsp;&nbsp;skills = ws.<span className="text-yellow-400">get_industry_skills</span>()</div>
                                        <div className={codeStep > 7 ? "opacity-100" : "opacity-0 transition-opacity"}>&nbsp;&nbsp;student.<span className="text-yellow-400">learn</span>(skills)</div>
                                        <div className={codeStep > 8 ? "opacity-100" : "opacity-0 transition-opacity"}>&nbsp;&nbsp;student.<span className="text-yellow-400">practice_in_devlab</span>()</div>
                                        <div className={codeStep > 9 ? "opacity-100" : "opacity-0 transition-opacity"}>&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-emerald-400">"Hired!"</span></div>
                                        <div className={codeStep > 10 ? "opacity-100 h-2.5" : "opacity-0 h-2.5 transition-opacity"}></div>
                                        <div className={codeStep > 11 ? "opacity-100" : "opacity-0 transition-opacity"}><span className="text-purple-400">print</span>(<span className="text-yellow-400">achieve_success</span>(student))</div>
                                    </pre>
                                </div>
                                {/* Terminal/Output Area */}
                                <div className="bg-black/90 border-t border-white/5 px-4 py-2 flex items-center gap-2.5 h-[40px]">
                                    {codeStep <= 11 && (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                            <div className="text-[11px] font-mono text-gray-500">Ready... <span className="animate-pulse text-gray-400">_</span></div>
                                        </>
                                    )}
                                    {codeStep === 12 && (
                                        <>
                                            <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                                            <div className="text-[11px] font-mono text-blue-400">Executing...</div>
                                        </>
                                    )}
                                    {codeStep >= 13 && (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <div className="text-[11px] font-mono text-emerald-400">Hired! <span className="animate-pulse">_</span></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-600/10 blur-[36px] rounded-full -z-10 pointer-events-none" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
