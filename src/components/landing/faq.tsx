"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What exactly does Webory offer?",
        answer: "Webory is a complete career ecosystem. We provide AI-generated personalized learning roadmaps, premium video courses, real-world verified projects, and guaranteed internship opportunities to launch your tech career."
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
        answer: "Absolutely. You get access to our 'Webory DevLab' community and weekly live sessions with industry experts who review your code, clear doubts, and guide you through complex topics."
    }
];

export function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-2 block">
                        Got Questions?
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Questions</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Everything you need to know about the Webory platform.
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
                            className={`border ${activeIndex === index ? 'border-blue-500/50 bg-white/5' : 'border-white/5 bg-transparent'} rounded-2xl overflow-hidden backdrop-blur-sm transition-colors duration-300`}
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className={`text-lg font-medium transition-colors ${activeIndex === index ? 'text-white' : 'text-gray-300'}`}>
                                    {faq.question}
                                </span>
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
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                                            {faq.answer}
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
