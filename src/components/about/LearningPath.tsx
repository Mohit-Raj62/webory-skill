"use client";

import { motion } from "framer-motion";
import { Zap, Code2, Users, Rocket } from "lucide-react";

const steps = [
    { title: "Learn", desc: "Master concepts with premium video lectures and interactive docs.", icon: Zap, step: "01", color: "blue" },
    { title: "Build", desc: "Apply what you learn by building real-world projects.", icon: Code2, step: "02", color: "purple" },
    { title: "Review", desc: "Get your code reviewed by expert mentors from top tech companies.", icon: Users, step: "03", color: "pink" },
    { title: "Launch", desc: "Land internships and full-time roles with our hiring partners.", icon: Rocket, step: "04", color: "green" }
];

export function LearningPath() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Your Path to <span className="text-blue-500">Success</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We have designed a proven roadmap to take you from beginner to industry-ready professional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 border-t border-dashed border-white/20 z-0"></div>

                    {steps.map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="relative z-10 text-center group"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center relative transition-colors shadow-lg shadow-black/50">
                                 <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                                 <item.icon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                                 <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                                     {item.step}
                                 </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed px-2">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
