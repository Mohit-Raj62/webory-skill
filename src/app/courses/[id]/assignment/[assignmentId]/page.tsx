"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, X, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SubmitAssignmentPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const assignmentId = params.assignmentId as string;

    const [assignment, setAssignment] = useState < any > (null);
    const [submission, setSubmission] = useState < any > (null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    const [formData, setFormData] = useState({
        submissionText: "",
        attachments: [] as { name: string; url: string }[],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch assignment details
            const resAssignment = await fetch(`/api/admin/courses/${courseId}/assignments`);
            if (resAssignment.ok) {
                const data = await resAssignment.json();
                const found = data.assignments.find((a: any) => a._id === assignmentId);
                setAssignment(found);
            }

            // Check if already submitted
            const resSubmission = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/submit`);
            if (resSubmission.ok) {
                const data = await resSubmission.json();
                if (data.submission) {
                    setSubmission(data.submission);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch("/api/upload/file", {
                method: "POST",
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({
                    ...prev,
                    attachments: [...prev.attachments, { name: file.name, url: data.url }],
                }));
                alert("File uploaded successfully!");
            } else {
                alert("Failed to upload file");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload file");
        } finally {
            setUploadingFile(false);
            e.target.value = "";
        }
    };

    const removeAttachment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.submissionText && formData.attachments.length === 0) {
            alert("Please provide submission text or upload files");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Assignment submitted successfully!");
                router.push(`/courses/${courseId}`);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to submit assignment");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Failed to submit assignment");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading assignment...</div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Assignment not found</div>
            </div>
        );
    }

    if (submission) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/courses/${courseId}`}>
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft size={20} className="mr-2" />
                            Back to Course
                        </Button>
                    </Link>

                    <div className="glass-card p-8 rounded-2xl text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
                            <CheckCircle className="text-green-400" size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Assignment Submitted!</h1>
                        <p className="text-gray-400 mb-6">
                            Submitted on {new Date(submission.submittedAt).toLocaleString()}
                        </p>

                        {submission.marksObtained !== undefined && (
                            <div className="bg-white/5 p-4 rounded-xl mb-6">
                                <p className="text-gray-400 text-sm">Your Score</p>
                                <p className="text-3xl font-bold text-white">
                                    {submission.marksObtained}/{assignment.totalMarks}
                                </p>
                            </div>
                        )}

                        {submission.feedback && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                <p className="text-blue-300 font-medium mb-2">Instructor Feedback:</p>
                                <p className="text-gray-300">{submission.feedback}</p>
                            </div>
                        )}

                        <Link href={`/courses/${courseId}`}>
                            <Button>Back to Course</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = now > dueDate;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <Link href={`/courses/${courseId}`}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Course
                    </Button>
                </Link>

                <div className="glass-card p-8 rounded-2xl mb-6">
                    <h1 className="text-3xl font-bold text-white mb-4">{assignment.title}</h1>
                    <p className="text-gray-400 mb-4">{assignment.description}</p>

                    {assignment.instructions && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                            <p className="text-blue-300 font-medium mb-2">Instructions:</p>
                            <p className="text-gray-300 whitespace-pre-wrap">{assignment.instructions}</p>
                        </div>
                    )}

                    <div className="flex gap-6 text-sm">
                        <div>
                            <span className="text-gray-400">Due Date: </span>
                            <span className={isOverdue ? "text-red-400 font-medium" : "text-white"}>
                                {dueDate.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400">Total Marks: </span>
                            <span className="text-white">{assignment.totalMarks}</span>
                        </div>
                    </div>

                    {isOverdue && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                            <p className="text-red-400 text-sm">⚠️ This assignment is overdue. Late submissions may receive reduced marks.</p>
                        </div>
                    )}

                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mt-4">
                            <p className="text-gray-400 text-sm mb-2">Attachments:</p>
                            {assignment.attachments.map((file: any, index: number) => (
                                <a
                                    key={index}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm block"
                                >
                                    📎 {file.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Your Submission</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Submission Text</label>
                            <textarea
                                rows={8}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.submissionText}
                                onChange={(e) => setFormData({ ...formData, submissionText: e.target.value })}
                                placeholder="Enter your answer or explanation here..."
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Upload Files</label>
                            <p className="text-xs text-gray-500 mb-2">Supports: PDF, PPTX, DOCX, images, etc.</p>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                disabled={uploadingFile}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingFile
                                        ? "border-gray-600 bg-gray-800/20"
                                        : "border-white/20 hover:border-white/40 bg-white/5"
                                    }`}
                            >
                                <Upload size={20} className="text-gray-400" />
                                <span className="text-gray-400">
                                    {uploadingFile ? "Uploading..." : "Click to upload file"}
                                </span>
                            </label>

                            {formData.attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {formData.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                            <span className="text-white">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 h-12"
                        >
                            <Send size={20} className="mr-2" />
                            {submitting ? "Submitting..." : "Submit Assignment"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
