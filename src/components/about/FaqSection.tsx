"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
    { 
        q: "Is Webory Skills government recognized?", 
        a: "Yes, Webory Skills is an officially registered MSME EdTech startup recognized by the Ministry of MSME, Government of India (Registration: UDYAM-BR-26-0208472). All cohort certificates carry verified registration numbers." 
    },
    { 
        q: "Who conducts the mentorship and live sessions?", 
        a: "Our instructors and mentors include distinguished IIT Mandi alumni, academic advisors, and working senior engineers from leading technology firms. Sessions focus on code reviews, system design, and practical debugging." 
    },
    { 
        q: "Are the certificates verifiable online?", 
        a: "Yes, every certificate has an embedded scan-to-verify QR code and a unique Certificate ID that can be authenticated instantly via our portal and directly added to LinkedIn profiles." 
    },
    { 
        q: "Are these programs suitable for college students from Tier-2 & Tier-3 colleges?", 
        a: "Absolutely. Webory was founded by Mohit Sinha specifically to democratize high-end engineering education for students from all universities, taking them from core fundamentals to production-grade deployment." 
    },
    { 
        q: "How does placement and internship support work?", 
        a: "We provide structured career support including live GitHub portfolio curation, resume refactoring, mock technical interviews, and direct referral opportunities through our hiring partner network." 
    }
];

export function FaqSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Frequently Asked Questions
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Got Questions? We Have Answers
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Everything you need to know about our certifications, government recognition, and learning model.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="rounded-xl border border-slate-800 bg-[#0b101b] overflow-hidden">
                            <button 
                                onClick={() => toggleFaq(i)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none group"
                            >
                                <span className={`text-base font-semibold transition-colors ${openFaq === i ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                                    {faq.q}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-blue-400' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-3">
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
