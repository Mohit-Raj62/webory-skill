"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Lightbulb, UserCircle, Rocket, BarChart, Sparkles } from "lucide-react";

const steps = [
    {
        icon: UserCircle,
        title: "Step 1: Choose Your Career Goal",
        description: "Select your goal (Web Dev, AI, etc.) and current level. We adapt to you.",
        details: ["Web Developer", "AI / Data", "Beginner/Intermediate"],
    },
    {
        icon: Brain,
        title: "Step 2: AI Roadmap Generator",
        description: "We automatically create a learning path, weekly plan, and project timeline.",
        details: ["Learning path", "Weekly plan", "Projects timeline"],
        highlight: "Every student gets a personalized roadmap.",
    },
    {
        icon: Lightbulb,
        title: "Step 3: Learning + Projects",
        description: "Follow structured lessons and hands-on assignments-not just watching.",
        details: ["Structured lessons", "Hands-on assignments", "Real-world projects"],
    },
    {
        icon: BarChart,
        title: "Step 4: AI Mentor Guidance",
        description: "Your AI mentor tracks progress, suggests next steps, and highlights gaps.",
        details: ["Tracks progress", "Suggests next steps", "Highlights gaps"],
    },
    {
        icon: Rocket,
        title: "Step 5: Job Readiness",
        description: "Gain practical skills, a project portfolio, and job readiness support.",
        details: ["Practical skills", "Project portfolio", "Job readiness"],
    },
];

export function AIRoadmapFlow() {

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        AI Generating Route...
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-6"
                    >
                        AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Learning Roadmap & Mentorship</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sm sm:text-xl text-gray-300 font-medium"
                    >
                        Not Just another course list. A personalized path built around your career goal.
                    </motion.p>
                </div>

                {/* Steps Flow */}
                <div className="relative mb-24">
                     {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-white/5 z-0 overflow-hidden rounded-full">
                        <motion.div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ duration: 4, ease: "linear" }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {steps.map((step, index) => {
                             // Dynamic gradients based on index
                             const gradients = [
                                 "from-blue-500 to-cyan-500",
                                 "from-cyan-500 to-teal-500",
                                 "from-teal-500 to-green-500",
                                 "from-green-500 to-indigo-500",
                                 "from-indigo-500 to-purple-500"
                             ];
                             const currentGradient = gradients[index % gradients.length];
                             
                             return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30, filter: "grayscale(100%)" }}
                                    whileInView={{ opacity: 1, y: 0, filter: "grayscale(0%)" }}
                                    viewport={{ once: true, margin: "100px" }}
                                    transition={{ delay: index * 0.8, duration: 0.5 }}
                                    className="relative z-10 group will-change-transform will-change-opacity"
                                >
                                    <div className="glass-card p-6 rounded-3xl border border-white/5 h-full bg-gradient-to-b from-white/5 to-black/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
                                        
                                        {/* Giant Watermark Number */}
                                        <div className="absolute -right-4 -top-8 text-[120px] font-bold text-white/[0.03] select-none pointer-events-none leading-none z-0">
                                            {index + 1}
                                        </div>

                                        {/* Flow Arrow (except last item) */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-white/20">
                                                <ArrowRight size={16} />
                                            </div>
                                        )}

                                        <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${currentGradient} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <step.icon size={26} />
                                        </div>
                                        
                                        <h3 className="relative z-10 text-lg font-bold text-white mb-3 leading-tight">{step.title.split(":")[1] || step.title}</h3>
                                        <p className="relative z-10 text-sm text-gray-400 mb-5 leading-relaxed min-h-[60px]">{step.description}</p>
                                        
                                        {step.highlight && (
                                            <div className="relative z-10 mb-4 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300 font-semibold flex items-center gap-2">
                                                <Sparkles size={12} /> {step.highlight}
                                            </div>
                                        )}

                                        <div className="relative z-10 space-y-2 pt-4 border-t border-white/5">
                                            {step.details.map((detail, idx) => (
                                                <div key={idx} className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentGradient} mr-2`} />
                                                    {detail}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
