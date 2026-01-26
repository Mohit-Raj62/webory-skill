"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, Cpu, Zap, Globe, Sparkles } from "lucide-react";
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
    return (
        <section className="py-24 relative overflow-hidden bg-black">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
                        >
                            <Sparkles size={16} />
                            <span>Stop Installing, Start Coding</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
                        >
                            Experience the Power of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
                                Webory DevLab
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 text-lg mb-10 max-w-xl mx-auto lg:mx-0"
                        >
                            The ultimate cloud-based coding playground. Build, test, and run your code instantly without the hassle of local environments.
                        </motion.p>

                        <div className="space-y-6 mb-10">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className={`p-3 rounded-xl ${feature.bg} ${feature.color} flex-shrink-0`}>
                                        <feature.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link href={user ? "/playground" : "/login"}>
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-blue-500/20 group">
                                    Launch DevLab Now
                                    <Code2 className="ml-2 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Visual (Code Editor Mockup) */}
                    <div className="flex-1 w-full max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                        >
                            {/* Editor Window */}
                            <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
                                {/* Window Header */}
                                <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono">webory-skills.py</div>
                                    <div className="w-12" />
                                </div>
                                {/* Window Body */}
                                <div className="p-8 bg-black/40 font-mono text-sm leading-relaxed overflow-hidden">
                                    <pre className="text-gray-300">
                                        <span className="text-purple-400">import</span> webory_skills <span className="text-purple-400">as</span> ws<br /><br />
                                        <span className="text-blue-400"># Start your journey</span><br />
                                        student = ws.<span className="text-yellow-400">Student</span>(<span className="text-emerald-400">"New User"</span>)<br /><br />
                                        <span className="text-purple-400">def</span> <span className="text-yellow-400">achieve_success</span>(student):<br />
                                        &nbsp;&nbsp;skills = ws.<span className="text-yellow-400">get_industry_skills</span>()<br />
                                        &nbsp;&nbsp;student.<span className="text-yellow-400">learn</span>(skills)<br />
                                        &nbsp;&nbsp;student.<span className="text-yellow-400">practice_in_devlab</span>()<br />
                                        &nbsp;&nbsp;<span className="text-purple-400">return</span> student.<span className="text-emerald-400">"Hired!"</span><br /><br />
                                        <span className="text-purple-400">print</span>(<span className="text-yellow-400">achieve_success</span>(student))
                                    </pre>
                                </div>
                                {/* Terminal/Output Area */}
                                <div className="bg-black border-t border-white/5 p-4 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <div className="text-xs font-mono text-emerald-400">Hired! _</div>
                                </div>
                            </div>

                            {/* Floating Icons */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl z-20"
                            >
                                <Cpu size={32} />
                            </motion.div>
                            
                            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-blue-600/10 blur-[60px] rounded-full -z-10" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
