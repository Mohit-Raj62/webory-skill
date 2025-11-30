"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    category: string;
    rating: number;
    comment: string;
    isPublic: boolean;
    createdAt: string;
}

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState < Feedback[] > ([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch("/api/admin/feedback");
            const data = await res.json();
            if (res.ok) {
                setFeedbacks(data.feedbacks);
            } else {
                toast.error(data.error || "Failed to fetch feedback");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/feedback/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublic: !currentStatus }),
            });

            if (res.ok) {
                setFeedbacks(feedbacks.map(f =>
                    f._id === id ? { ...f, isPublic: !currentStatus } : f
                ));
                toast.success(`Feedback is now ${!currentStatus ? 'Visible' : 'Hidden'}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const deleteFeedback = async (id: string) => {
        if (!confirm("Are you sure you want to delete this feedback?")) return;

        try {
            const res = await fetch(`/api/admin/feedback/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setFeedbacks(feedbacks.filter(f => f._id !== id));
                toast.success("Feedback deleted");
            } else {
                toast.error("Failed to delete feedback");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Feedback Management</h1>
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium">
                    Total: {feedbacks.length}
                </div>
            </div>

            <div className="grid gap-4">
                {feedbacks.map((feedback) => (
                    <div
                        key={feedback._id}
                        className={`bg-[#0a0a0a] border ${feedback.isPublic ? 'border-green-500/20' : 'border-white/10'} p-6 rounded-xl transition-all hover:bg-white/5`}
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${feedback.category === 'course' ? 'bg-purple-500/10 text-purple-400' :
                                            feedback.category === 'internship' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-gray-500/10 text-gray-400'
                                        }`}>
                                        {feedback.category}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </span>
                                    {feedback.isPublic && (
                                        <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
                                            <Eye size={12} /> Public
                                        </span>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <StarRating rating={feedback.rating} readOnly size={16} />
                                </div>

                                <p className="text-gray-300 mb-4">{feedback.comment}</p>

                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-300">
                                        {feedback.user.firstName[0]}
                                    </div>
                                    {feedback.user.firstName} {feedback.user.lastName} ({feedback.user.email})
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleVisibility(feedback._id, feedback.isPublic)}
                                    className={feedback.isPublic ? "text-yellow-400 hover:text-yellow-300 border-yellow-500/20 hover:bg-yellow-500/10" : "text-green-400 hover:text-green-300 border-green-500/20 hover:bg-green-500/10"}
                                >
                                    {feedback.isPublic ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteFeedback(feedback._id)}
                                    className="text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {feedbacks.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No feedback received yet.
                    </div>
                )}
            </div>
        </div>
    );
}
