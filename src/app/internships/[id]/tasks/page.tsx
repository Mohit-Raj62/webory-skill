"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Link as LinkIcon, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function StudentInternshipTasksPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [submissionData, setSubmissionData] = useState({
        submissionUrl: "",
        comments: "",
    });

    useEffect(() => {
        fetchTasks();
    }, [id]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/student/internships/${id}/tasks`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data.tasks);
            } else {
                toast.error("Failed to load tasks");
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submittingId) return;

        try {
            const res = await fetch(`/api/student/internships/tasks/${submittingId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            if (res.ok) {
                toast.success("Work submitted successfully!");
                fetchTasks();
                setSubmittingId(null);
                setSubmissionData({ submissionUrl: "", comments: "" });
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to submit work");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to submit work");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "text-green-400 bg-green-500/10 border-green-500/20";
            case "rejected": return "text-red-400 bg-red-500/10 border-red-500/20";
            default: return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved": return <CheckCircle size={16} />;
            case "rejected": return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
                        <p className="text-gray-400">Complete your assigned tasks to progress</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading tasks...</div>
                ) : (
                    <div className="space-y-6">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="glass-card p-6 rounded-xl border border-white/10"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText size={16} />
                                                Posted: {new Date(task.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {task.submission && (
                                        <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-sm ${getStatusColor(task.submission.status)}`}>
                                            {getStatusIcon(task.submission.status)}
                                            <span className="capitalize">{task.submission.status}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-300 mb-6 whitespace-pre-wrap">{task.description}</p>

                                {task.submission ? (
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <h4 className="font-semibold mb-2 text-sm text-gray-400">Your Submission</h4>
                                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                                            <LinkIcon size={16} />
                                            <a href={task.submission.submissionUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                                {task.submission.submissionUrl}
                                            </a>
                                        </div>
                                        {task.submission.comments && (
                                            <p className="text-sm text-gray-400 italic">"{task.submission.comments}"</p>
                                        )}
                                        {task.submission.status !== 'approved' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-4 border-white/10 hover:bg-white/5"
                                                onClick={() => {
                                                    setSubmittingId(task._id);
                                                    setSubmissionData({
                                                        submissionUrl: task.submission.submissionUrl,
                                                        comments: task.submission.comments || "",
                                                    });
                                                }}
                                            >
                                                Edit Submission
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setSubmittingId(task._id)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Submit Work
                                    </Button>
                                )}
                            </div>
                        ))}

                        {tasks.length === 0 && (
                            <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl border border-white/10">
                                No tasks assigned yet. Check back later!
                            </div>
                        )}
                    </div>
                )}

                {/* Submission Modal */}
                {submittingId && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Submit Work</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Project URL</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://github.com/..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={submissionData.submissionUrl}
                                        onChange={(e) => setSubmissionData({ ...submissionData, submissionUrl: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Comments (Optional)</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={submissionData.comments}
                                        onChange={(e) => setSubmissionData({ ...submissionData, comments: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setSubmittingId(null);
                                            setSubmissionData({ submissionUrl: "", comments: "" });
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
