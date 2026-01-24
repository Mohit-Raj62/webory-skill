"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle, Lightbulb, UserCircle, Rocket, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";

const steps = [
    {
        icon: UserCircle,
        title: "Step 1: Career Goal Input",
        description: "Select your goal (Web Dev, AI, etc.) and current level. We adapt to you.",
        details: ["Web Developer", "AI / Data", "Beginner/Intermediate"],
    },
    {
        icon: Brain,
        title: "Step 2: AI Roadmap Generation",
        description: "We automatically create a skill sequence, weekly plan, and project timeline.",
        details: ["Skill sequence", "Weekly plan", "Projects timeline"],
        highlight: "Every student gets a different roadmap.",
    },
    {
        icon: Lightbulb,
        title: "Step 3: Learning + Projects",
        description: "Follow structured lessons and hands-on assignments. No just watching.",
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
        title: "Step 5: Career Readiness",
        description: "Gain practical skills, a project portfolio, and job readiness support.",
        details: ["Practical skills", "Project portfolio", "Job readiness"],
    },
];

const differentiators = [
    "No random course suggestions",
    "Roadmap adapts as student progresses",
    "Focus on outcomes, not hours watched",
    "Works like a career guide, not a chatbot",
];

export function AIRoadmapFlow() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Mentor & Learning Roadmap</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 font-medium"
                    >
                        Not a generic course list. A personalized path built around your career goal.
                    </motion.p>
                </div>

                {/* Steps Flow */}
                <div className="relative mb-24">
                     {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-purple-500/0 z-0 border-t border-dashed border-white/20" />

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
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative z-10 group"
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

                {/* Differentiators & CTA */}
                {/* Differentiators & CTA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="relative">
                            <div className="absolute -left-6 -top-6 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white relative z-10">
                                What Makes This <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Different?</span>
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {differentiators.map((item, index) => (
                                <div key={index} className="flex flex-col gap-3 bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="text-gray-200 text-sm font-semibold leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative text-center lg:text-left bg-black/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 overflow-hidden group hover:border-white/20 transition-all">
                             <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
                             </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
                                <Sparkles size={12} /> AI-Powered Career Engine
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
                                Webory Skills uses AI to design a <span className="text-blue-400">personalized learning roadmap</span> for every student, guiding them from skill selection to <span className="text-purple-400">real-world project execution</span>.
                            </h3>
                            
                            <div className="flex flex-col items-center lg:items-start gap-4 mt-8">
                                 <Button 
                                    onClick={() => router.push(user ? '/ai-weboryskills' : '/signup')} 
                                    size="lg" 
                                    className="w-full sm:w-auto bg-gradient-to-r from-white to-gray-200 text-black hover:bg-white text-lg h-14 px-8 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all font-bold"
                                >
                                    Get Your Personalized AI Roadmap <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Takes less than 2 minutes
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
