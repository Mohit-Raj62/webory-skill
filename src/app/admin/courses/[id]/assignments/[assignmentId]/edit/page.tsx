"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";

export default function AdminEditAssignmentPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const assignmentId = params.assignmentId as string;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadingFile, setUploadingFile] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        instructions: "",
        dueDate: "",
        totalMarks: 100,
        attachments: [] as { name: string; url: string }[],
        afterModule: 0,
    });
    
    const [modules, setModules] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch modules (admin bypasses visibility checks typically, but uses same public course API internally)
                const courseRes = await fetch(`/api/courses/${courseId}?includeUnavailable=true`);
                if (courseRes.ok) {
                    const courseData = await courseRes.json();
                    if (courseData.course && courseData.course.modules) {
                        setModules(courseData.course.modules);
                    }
                }

                // Fetch existing assignment using admin route
                const assignmentRes = await fetch(`/api/admin/courses/${courseId}/assignments/${assignmentId}`);
                if (assignmentRes.ok) {
                    const assignmentData = await assignmentRes.json();
                    const a = assignmentData.assignment;
                    
                    let formattedDueDate = "";
                    if (a.dueDate) {
                        const d = new Date(a.dueDate);
                        formattedDueDate = d.toISOString().slice(0, 16);
                    }

                    setFormData({
                        title: a.title || "",
                        description: a.description || "",
                        instructions: a.instructions || "",
                        dueDate: formattedDueDate,
                        totalMarks: a.totalMarks || 100,
                        attachments: a.attachments || [],
                        afterModule: a.afterModule || 0,
                    });
                } else {
                    alert("Failed to fetch assignment details.");
                    router.push(`/admin/courses/${courseId}/assignments`);
                }
            } catch (error) {
                console.error("Fetch data error:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [courseId, assignmentId, router]);

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
        setLoading(true);

        try {
            const res = await fetch(`/api/admin/courses/${courseId}/assignments/${assignmentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Assignment updated successfully!");
                router.push(`/admin/courses/${courseId}/assignments`);
            } else {
                alert("Failed to update assignment");
            }
        } catch (error) {
            console.error("Update assignment error:", error);
            alert("Failed to update assignment");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-white">Loading assignment data...</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href={`/admin/courses/${courseId}/assignments`}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Assignments
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Edit Assignment (Admin)</h1>
                <p className="text-gray-400">Update the details of this assignment</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl max-w-4xl">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Description *</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Instructions</label>
                        <textarea
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            placeholder="Provide detailed instructions for students..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Due Date *</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Total Marks *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.totalMarks}
                                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Place in Module</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                            value={formData.afterModule}
                            onChange={(e) => setFormData({ ...formData, afterModule: Number(e.target.value) })}
                        >
                            <option value={0} className="bg-gray-900 text-gray-300">General / Global Resources</option>
                            {modules.map((module, index) => (
                                <option key={index} value={index + 1} className="bg-gray-900 text-white">
                                    Module {index + 1}: {module.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Attachments (Optional)</label>
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

                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600"
                        >
                            <Save size={20} className="mr-2" />
                            {loading ? "Updating..." : "Update Assignment"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/admin/courses/${courseId}/assignments`)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
