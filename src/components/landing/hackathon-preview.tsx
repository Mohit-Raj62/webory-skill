"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Code, Terminal, Trophy, Users, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export function HackathonPreview() {
    return (
        <section className="relative py-24 bg-[#030303] overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Visual Side */}
                    <div className="relative group order-2 lg:order-1">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-orange-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
                        
                        <div className="relative rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 p-2 overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent pointer-events-none" />
                            
                            {/* Browser/Terminal Header */}
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="ml-4 px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 font-mono flex items-center gap-2">
                                    <Terminal size={12} /> arena.weboryskills.in
                                </div>
                            </div>
                            
                            <div className="p-8 lg:p-12 space-y-8 relative">
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-orange-500/20"
                                >
                                    <Code className="w-10 h-10 text-white" />
                                </motion.div>
                                
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">Build. Ship. <span className="text-orange-500">Win.</span></h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Join intense 48-hour coding battles, solve real-world problems, and claim top-tier rewards.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl" />
                                        <Trophy size={20} className="text-yellow-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prizes Pool</span>
                                        <span className="text-lg font-black text-white">₹5 Lakhs+</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl" />
                                        <Users size={20} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Elite Builders</span>
                                        <span className="text-lg font-black text-white">2,500+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                            <Zap size={14} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Live Now: WeborySkills Hackathons</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tighter leading-[1.1] text-white uppercase">
                            The Ultimate <br/>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500">
                                Developer Arena
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            Stop tutorials, start building. Experience competitive coding like never before. Team up, pick a role <span className="text-white font-bold">(UI/UX, Backend, AI)</span>, and deliver a working product. Prove your skills and get recognized by the industry.
                        </p>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            {[
                                { icon: ShieldCheck, text: "Earn official blockchain-verified certificates" },
                                { icon: Cpu, text: "Build with DevLab & modern tech stacks" },
                                { icon: Trophy, text: "Win cash rewards, premium swags, and job referrals" }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <feature.icon size={14} className="text-orange-400" />
                                    </div>
                                    <span className="text-gray-300 font-medium text-sm">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Link href="/hackathons">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative h-14 bg-white text-black font-black uppercase tracking-widest text-[11px] md:text-sm px-8 rounded-2xl flex items-center justify-center overflow-hidden hover:bg-gray-100 transition-all shadow-xl shadow-white/5"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Enter the Arena <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
