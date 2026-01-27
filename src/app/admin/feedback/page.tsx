"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, Loader2, ThumbsUp, ThumbsDown, MessageSquare, Video } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface VideoFeedback {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    courseTitle: string;
    videoTitle: string;
    videoIndex: number;
    isLiked: boolean | null;
    feedback: string;
    createdAt: string;
}

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState < Feedback[] > ([]);
    const [videoFeedbacks, setVideoFeedbacks] = useState < VideoFeedback[] > ([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        try {
            const [resGeneral, resVideo] = await Promise.all([
                fetch("/api/admin/feedback"),
                fetch("/api/admin/video-feedback")
            ]);

            if (resGeneral.ok) {
                const data = await resGeneral.json();
                setFeedbacks(data.feedbacks);
            }
            if (resVideo.ok) {
                const data = await resVideo.json();
                setVideoFeedbacks(data.feedbacks);
            }
        } catch (error) {
            toast.error("Failed to fetch feedback data");
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
            <h1 className="text-2xl font-bold text-white mb-6">Feedback Management</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="general">General Feedback</TabsTrigger>
                    <TabsTrigger value="video">Video Feedback</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Platform Reviews</h2>
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
                                No general feedback received yet.
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="video">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-200">Video Insights & Comments</h2>
                        <div className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-lg text-sm font-medium">
                            Total: {videoFeedbacks.length}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {videoFeedbacks.map((feedback) => (
                            <div
                                key={feedback._id}
                                className="bg-[#0a0a0a] border border-white/10 p-6 rounded-xl transition-all hover:bg-white/5"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full text-xs text-gray-400 border border-gray-700">
                                                <Video size={12} />
                                                <span className="truncate max-w-[200px]" title={feedback.courseTitle}>{feedback.courseTitle}</span>
                                                <span className="text-gray-600">/</span>
                                                <span className="text-white font-medium truncate max-w-[200px]" title={feedback.videoTitle}>{feedback.videoTitle}</span>
                                            </div>
                                            <span className="text-gray-500 text-xs">
                                                {new Date(feedback.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                {feedback.isLiked === true && (
                                                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                                        <ThumbsUp size={20} />
                                                    </div>
                                                )}
                                                {feedback.isLiked === false && (
                                                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                                        <ThumbsDown size={20} />
                                                    </div>
                                                )}
                                                {feedback.isLiked === null && feedback.feedback && (
                                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                                        <MessageSquare size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                 {feedback.feedback ? (
                                                     <p className="text-gray-200 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                                                         "{feedback.feedback}"
                                                     </p>
                                                 ) : (
                                                     <p className="text-gray-500 italic">No written feedback provided.</p>
                                                 )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                                {feedback.user.firstName[0]}
                                            </div>
                                            <span className="font-medium text-gray-400">
                                                {feedback.user.firstName} {feedback.user.lastName}
                                            </span>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-gray-600">{feedback.user.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {videoFeedbacks.length === 0 && (
                            <div className="text-center py-20 text-gray-500">
                                No video feedback or likes yet.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
