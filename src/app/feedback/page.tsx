"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function FeedbackPage() {
    const [category, setCategory] = useState("general");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating to continue");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, rating, comment }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to submit feedback");

            toast.success("Thank you for your valuable feedback!");
            setSubmitted(true);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Make sure you are logged in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Navbar />
            
            <div className="flex-grow flex items-center justify-center p-4 py-24 relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full max-w-xl mx-auto"
                >
                    {/* Glow Effects */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20 animate-pulse"></div>
                    
                    <div className="relative bg-[#050510]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
                        
                        {submitted ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                    ✓
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Thank You!</h2>
                                <p className="text-slate-400 mb-8">Your feedback has been submitted successfully. We appreciate your insights.</p>
                                <Button 
                                    onClick={() => window.location.href = '/'}
                                    className="bg-white/10 hover:bg-white/20 text-white"
                                >
                                    Return to Homepage
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8 relative z-10">
                                    <div className="inline-flex p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/20 mb-4">
                                        <Sparkles className="text-blue-400" size={28} />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">We value your Feedback</h1>
                                    <p className="text-slate-400 text-sm sm:text-base">Help us improve your experience on Webory Skills.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
                                    {/* Category Selection */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">What is this about?</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {['general', 'course', 'internship', 'interface'].map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setCategory(cat)}
                                                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all duration-300 border ${
                                                        category === cat
                                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25 scale-[1.02]"
                                                            : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10"
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-3 text-center">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rate your experience</label>
                                        <div className="flex justify-center p-6 bg-gradient-to-b from-white/5 to-transparent rounded-2xl border border-white/5">
                                            <StarRating rating={rating} setRating={setRating} size={36} />
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Tell us more</label>
                                        <div className="relative group">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="What did you like? What can we improve?"
                                                required
                                                className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all duration-300 group-hover:border-white/20"
                                            />
                                            <div className="absolute bottom-3 right-3 p-1.5 bg-white/5 rounded-lg">
                                                <MessageSquare size={16} className="text-slate-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Submit Feedback <Send size={18} />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
