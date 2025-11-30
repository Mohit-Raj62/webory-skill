"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { X, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface FeedbackFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
    const [category, setCategory] = useState("general");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
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

            toast.success("Thank you for your feedback!");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="text-blue-400" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Your Feedback Matters</h2>
                    <p className="text-gray-400 text-sm mt-1">Help us improve your experience</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">What is this about?</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['general', 'course', 'internship', 'interface'].map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${category === cat
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Rate your experience</label>
                        <div className="flex justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <StarRating rating={rating} setRating={setRating} size={32} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tell us more</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like? What can we improve?"
                            required
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg font-bold shadow-lg shadow-blue-900/20"
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
