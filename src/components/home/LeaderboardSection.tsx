"use client";

import { useEffect, useState } from "react";
import { Trophy, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Learner {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    xp: number;
}

export function LeaderboardSection() {
    const [learners, setLearners] = useState<Learner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/stats/leaderboard");
                if (!res.ok) return;
                const data = await res.json();
                if (isMounted && data.leaderboard) {
                    setLearners(data.leaderboard);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchLeaderboard();
        
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return null;
    if (learners.length === 0) return null;

    return (
        <section className="py-16 relative overflow-hidden bg-black/20">
            <div className="container mx-auto px-4 mb-10 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                    <Trophy className="text-blue-500" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Wall of Fame</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-3 uppercase tracking-normal">
                    Top Performing Students
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-sm font-medium">
                    Recognizing our most ambitious students mastering new skills and leading the community.
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-8 animate-scroll-fast hover:pause px-4 w-max">
                    {[...learners, ...learners].map((learner, index) => (
                        <div
                            key={`${learner._id}-${index}`}
                            className="w-[220px] flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[1.5rem] hover:bg-white/10 transition-all group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/10 group-hover:scale-110 transition-transform duration-500">
                                        {learner.avatar ? (
                                            <img src={learner.avatar} alt={learner.firstName} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            learner.firstName?.[0] || '?'
                                        )}
                                    </div>
                                    {index % learners.length < 3 && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg border-[1.5px] border-slate-900">
                                            <Award size={12} />
                                        </div>
                                    )}
                                </div>
                                
                                <h4 className="text-white font-bold text-sm mb-1.5 tracking-tight line-clamp-1">
                                    {learner.firstName} {learner.lastName}
                                </h4>
                                
                                <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                    <Zap size={12} className="text-blue-500 fill-blue-500" />
                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">
                                        {learner.xp.toLocaleString()} XP
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient masks */}
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <style jsx>{`
                @keyframes scroll-fast {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-fast {
                    animation: scroll-fast 50s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
