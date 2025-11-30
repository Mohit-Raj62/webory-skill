"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TaskSubmissionsPage({ params }: { params: Promise<{ id: string, taskId: string }> }) {
    const { id, taskId } = use(params);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [gradingId, setGradingId] = useState<string | null>(null);
    const [gradeData, setGradeData] = useState({
        status: "",
        grade: "",
        comments: "",
    });

    useEffect(() => {
        fetchSubmissions();
    }, [taskId]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/admin/internships/tasks/${taskId}/submissions`);
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingId) return;

        try {
            const res = await fetch(`/api/admin/internships/submissions/${gradingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gradeData),
            });

            if (res.ok) {
                toast.success("Submission updated successfully");
                fetchSubmissions();
                setGradingId(null);
            } else {
                toast.error("Failed to update submission");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update submission");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center gap-1"><CheckCircle size={12} /> Approved</span>;
            case "rejected":
                return <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs border border-red-500/30 flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30 flex items-center gap-1"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/internships/${id}/tasks`} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Task Submissions</h1>
                    <p className="text-gray-400">Review and grade student submissions</p>
                </div>
            </div>

            {loading ? (
                <div className="text-white">Loading submissions...</div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Student</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Submission</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Submitted At</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Grade</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((submission) => (
                                    <tr key={submission._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">
                                                {submission.student?.firstName} {submission.student?.lastName}
                                            </div>
                                            <div className="text-xs text-gray-400">{submission.student?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={submission.submissionUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                View Work <ExternalLink size={14} />
                                            </a>
                                            {submission.comments && (
                                                <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                                    "{submission.comments}"
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {new Date(submission.submittedAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(submission.status)}
                                        </td>
                                        <td className="px-6 py-4 text-white">
                                            {submission.grade || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                                onClick={() => {
                                                    setGradingId(submission._id);
                                                    setGradeData({
                                                        status: submission.status,
                                                        grade: submission.grade || "",
                                                        comments: submission.comments || "",
                                                    });
                                                }}
                                            >
                                                Grade
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {submissions.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No submissions found for this task.
                        </div>
                    )}
                </div>
            )}

            {/* Grading Modal */}
            {gradingId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Grade Submission</h2>
                        <form onSubmit={handleGrade} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Status</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={gradeData.status}
                                    onChange={(e) => setGradeData({ ...gradeData, status: e.target.value })}
                                >
                                    <option value="pending" className="bg-black">Pending</option>
                                    <option value="approved" className="bg-black">Approved</option>
                                    <option value="rejected" className="bg-black">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Grade (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. A, 90/100"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={gradeData.grade}
                                    onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Comments</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={gradeData.comments}
                                    onChange={(e) => setGradeData({ ...gradeData, comments: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setGradingId(null)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
