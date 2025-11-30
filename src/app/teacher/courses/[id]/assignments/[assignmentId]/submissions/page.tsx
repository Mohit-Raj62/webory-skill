"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";

export default function AssignmentSubmissionsPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const assignmentId = params.assignmentId as string;

    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [gradingId, setGradingId] = useState<string | null>(null);
    const [gradeData, setGradeData] = useState({ marks: 0, feedback: "" });

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/teacher/courses/${courseId}/assignments/${assignmentId}/submissions`);
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

    const handleGrade = async (submissionId: string) => {
        try {
            const res = await fetch(
                `/api/teacher/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        marksObtained: gradeData.marks,
                        feedback: gradeData.feedback,
                    }),
                }
            );

            if (res.ok) {
                alert("Graded successfully!");
                setGradingId(null);
                setGradeData({ marks: 0, feedback: "" });
                fetchSubmissions();
            } else {
                alert("Failed to grade submission");
            }
        } catch (error) {
            console.error("Grade error:", error);
            alert("Failed to grade submission");
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href={`/teacher/courses/${courseId}/assignments`}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Assignments
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Student Submissions</h1>
                <p className="text-gray-400">Review and grade student work</p>
            </div>

            {loading ? (
                <div className="text-white">Loading submissions...</div>
            ) : submissions.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <p className="text-gray-400">No submissions yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div key={submission._id} className="glass-card p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                        <User className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {submission.userId?.name || "Unknown Student"}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{submission.userId?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${submission.status === "graded"
                                                ? "bg-green-500/20 text-green-300"
                                                : submission.status === "late"
                                                    ? "bg-red-500/20 text-red-300"
                                                    : "bg-blue-500/20 text-blue-300"
                                            }`}
                                    >
                                        {submission.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-400 text-sm mb-2">
                                    <Calendar size={14} className="inline mr-1" />
                                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                </p>

                                {submission.submissionText && (
                                    <div className="bg-white/5 p-4 rounded-xl mb-3">
                                        <p className="text-gray-300 whitespace-pre-wrap">{submission.submissionText}</p>
                                    </div>
                                )}

                                {submission.attachments && submission.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-gray-400 text-sm">Attachments:</p>
                                        {submission.attachments.map((file: any, index: number) => (
                                            <a
                                                key={index}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                                            >
                                                <FileText size={16} />
                                                {file.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {submission.status === "graded" ? (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-green-300 font-medium">Graded</span>
                                        <span className="text-2xl font-bold text-white">
                                            {submission.marksObtained} marks
                                        </span>
                                    </div>
                                    {submission.feedback && (
                                        <p className="text-gray-300 text-sm mt-2">
                                            <strong>Feedback:</strong> {submission.feedback}
                                        </p>
                                    )}
                                </div>
                            ) : gradingId === submission._id ? (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                    <h4 className="text-white font-medium mb-3">Grade Submission</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-gray-300 block mb-2">Marks Obtained</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                                value={gradeData.marks}
                                                onChange={(e) => setGradeData({ ...gradeData, marks: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-300 block mb-2">Feedback</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                                value={gradeData.feedback}
                                                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                                placeholder="Provide feedback to the student..."
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleGrade(submission._id)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle size={18} className="mr-2" />
                                                Submit Grade
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setGradingId(null);
                                                    setGradeData({ marks: 0, feedback: "" });
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => setGradingId(submission._id)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                                >
                                    Grade This Submission
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
