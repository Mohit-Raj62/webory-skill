"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageSquare, Sparkles } from "lucide-react";

const WordReveal = ({ text }: { text: string }) => {
    const words = text.split(" ");
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.03, delayChildren: 0.1 }
                }
            }}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap"
        >
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    variants={{
                        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                    }}
                    className="mr-1.5"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const faqs = [
    {
        question: "What exactly does WeborySkills offer?",
        answer: "WeborySkills is a complete career ecosystem. We provide AI-generated personalized learning roadmaps, premium video courses, real-world verified projects, and guaranteed internship opportunities to launch your tech career."
    },
    {
        question: "How does the 'AI Roadmap' work?",
        answer: "Our advanced AI analyzes your current skills and career goals to generate a custom step-by-step learning path. It tells you exactly what to learn, which resources to use, and tracks your progress in real-time."
    },
    {
        question: "Do you provide guaranteed internships?",
        answer: "Yes! Unlike other platforms that just leave you with a certificate, we connect you directly with partner companies for internships after you successfully complete your specialized track and capstone projects."
    },
    {
        question: "What kind of projects will I build?",
        answer: "You won't just build 'To-Do' apps. You will build production-grade applications like E-commerce platforms, AI Chatbots, and SaaS tools that you can proudly showcase in your portfolio to recruiters."
    },
    {
        question: "Is there mentorship available?",
        answer: "Absolutely. You get access to our 'WeborySkills DevLab' community and weekly live sessions with industry experts who review your code, clear doubts, and guide you through complex topics."
    }
];

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-20 relative overflow-hidden bg-[#020202]">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />
            
            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        Got Questions?
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">Questions</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Everything you need to know about the WeborySkills platform and how we accelerate your career.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative border ${activeIndex === index ? 'border-blue-500/50 bg-gradient-to-br from-blue-900/10 to-purple-900/10 shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-[1.02]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 hover:shadow-xl'} rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-500 group`}
                        >
                            {/* Hover Sweep Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                            
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none relative z-10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl transition-colors duration-500 ${activeIndex === index ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'}`}>
                                        <MessageSquare size={20} className={activeIndex === index ? 'animate-pulse' : ''} />
                                    </div>
                                    <span className={`text-lg font-medium transition-colors duration-300 ${activeIndex === index ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {faq.question}
                                    </span>
                                </div>
                                <motion.div
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className={`w-6 h-6 ${activeIndex === index ? 'text-blue-400' : 'text-gray-500'}`} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 pb-6 pt-2 pl-20 text-gray-400 leading-relaxed text-base">
                                            <WordReveal text={faq.answer} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
