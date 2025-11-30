"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Upload, Image } from "lucide-react";
import Link from "next/link";
import { uploadFile } from "@/lib/upload-utils";

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "Beginner",
        price: 0,
        originalPrice: 0,
        discountPercentage: 0,
        studentsCount: "0",
        color: "from-blue-500 to-purple-500",
        icon: "Globe",
        duration: "0h",
        thumbnail: "",
        curriculum: [] as string[],
        videos: [] as { title: string; url: string; duration: string }[],
    });

    const [curriculumInput, setCurriculumInput] = useState("");
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });

    useEffect(() => {
        fetchCourse();
    }, []);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    title: data.course.title || "",
                    description: data.course.description || "",
                    level: data.course.level || "Beginner",
                    price: data.course.price || 0,
                    originalPrice: data.course.originalPrice || 0,
                    discountPercentage: data.course.discountPercentage || 0,
                    studentsCount: data.course.studentsCount || "0",
                    color: data.course.color || "from-blue-500 to-purple-500",
                    icon: data.course.icon || "Globe",
                    duration: data.course.duration || "0h",
                    thumbnail: data.course.thumbnail || "",
                    curriculum: data.course.curriculum || [],
                    videos: data.course.videos || [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/teacher/courses/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Course updated successfully!");
                router.push("/teacher/courses");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update course");
            }
        } catch (error) {
            console.error("Update course error:", error);
            alert("Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    const addCurriculumItem = () => {
        if (curriculumInput.trim()) {
            setFormData({
                ...formData,
                curriculum: [...formData.curriculum, curriculumInput.trim()],
            });
            setCurriculumInput("");
        }
    };

    const removeCurriculumItem = (index: number) => {
        setFormData({
            ...formData,
            curriculum: formData.curriculum.filter((_, i) => i !== index),
        });
    };

    const addVideo = (e?: React.MouseEvent) => {
        e?.preventDefault();
        if (videoInput.title && videoInput.url) {
            setFormData({
                ...formData,
                videos: [...formData.videos, { ...videoInput }],
            });
            setVideoInput({ title: "", url: "", duration: "" });
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max for images)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert(`File too large! Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            e.target.value = "";
            return;
        }

        setUploadingThumbnail(true);

        try {
            const data = await uploadFile(file, "/api/upload/image");
            setFormData((prev) => ({ ...prev, thumbnail: data.url }));
            alert("Thumbnail uploaded successfully!");
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload thumbnail");
        } finally {
            setUploadingThumbnail(false);
            e.target.value = "";
        }
    };

    const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!videoInput.title) {
            alert("Please enter video title first");
            e.target.value = "";
            return;
        }

        // Validate file size (500MB max)
        const maxSize = 500 * 1024 * 1024; // 500MB
        if (file.size > maxSize) {
            alert(`File too large! Maximum size is 500MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            e.target.value = "";
            return;
        }

        setUploadingVideo(true);
        setUploadProgress(0);

        try {
            const data = await uploadFile(file, "/api/upload/video", (progress) => {
                setUploadProgress(progress);
            });

            setFormData((prev) => ({
                ...prev,
                videos: [
                    ...prev.videos,
                    {
                        title: videoInput.title,
                        url: data.url,
                        duration: videoInput.duration || Math.floor(data.duration || 0).toString() + "s",
                    },
                ],
            }));
            setVideoInput({ title: "", url: "", duration: "" });
            alert("Video uploaded successfully!");
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload video. Please check your internet connection and try again.");
        } finally {
            setUploadingVideo(false);
            setUploadProgress(0);
            e.target.value = "";
        }
    };

    const removeVideo = (index: number) => {
        setFormData({
            ...formData,
            videos: formData.videos.filter((_, i) => i !== index),
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading course...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/teacher/courses">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Courses
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Edit Course</h1>
                <p className="text-gray-400">Update course details and content</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl max-w-4xl">
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Course Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Level *</label>
                            <select
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Description *</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Original Price (₹)</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-400 mt-1">For showing strikethrough pricing</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Discount %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.discountPercentage}
                                onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {formData.discountPercentage > 0 && formData.originalPrice > 0
                                    ? `Discounted: ₹${Math.round(formData.originalPrice * (1 - formData.discountPercentage / 100))}`
                                    : "Enter discount percentage"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Duration</label>
                            <input
                                type="text"
                                placeholder="e.g., 10h"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Icon Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Globe, Code"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Thumbnail URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            />
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    disabled={uploadingThumbnail}
                                    className="hidden"
                                    id="thumbnail-upload"
                                />
                                <label
                                    htmlFor="thumbnail-upload"
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${uploadingThumbnail
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        } text-white`}
                                >
                                    <Image size={20} />
                                    {uploadingThumbnail ? "Uploading..." : "Upload Image"}
                                </label>
                            </div>
                        </div>
                        {formData.thumbnail && (
                            <div className="mt-2 relative w-40 h-24 rounded-lg overflow-hidden border border-white/10 group">
                                <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, thumbnail: "" })}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="text-white hover:text-red-400" size={24} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Curriculum */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Curriculum Topics</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add curriculum topic"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={curriculumInput}
                                onChange={(e) => setCurriculumInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCurriculumItem())}
                            />
                            <Button type="button" onClick={addCurriculumItem}>
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(formData.curriculum || []).map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <span className="text-white">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeCurriculumItem(index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Videos */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Course Videos</label>
                        <div className="space-y-3 mb-3">
                            <input
                                type="text"
                                placeholder="Video title"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={videoInput.title}
                                onChange={(e) => setVideoInput({ ...videoInput, title: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        placeholder="Video URL (YouTube, Vimeo, etc.)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                        value={videoInput.url}
                                        onChange={(e) => setVideoInput({ ...videoInput, url: e.target.value })}
                                    />
                                </div>
                                <span className="text-gray-400 flex items-center px-3">OR</span>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoFileUpload}
                                        disabled={uploadingVideo}
                                        className="hidden"
                                        id="video-file-input"
                                    />
                                    <label
                                        htmlFor="video-file-input"
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${uploadingVideo
                                            ? "bg-gray-600 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                            } text-white`}
                                    >
                                        <Upload size={20} />
                                        {uploadingVideo ? "Uploading..." : "Upload File"}
                                    </label>
                                </div>
                            </div>

                            {/* Upload Progress Bar */}
                            {uploadingVideo && uploadProgress > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Uploading video...</span>
                                        <span className="text-blue-400">{Math.round(uploadProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* File Size Info */}
                            <p className="text-xs text-gray-400">
                                Maximum file size: 500MB. Supported formats: MP4, MOV, AVI, etc.
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 15:30)"
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                    value={videoInput.duration}
                                    onChange={(e) => setVideoInput({ ...videoInput, duration: e.target.value })}
                                />
                                <Button type="button" onClick={addVideo}>
                                    <Plus size={20} className="mr-2" />
                                    Add by URL
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {(formData.videos || []).map((video, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{video.title}</p>
                                        <p className="text-gray-400 text-sm">{video.duration}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeVideo(index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {saving ? "Saving..." : "Update Course"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/teacher/courses")}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
