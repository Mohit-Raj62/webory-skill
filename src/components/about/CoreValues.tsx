"use client";

import { motion } from "framer-motion";
import { Heart, Zap, Users, Shield, Target, Code2 } from "lucide-react";

export function CoreValues() {
    return (
        <>
            <section className="py-20 px-4 md:px-8 relative z-10 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose <span className="text-blue-500">Webory?</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We don't just teach code; we build careers. Here is what sets us apart from the rest.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Project-Based Learning", desc: "Learn by doing. Build real-world applications that you can showcase in your portfolio.", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { title: "Industry Mentorship", desc: "Get guidance from IIT faculty and engineers working at top tech companies like Google, Amazon, and Microsoft.", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                            { title: "Career Support", desc: "From resume reviews to mock interviews, we are with you until you land your dream job.", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" }
                        ].map((item, i) => (
                            <motion.div key={i} className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group">
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Heart size={12} />
                                <span>Our DNA</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Core <span className="text-orange-500">Values</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                These principles guide every decision we make, from the curriculum we design to the community we cultivate. They are the heartbeat of Webory.
                            </p>
                        </div>
                        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Innovation", desc: "We constantly push boundaries to bring the latest tech to our students.", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                                { title: "Community First", desc: "We believe in the power of collaboration and peer-to-peer learning.", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                                { title: "Transparency", desc: "We are open, honest, and accountable in everything we do.", icon: Shield, color: "text-green-400", bg: "bg-green-500/10" },
                                { title: "Excellence", desc: "We strive for the highest quality in our content and mentorship.", icon: Target, color: "text-purple-400", bg: "bg-purple-500/10" }
                            ].map((value, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass-card p-6 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all">
                                    <div className={`w-10 h-10 ${value.bg} rounded-lg flex items-center justify-center mb-4 ${value.color}`}><value.icon size={20} /></div>
                                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-gray-400 text-sm">{value.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
