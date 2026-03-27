"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
    { q: "Who are the mentors?", a: "Our mentors include distinguished IIT Mandi faculty and industry veterans from top tech companies like Google, Microsoft, Amazon, and Adobe. They bring real-world experience and academic excellence to your learning journey." },
    { q: "Is this suitable for beginners?", a: "Absolutely! Our curriculum is designed to take you from zero to hero. We start with the basics and progressively move to advanced topics." },
    { q: "Do I get a certificate?", a: "Yes, you will earn a verifiable certificate upon successful completion of the course and projects, which you can add to your LinkedIn and resume." },
    { q: "How does the placement support work?", a: "We provide dedicated career support, including resume building, mock interviews, and direct referrals to our network of hiring partners." }
];

export function FaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-white/5 bg-white/[0.02]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <HelpCircle size={12} />
                        <span>Common Questions</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently <span className="text-blue-500">Asked</span></h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="glass-card rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                            <button 
                                onClick={() => toggleFaq(i)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                            >
                                <span className={`text-lg font-medium transition-colors ${openFaq === i ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}`}>
                                    {faq.q}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-blue-400' : 'group-hover:text-gray-300'}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
