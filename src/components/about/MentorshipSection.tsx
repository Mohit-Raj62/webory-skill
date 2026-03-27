"use client";

import { motion } from "framer-motion";
import { MessageSquare, Mic, Calendar, Video, Code2, Users } from "lucide-react";

export function MentorshipSection() {
    return (
        <section className="py-24 px-4 md:px-8 relative z-10 overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="w-full md:w-1/2 relative">
                         <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                         <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                 <div className="flex gap-1.5">
                                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                     <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                 </div>
                                 <div className="text-xs text-gray-500 font-mono">mentorship_session.tsx</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="aspect-video bg-gray-900 rounded-xl relative overflow-hidden border border-white/5">
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">VK</div>
                                     </div>
                                     <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                         <span className="text-[10px] text-white font-medium">Vijay Kumar - IIT Mandi</span>
                                     </div>
                                     <div className="absolute top-2 right-2 flex gap-1">
                                         <div className="p-1 rounded bg-black/50 text-white"><Mic size={10} /></div>
                                     </div>
                                </div>
                                <div className="aspect-video bg-gray-800 rounded-xl relative overflow-hidden border border-white/5">
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">Y</div>
                                     </div>
                                     <div className="absolute bottom-3 left-3 text-[10px] text-white font-medium">You</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">VK</div>
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-sm text-gray-300 border border-white/5">
                                        Great work on the useEffect hook! Just one optimization: try to add the dependency array to prevent infinite loops. 🚀
                                    </div>
                                </div>
                            </div>

                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-4 top-10 sm:-right-8 sm:top-20 bg-[#151515] p-3 md:p-4 rounded-xl border border-green-500/20 shadow-xl flex items-center gap-3 z-20 scale-75 sm:scale-100 origin-top-right"
                            >
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Next Session</div>
                                    <div className="text-sm font-bold text-white">Tomorrow, 10 AM</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <MessageSquare size={12} />
                            <span>1:1 Guidance</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Master Code with <span className="text-purple-500">Expert Mentorship</span></h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Learning to code is hard. Doing it alone is harder. Our mentorship program simulates a real workplace environment where you get daily feedback.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Unlimited Code Reviews", desc: "Never get stuck for long. Get your code reviewed by pros.", icon: Code2, color: "blue" },
                                { title: "Weekly Live Connects", desc: "Discuss architecture, debugging, and career advice live.", icon: Video, color: "purple" },
                                { title: "Mock Interviews", desc: "Practice with engineers from top tech companies.", icon: Users, color: "green" }
                            ].map((item, i) => (
                                <motion.div key={i} whileHover={{ x: 10 }} className="flex gap-4 group cursor-default">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
