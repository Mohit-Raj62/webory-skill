"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Link as LinkIcon, Film, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload-utils";

interface VideoTestimonial {
    _id: string;
    studentName: string;
    roleOrCourse: string;
    videoUrl: string;
    thumbnailUrl: string;
    isActive: boolean;
    order: number;
}

export default function AdminVideoTestimonials() {
    const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        studentName: "",
        roleOrCourse: "",
        videoUrl: "",
        thumbnailUrl: "",
        isActive: true,
        order: 0,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/admin/video-testimonials");
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (error) {
            toast.error("Failed to load video testimonials");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (testimonial?: VideoTestimonial) => {
        setVideoFile(null);
        setUploadProgress(0);
        if (testimonial) {
            setEditingId(testimonial._id);
            setFormData({
                studentName: testimonial.studentName,
                roleOrCourse: testimonial.roleOrCourse,
                videoUrl: testimonial.videoUrl,
                thumbnailUrl: testimonial.thumbnailUrl || "",
                isActive: testimonial.isActive,
                order: testimonial.order || 0,
            });
        } else {
            setEditingId(null);
            setFormData({
                studentName: "",
                roleOrCourse: "",
                videoUrl: "",
                thumbnailUrl: "",
                isActive: true,
                order: testimonials.length,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        let finalVideoUrl = formData.videoUrl;

        if (videoFile) {
            setIsUploading(true);
            try {
                const data = await uploadFile(videoFile, "/api/upload/video", (progress) => {
                    setUploadProgress(progress);
                });
                finalVideoUrl = data.url;
            } catch (error) {
                toast.error("Failed to upload video");
                setIsUploading(false);
                setSubmitting(false);
                return;
            }
            setIsUploading(false);
        }

        try {
            const url = editingId
                ? `/api/admin/video-testimonials/${editingId}`
                : "/api/admin/video-testimonials";
            
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, videoUrl: finalVideoUrl }),
            });

            if (res.ok) {
                toast.success(editingId ? "Updated successfully" : "Added successfully");
                setIsModalOpen(false);
                fetchTestimonials();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to save");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video testimonial?")) return;
        try {
            const res = await fetch(`/api/admin/video-testimonials/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Deleted successfully");
                fetchTestimonials();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const toggleStatus = async (testimonial: VideoTestimonial) => {
        try {
            const res = await fetch(`/api/admin/video-testimonials/${testimonial._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !testimonial.isActive }),
            });
            if (res.ok) fetchTestimonials();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // Helper to extract YouTube ID for auto-thumbnail if no thumbnail provided
    const getYouTubeThumbnail = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
        }
        return null;
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Video Testimonials</h1>
                    <p className="text-gray-400 mt-1">Manage student feedback videos for the landing page.</p>
                </div>
                <Button 
                    onClick={() => handleOpenModal()} 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Video
                </Button>
            </div>

            <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-black/40 text-xs uppercase text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 font-medium">Student</th>
                                <th className="px-6 py-4 font-medium">Role/Course</th>
                                <th className="px-6 py-4 font-medium">Video</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Order</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {testimonials.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No video testimonials found. Click "Add Video" to create one.
                                    </td>
                                </tr>
                            ) : (
                                testimonials.map((t) => (
                                    <tr key={t._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                                            {t.studentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {t.roleOrCourse}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <a href={t.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                                <Film className="w-4 h-4" /> View
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => toggleStatus(t)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${t.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                                            >
                                                {t.isActive ? "Active" : "Hidden"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {t.order}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                                            <button onClick={() => handleOpenModal(t)} className="text-gray-400 hover:text-white transition-colors">
                                                <Edit2 className="w-4 h-4 inline-block" />
                                            </button>
                                            <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4 inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-xl shadow-2xl relative">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingId ? "Edit Video Testimonial" : "Add Video Testimonial"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Student Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Rahul Kumar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Role or Course *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.roleOrCourse}
                                    onChange={(e) => setFormData({ ...formData, roleOrCourse: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Full Stack Web Development"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Video URL (YouTube/MP4) OR Upload Video *</label>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setVideoFile(e.target.files[0]);
                                            } else {
                                                setVideoFile(null);
                                            }
                                        }}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className="h-[1px] bg-white/10 flex-1"></div>
                                        <span className="text-xs text-gray-500 uppercase font-bold">OR</span>
                                        <div className="h-[1px] bg-white/10 flex-1"></div>
                                    </div>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="url"
                                            required={!videoFile && !formData.videoUrl}
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Upload a video file or paste a YouTube/Direct URL. Uploaded videos will override the URL field.</p>
                                {isUploading && (
                                    <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                        <p className="text-xs text-center mt-1 text-gray-400">Uploading: {Math.round(uploadProgress)}%</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Custom Thumbnail URL (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.thumbnailUrl}
                                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Leave empty to auto-fetch YouTube thumbnail"
                                />
                                {formData.videoUrl && getYouTubeThumbnail(formData.videoUrl) && !formData.thumbnailUrl && (
                                    <p className="text-xs text-emerald-400 mt-1">✓ Auto-detected YouTube thumbnail will be used.</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex items-center pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-600 bg-black/50 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-300">Visible to Public</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-transparent border-white/10 hover:bg-white/5 text-white"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? "Save Changes" : "Add Video")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
