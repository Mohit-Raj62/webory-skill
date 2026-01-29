"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
    const [category, setCategory] = useState("general");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating to continue");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, rating, comment }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            toast.success("Thank you for your valuable feedback!");
            onClose();
            // Reset form
            setRating(0);
            setComment("");
            setCategory("general");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
                        className="relative w-full max-w-lg"
                    >
                        {/* Glow Effects */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-30 animate-pulse"></div>
                        
                        <div className="relative bg-[#050510]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            {/* Header */}
                            <div className="relative flex justify-between items-start mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20">
                                            <Sparkles className="text-blue-400" size={20} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">Your Feedback Matters</h2>
                                    </div>
                                    <p className="text-slate-400 text-sm">Help us improve your experience on Webory.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                {/* Category Selection */}
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">What is this about?</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {['general', 'course', 'internship', 'interface'].map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all duration-300 border ${
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
                                            <MessageSquare size={14} className="text-slate-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-6 rounded-xl font-bold shadow-lg shadow-blue-500/20 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Submit Feedback <Send size={16} />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
