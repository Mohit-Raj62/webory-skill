"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Quote } from "lucide-react";

interface Feedback {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    category: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export function TestimonialsSection() {
    const [feedbacks, setFeedbacks] = useState < Feedback[] > ([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchFeedbacks = async () => {
            try {
                const res = await fetch("/api/feedback");
                const data = await res.json();
                if (isMounted && data.feedbacks) {
                    setFeedbacks(data.feedbacks);
                }
            } catch (error) {
                console.error("Failed to fetch feedbacks", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchFeedbacks();
        // Poll for new feedback every 30 seconds for "real-time" feel
        const interval = setInterval(fetchFeedbacks, 30000);
        
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    if (loading) return null;
    if (feedbacks.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    What Our Users Say
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Real feedback from students and interns shaping their future with Skill Webory.
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-6 animate-scroll hover:pause px-4 w-max">
                    {[...feedbacks, ...feedbacks].map((feedback, index) => (
                        <div
                            key={`${feedback._id}-${index}`}
                            className="w-[350px] md:w-[400px] flex-shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {feedback.user?.avatar ? (
                                            <img src={feedback.user.avatar} alt={feedback.user.firstName} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            feedback.user?.firstName?.[0] || '?'
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">
                                            {feedback.user?.firstName || 'Unknown'} {feedback.user?.lastName || 'User'}
                                        </h4>
                                        <span className="text-xs text-blue-400 uppercase tracking-wider font-medium">
                                            {feedback.category}
                                        </span>
                                    </div>
                                </div>
                                <Quote className="text-white/20" size={24} />
                            </div>

                            <div className="mb-3">
                                <StarRating rating={feedback.rating} readOnly size={16} />
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                                "{feedback.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient masks for smooth fade effect */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
