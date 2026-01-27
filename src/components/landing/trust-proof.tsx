"use client";

import { CheckCircle, Shield, TrendingUp, Users, Brain, Target, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";

export function TrustProofSection() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <section className="py-24 relative overflow-hidden bg-black/40">
             {/* Background Elements */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* 1. Section Heading */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Why Learners Trust <span className="text-blue-400">Webory Skills</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Built for real skills, real careers, and real outcomes.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* 2. Mentor / Expert Profiles */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                                <Users size={24} />
                            </div>
                            <h3 className="text-3xl font-bold text-white">Industry Mentors</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Mentor Card 1 */}
                            <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-start gap-5 hover:bg-white/5 transition-colors group">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Industry Practitioners</h4>
                                    <p className="text-blue-400 text-sm font-medium mb-3 uppercase tracking-wider">Tech Leads & Senior Devs</p>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        "We don't just teach code; we teach how to survive and thrive in a real software job. Best practices, code reviews, and system design."
                                    </p>
                                </div>
                            </div>

                             {/* Mentor Card 2 */}
                             <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-start gap-5 hover:bg-white/5 transition-colors group">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0">
                                    <Brain size={32} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Webory Training Team</h4>
                                    <p className="text-purple-400 text-sm font-medium mb-3 uppercase tracking-wider">Curriculum Architects</p>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        5+ years of experience in structuring learning paths that align with current market demands.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Student Voice */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                                <MessageCircle size={24} />
                            </div>
                            <h3 className="text-3xl font-bold text-white">Student Experience</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                             <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-3xl border border-white/10 relative hover:border-white/20 transition-all group">
                                <div className="absolute top-6 right-8 text-white/5 group-hover:text-white/10 transition-colors">
                                    <MessageCircle size={48} />
                                </div>
                                <p className="text-gray-300 italic mb-6 relative z-10 text-lg leading-relaxed">
                                    "The roadmap made learning structured and practical. I always knew what to do next. It wasn't just random videos, but a clear path."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">B</div>
                                    <div>
                                        <p className="text-white font-bold">Beta Learner</p>
                                        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">Web Development</p>
                                    </div>
                                </div>
                             </div>

                             <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-3xl border border-white/10 relative hover:border-white/20 transition-all group">
                                <p className="text-gray-300 italic mb-6 text-lg leading-relaxed">
                                    "Building real projects like the Portfolio website gave me so much confidence. I can actually show my work to recruiters now."
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">E</div>
                                    <div>
                                        <p className="text-white font-bold">Early Access Student</p>
                                        <p className="text-purple-400 text-xs font-semibold uppercase tracking-wide">Frontend React</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 4. Learning Approach Proof */}
                {/* 4. Learning Approach Proof */}
                <div className="mb-32 relative">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="text-center mb-16 relative z-10">
                         <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Learning Approach</span>
                         </h3>
                         <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Designed solely for <span className="text-white font-semibold">employability</span> and <span className="text-white font-semibold">skill mastery</span>.
                         </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Card 1 */}
                        <div className="group relative bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Brain size={32} />
                            </div>
                            
                            <h4 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-blue-400 transition-colors">AI-Personalized</h4>
                            <p className="text-gray-400 text-base leading-relaxed relative z-10">
                                Roadmaps that adapt to your specific goal. No wasting time on irrelevant topics.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Target size={32} />
                            </div>
                            
                            <h4 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-purple-400 transition-colors">Project-Based</h4>
                            <p className="text-gray-400 text-base leading-relaxed relative z-10">
                                You don't just watch; you build. Every module ends with a tangible project for your portfolio.
                            </p>
                        </div>

                         {/* Card 3 */}
                         <div className="group relative bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <TrendingUp size={32} />
                            </div>
                            
                            <h4 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-green-400 transition-colors">Career Outcomes</h4>
                            <p className="text-gray-400 text-base leading-relaxed relative z-10">
                                Laser-focused on the skills companies are hiring for right now, not outdated theory.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 5. Association / Proof & 6. Transparency Section */}
                {/* 5. Association / Proof & 6. Transparency Section */}
                <div className="max-w-5xl mx-auto text-center bg-gradient-to-b from-white/5 to-black/40 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-gray-300 font-medium">
                        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                             <Shield size={16} />
                             Industry-Relevant Skills
                        </span>
                        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                             <CheckCircle size={16} />
                             Practical Learning Focus
                        </span>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-8 border border-white/5 mb-10 max-w-3xl mx-auto relative group hover:border-white/10 transition-colors">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-white/10 px-4 py-1 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Transparency Note
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed font-medium">
                            "We don’t promise instant jobs or overnight success. We focus on building the <span className="text-white font-bold">genuine hard skills</span> that make you employable, confident, and valuable in real-world technical roles."
                        </p>
                        <p className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-lg">
                            Your Effort + Our Roadmap = Results.
                        </p>
                    </div>

                    {/* 7. Trust CTA */}
                     <Button 
                        onClick={() => router.push(user ? '/ai-weboryskills' : '/login')}
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-8 rounded-2xl text-xl font-bold shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
                    >
                        Get Your AI Roadmap
                    </Button>
                    <p className="text-gray-500 text-sm mt-4">Free for students • No credit card required</p>
                </div>
            </div>
        </section>
    );
}
