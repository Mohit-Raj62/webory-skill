"use client";

import { motion } from "framer-motion";
import { Target, Globe } from "lucide-react";

export function MissionVision() {
    return (
        <section className="py-24 px-4 md:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                     <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                        <div className="glass-card p-10 md:p-12 rounded-3xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Mission</span></h2>
                            <p className="text-gray-400 leading-relaxed text-lg mb-6">
                                To democratize access to elite tech education. We believe talent is universal, but opportunity is not. We are building the bridge that connects ambitious learners with world-class careers, regardless of their background.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                         <div className="glass-card p-10 md:p-12 rounded-3xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                <Globe size={32} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Vision</span></h2>
                            <p className="text-gray-400 leading-relaxed text-lg mb-6">
                                To become the global launchpad for the next generation of tech leaders. We envision a future where every aspiring developer has the mentorship, tools, and community needed to build technology that shapes the world.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
