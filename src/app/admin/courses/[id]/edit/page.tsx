"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Upload, Image, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { uploadFile, uploadPDFToCloudinary } from "@/lib/upload-utils";

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
        modules: [] as {
            title: string;
            description: string;
            order: number;
            videos: { title: string; url: string; duration: string }[];
        }[],
    });

    const [curriculumInput, setCurriculumInput] = useState("");
    const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
    const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });
    
    // PDF Resources State
    const [pdfs, setPdfs] = useState<any[]>([]);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [pdfInput, setPdfInput] = useState({
        title: "",
        description: "",
        afterModule: 0,
        order: 0
    });

    useEffect(() => {
        fetchCourse();
        fetchPDFs();
    }, []);

    const fetchPDFs = async () => {
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/pdfs`);
            if (res.ok) {
                const data = await res.json();
                setPdfs(data.pdfs || []);
            }
        } catch (error) {
            console.error("Failed to fetch PDFs", error);
        }
    };

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                
                // Handle modules - create default if not exists
                let modules = data.course.modules || [];
                if (modules.length === 0 && data.course.videos && data.course.videos.length > 0) {
                    modules = [{
                        title: "Course Content",
                        description: "All course videos",
                        order: 0,
                        videos: data.course.videos
                    }];
                }
                
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
                    modules: modules,
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
            const res = await fetch(`/api/admin/courses/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Course updated successfully!");
                // Refetch course data to sync state with database
                await fetchCourse();
            } else {
                alert("Failed to update course");
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

    const addModule = () => {
        if (moduleInput.title.trim()) {
            const newModule = {
                title: moduleInput.title,
                description: moduleInput.description,
                order: formData.modules.length,
                videos: []
            };
            setFormData({
                ...formData,
                modules: [...formData.modules, newModule]
            });
            setModuleInput({ title: "", description: "" });
            setSelectedModuleIndex(formData.modules.length);
        }
    };

    const removeModule = (index: number) => {
        if (confirm("Are you sure you want to delete this module and all its videos?")) {
            const newModules = formData.modules.filter((_, i) => i !== index);
            newModules.forEach((module, i) => {
                module.order = i;
            });
            setFormData({
                ...formData,
                modules: newModules
            });
            if (selectedModuleIndex >= newModules.length) {
                setSelectedModuleIndex(Math.max(0, newModules.length - 1));
            }
        }
    };

    const addVideoToModule = (e?: React.MouseEvent) => {
        e?.preventDefault();
        if (videoInput.title && videoInput.url && formData.modules.length > 0) {
            const newModules = [...formData.modules];
            // Ensure videos array exists
            if (!newModules[selectedModuleIndex].videos) {
                newModules[selectedModuleIndex].videos = [];
            }
            newModules[selectedModuleIndex].videos.push({ ...videoInput });
            setFormData({
                ...formData,
                modules: newModules
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

            const newModules = [...formData.modules];
            if (newModules.length === 0) {
                newModules.push({
                    title: "Course Content",
                    description: "All course videos",
                    order: 0,
                    videos: []
                });
                setSelectedModuleIndex(0);
            }
            
            // Ensure videos array exists
            if (!newModules[selectedModuleIndex].videos) {
                newModules[selectedModuleIndex].videos = [];
            }
            
            newModules[selectedModuleIndex].videos.push({
                title: videoInput.title,
                url: data.url,
                duration: videoInput.duration || Math.floor(data.duration || 0).toString() + "s",
            });

            setFormData((prev) => ({
                ...prev,
                modules: newModules
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

    const removeVideoFromModule = (moduleIndex: number, videoIndex: number) => {
        const newModules = [...formData.modules];
        newModules[moduleIndex].videos = newModules[moduleIndex].videos.filter((_, i) => i !== videoIndex);
        setFormData({
            ...formData,
            modules: newModules
        });
    };

    const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!pdfInput.title) {
            alert("Please enter PDF title first");
            e.target.value = "";
            return;
        }

        // Validate file size (100MB max)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            alert(`File too large! Maximum size is 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
            e.target.value = "";
            return;
        }

        setUploadingPdf(true);
        setUploadProgress(0);

        try {
            // 1. Upload to Cloudinary
            const uploadData = await uploadPDFToCloudinary(file);

            // 2. Save to database
            const apiUrl = `/api/admin/courses/${params?.id}/pdfs`;
            console.log("Saving PDF info to:", apiUrl);

            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: pdfInput.title,
                    description: pdfInput.description,
                    fileUrl: uploadData.url,
                    fileName: uploadData.fileName,
                    fileSize: uploadData.fileSize,
                    afterModule: Number(pdfInput.afterModule),
                    order: Number(pdfInput.order),
                    cloudinaryId: uploadData.cloudinaryId
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPdfs([...pdfs, data.pdf]);
                setPdfInput({
                    title: "",
                    description: "",
                    afterModule: 0,
                    order: 0
                });
                alert("PDF uploaded successfully!");
            } else {
                throw new Error("Failed to save PDF info");
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload PDF");
        } finally {
            setUploadingPdf(false);
            setUploadProgress(0);
            e.target.value = "";
        }
    };

    const handleDeletePDF = async (pdfId: string) => {
        if (!confirm("Are you sure you want to delete this PDF?")) return;

        try {
            const res = await fetch(`/api/admin/courses/${params.id}/pdfs/${pdfId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPdfs(pdfs.filter(p => p._id !== pdfId));
                alert("PDF deleted successfully");
            } else {
                alert("Failed to delete PDF");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete PDF");
        }
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
                <Link href="/admin/courses">
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

                    {/* Modules and Videos */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-4">Course Modules & Videos</label>
                        
                        {/* Add New Module */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4">
                            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                                <Plus size={18} className="text-blue-400" />
                                Add New Module
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Module Title (e.g., Introduction to React)"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                    value={moduleInput.title}
                                    onChange={(e) => setModuleInput({ ...moduleInput, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Module Description (optional)"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                    value={moduleInput.description}
                                    onChange={(e) => setModuleInput({ ...moduleInput, description: e.target.value })}
                                />
                            </div>
                            <Button type="button" onClick={addModule} className="w-full">
                                <Plus size={20} className="mr-2" />
                                Create Module
                            </Button>
                        </div>

                        {/* Module List */}
                        {formData.modules.length > 0 && (
                            <div className="space-y-4">
                                {formData.modules.map((module, moduleIndex) => (
                                    <div key={moduleIndex} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-lg">
                                                    Module {moduleIndex + 1}: {module.title}
                                                </h3>
                                                {module.description && (
                                                    <p className="text-gray-400 text-sm">{module.description}</p>
                                                )}
                                                <p className="text-gray-500 text-xs mt-1">
                                                    {module.videos?.length || 0} video{(module.videos?.length || 0) !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={selectedModuleIndex === moduleIndex ? "default" : "outline"}
                                                    onClick={() => setSelectedModuleIndex(moduleIndex)}
                                                >
                                                    {selectedModuleIndex === moduleIndex ? "Selected" : "Select"}
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeModule(moduleIndex)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Videos in this module */}
                                        {module.videos && module.videos.length > 0 && (
                                            <div className="space-y-2 mt-3">
                                                {module.videos.map((video: any, videoIndex: number) => (
                                                    <div key={videoIndex} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                                                        <div>
                                                            <p className="text-white font-medium">{video.title}</p>
                                                            <p className="text-gray-400 text-sm">{video.duration}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVideoFromModule(moduleIndex, videoIndex)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Video to Selected Module */}
                        {formData.modules.length > 0 && (
                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 mt-4">
                                <h3 className="text-white font-medium mb-3">
                                    Add Video to: {formData.modules[selectedModuleIndex]?.title || "Module"}
                                </h3>
                                <div className="space-y-3">
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
                                        <Button type="button" onClick={addVideoToModule}>
                                            <Plus size={20} className="mr-2" />
                                            Add by URL
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.modules.length === 0 && (
                            <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-white/10">
                                <p>No modules created yet. Create your first module to add videos!</p>
                            </div>
                        )}
                    </div>

                    {/* PDF Resources */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">PDF Resources</label>
                        <div className="space-y-3 mb-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                                <FileText size={18} className="text-blue-400" />
                                Add New PDF
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="PDF Title"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                    value={pdfInput.title}
                                    onChange={(e) => setPdfInput({ ...pdfInput, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                    value={pdfInput.description}
                                    onChange={(e) => setPdfInput({ ...pdfInput, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">After Module #</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0 = Before all modules"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                        value={pdfInput.afterModule}
                                        onChange={(e) => setPdfInput({ ...pdfInput, afterModule: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Order in Position</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Sequence number"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                        value={pdfInput.order}
                                        onChange={(e) => setPdfInput({ ...pdfInput, order: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePDFUpload}
                                    disabled={uploadingPdf}
                                    className="hidden"
                                    id="pdf-file-input"
                                />
                                <label
                                    htmlFor="pdf-file-input"
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${uploadingPdf
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        } text-white w-full`}
                                >
                                    {uploadingPdf ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Uploading PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            Select PDF File (Max 100MB)
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            {pdfs.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No PDF resources added yet</p>
                            )}
                            {pdfs.map((pdf) => (
                                <div key={pdf._id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-red-500/20 p-2 rounded-lg">
                                            <FileText size={20} className="text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{pdf.title}</p>
                                            <p className="text-gray-400 text-xs">
                                                {pdf.fileName} • {(pdf.fileSize / (1024 * 1024)).toFixed(2)} MB
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Position: After Module {pdf.afterModule} • Order: {pdf.order}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a 
                                            href={pdf.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="View PDF"
                                        >
                                            <FileText size={18} />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePDF(pdf._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete PDF"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
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
                            onClick={() => router.push("/admin/courses")}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
