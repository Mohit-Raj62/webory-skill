"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Upload, Image, FileText, Trash2, Video, DollarSign, Users, Clock, Tag, Layers, CheckCircle } from "lucide-react";
import Link from "next/link";
import { uploadFile, uploadPDFToCloudinary } from "@/lib/upload-utils";
import { motion, AnimatePresence } from "framer-motion";

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingCertificate, setUploadingCertificate] = useState(false);
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
        certificateImage: "",
        curriculum: [] as string[],
        benefits: [] as string[],
        modules: [] as {
            title: string;
            description: string;
            order: number;
            videos: { title: string; url: string; duration: string }[];
        }[],
        collaboration: "",
        signatures: {
            founder: { name: "Mohit Raj", title: "Founder & CEO" },
            director: { name: "Webory Team", title: "Director of Education" },
            partner: { name: "Partner Rep.", title: "Authorized Signatory" }
        },
        isAvailable: true
    });

    const [curriculumInput, setCurriculumInput] = useState("");
    const [benefitsInput, setBenefitsInput] = useState("");
    const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
    const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });
    const [editingVideo, setEditingVideo] = useState<{moduleIndex: number, videoIndex: number} | null>(null);
    const [editingModule, setEditingModule] = useState<number | null>(null);
    
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
            const res = await fetch(`/api/courses/${params.id}?includeUnavailable=true`);
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
                    certificateImage: data.course.certificateImage || "",
                    curriculum: data.course.curriculum || [],
                    benefits: data.course.benefits || [],
                    modules: modules,
                    collaboration: data.course.collaboration || "",
                    signatures: {
                        founder: data.course.signatures?.founder || { name: "Mohit Raj", title: "Founder & CEO" },
                        director: data.course.signatures?.director || { name: "Webory Team", title: "Director of Education" },
                        partner: data.course.signatures?.partner || { name: "Partner Rep.", title: "Authorized Signatory" }
                    },
                    isAvailable: data.course.isAvailable ?? true
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

    const addBenefitsItem = () => {
        if (benefitsInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                benefits: [...prev.benefits, benefitsInput.trim()],
            }));
            setBenefitsInput("");
        }
    };

    const removeBenefitsItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index),
        }));
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

    const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCertificate(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, certificateImage: data.url }));
                alert("Certificate image uploaded successfully!");
            }
        } catch (error: any) {
            console.error("Certificate upload failed", error);
            alert(error.message || "Certificate upload failed");
        } finally {
            setUploadingCertificate(false);
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
            // Calculate next order for this module
            const targetModule = Number(pdfInput.afterModule);
            const existingInModule = pdfs.filter(p => (p.afterModule || 0) === targetModule);
            const maxOrder = existingInModule.reduce((max, p) => Math.max(max, p.order || 0), 0);
            const nextOrder = maxOrder + 1;
            
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
                    order: nextOrder,
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
            <div className="min-h-screen flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-lg font-medium">Loading course data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/admin/courses">
                        <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Courses
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Edit Course</h1>
                    <p className="text-gray-400 text-lg">Update course details and content management</p>
                </div>
                <div className="flex gap-3">
                     <Button
                        type="submit"
                        disabled={saving}
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 px-8 py-6 rounded-xl font-medium text-lg transition-all transform hover:scale-[1.02]"
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CheckCircle size={20} />
                                Update Course
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN - MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Basic Information */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Tag size={20} />
                                </div>
                                Basic Information
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Course Title *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 text-lg"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Full Stack Web Development"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Description *</label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 resize-y"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed description of the course..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-400 font-medium mb-2 block">Level *</label>
                                        <select
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500/50 outline-none transition-all focus:bg-white/10 appearance-none cursor-pointer"
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        >
                                            <option value="Beginner" className="bg-gray-900">Beginner</option>
                                            <option value="Intermediate" className="bg-gray-900">Intermediate</option>
                                            <option value="Advanced" className="bg-gray-900">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 font-medium mb-2 block">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 10h 30m"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Curriculum & Benefits */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                    <Layers size={20} />
                                </div>
                                Curriculum & Benefits
                            </h2>
                            
                            <div className="space-y-8">
                                {/* Topics */}
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">What will be learned?</label>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Add a topic and press Enter"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-purple-500/50 outline-none transition-all"
                                            value={curriculumInput}
                                            onChange={(e) => setCurriculumInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCurriculumItem())}
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={addCurriculumItem}
                                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl aspect-square"
                                        >
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <AnimatePresence>
                                            {(formData.curriculum || []).map((item, index) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    key={index} 
                                                    className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full"
                                                >
                                                    <span className="text-purple-200 text-sm">{item}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCurriculumItem(index)}
                                                        className="text-purple-400 hover:text-red-400 transition-colors bg-black/20 rounded-full p-0.5"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full my-6"/>

                                {/* Benefits */}
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Key Benefits</label>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Add a benefit and press Enter"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-green-500/50 outline-none transition-all"
                                            value={benefitsInput}
                                            onChange={(e) => setBenefitsInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefitsItem())}
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={addBenefitsItem}
                                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl aspect-square"
                                        >
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <AnimatePresence>
                                            {formData.benefits.map((item, index) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    key={index} 
                                                    className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-white/10 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle size={16} className="text-green-500" />
                                                        <span className="text-gray-200">{item}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBenefitsItem(index)}
                                                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Modules & Content */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <Video size={20} />
                                </div>
                                Course Content
                            </h2>

                            {/* Add Module Box */}
                            <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 mb-8 hover:border-indigo-500/20 transition-all">
                                <h3 className="text-indigo-200 font-medium mb-4 flex items-center gap-2">
                                    Add New Module
                                </h3>
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Module Title"
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none"
                                        value={moduleInput.title}
                                        onChange={(e) => setModuleInput({ ...moduleInput, title: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (Optional)"
                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none"
                                        value={moduleInput.description}
                                        onChange={(e) => setModuleInput({ ...moduleInput, description: e.target.value })}
                                    />
                                </div>
                                <Button 
                                    type="button" 
                                    onClick={addModule} 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Create Module
                                </Button>
                            </div>

                            {/* Modules List */}
                            <div className="space-y-6">
                                {formData.modules.map((module, moduleIndex) => (
                                    <div key={moduleIndex} className={`bg-black/40 border ${selectedModuleIndex === moduleIndex ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-white/10'} rounded-2xl overflow-hidden transition-all duration-300`}>
                                        
                                        {/* Module Header */}
                                        <div className="p-5 flex items-start justify-between bg-white/5 border-b border-white/5">
                                            <div className="flex-1 mr-4">
                                                 {editingModule === moduleIndex ? (
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            value={module.title}
                                                            onChange={(e) => {
                                                                const newModules = [...formData.modules];
                                                                newModules[moduleIndex].title = e.target.value;
                                                                setFormData({ ...formData, modules: newModules });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-lg focus:border-indigo-500/50 outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={module.description || ""}
                                                            onChange={(e) => {
                                                                const newModules = [...formData.modules];
                                                                newModules[moduleIndex].description = e.target.value;
                                                                setFormData({ ...formData, modules: newModules });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-300 text-sm focus:border-indigo-500/50 outline-none"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="bg-white/10 text-gray-400 text-xs px-2 py-0.5 rounded font-mono">Module {moduleIndex + 1}</span>
                                                            <h3 className="text-white font-bold text-lg">{module.title}</h3>
                                                        </div>
                                                        <p className="text-gray-400 text-sm">{module.description}</p>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingModule(editingModule === moduleIndex ? null : moduleIndex)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit Module Info"
                                                >
                                                    {editingModule === moduleIndex ? <CheckCircle size={18} className="text-green-500"/> : <Tag size={18} />}
                                                </button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={selectedModuleIndex === moduleIndex ? "secondary" : "ghost"}
                                                    className={selectedModuleIndex === moduleIndex ? "bg-indigo-500 text-white hover:bg-indigo-600 border-none" : "hover:text-white hover:bg-white/10"}
                                                    onClick={() => setSelectedModuleIndex(moduleIndex)}
                                                >
                                                    {selectedModuleIndex === moduleIndex ? "Adding Videos..." : "Select to Add"}
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeModule(moduleIndex)}
                                                    className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Videos inside Module */}
                                        <div className="p-4 bg-black/20">
                                            {(!module.videos || module.videos.length === 0) ? (
                                                <div className="text-center py-6 text-gray-600 text-sm italic">
                                                    No videos in this module yet. Select this module to add videos.
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {module.videos.map((video: any, videoIndex: number) => (
                                                        <div key={videoIndex} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                                                             <div className="flex items-center gap-3 flex-1">
                                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                    <Video size={14} />
                                                                </div>
                                                                
                                                                {editingVideo?.moduleIndex === moduleIndex && editingVideo?.videoIndex === videoIndex ? (
                                                                    <div className="flex-1 space-y-2 mr-4">
                                                                        <input
                                                                            type="text"
                                                                            value={formData.modules[moduleIndex].videos[videoIndex].title}
                                                                            onChange={(e) => {
                                                                                const newModules = [...formData.modules];
                                                                                newModules[moduleIndex].videos[videoIndex].title = e.target.value;
                                                                                setFormData({ ...formData, modules: newModules });
                                                                            }}
                                                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                                                        />
                                                                        <div className="flex gap-2">
                                                                             <input
                                                                                type="text"
                                                                                value={formData.modules[moduleIndex].videos[videoIndex].url}
                                                                                onChange={(e) => {
                                                                                    const newModules = [...formData.modules];
                                                                                    newModules[moduleIndex].videos[videoIndex].url = e.target.value;
                                                                                    setFormData({ ...formData, modules: newModules });
                                                                                }}
                                                                                className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-gray-400 text-xs"
                                                                            />
                                                                             <input
                                                                                type="text"
                                                                                value={formData.modules[moduleIndex].videos[videoIndex].duration}
                                                                                onChange={(e) => {
                                                                                    const newModules = [...formData.modules];
                                                                                    newModules[moduleIndex].videos[videoIndex].duration = e.target.value;
                                                                                    setFormData({ ...formData, modules: newModules });
                                                                                }}
                                                                                className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-gray-400 text-xs"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <p className="text-gray-200 font-medium text-sm">{video.title}</p>
                                                                        <div className="flex items-center gap-3 mt-1">
                                                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                                <Clock size={10} /> {video.duration}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                             </div>

                                                             <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {editingVideo?.moduleIndex === moduleIndex && editingVideo?.videoIndex === videoIndex ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setEditingVideo(null)}
                                                                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg"
                                                                    >
                                                                        <CheckCircle size={16} />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setEditingVideo({moduleIndex, videoIndex})}
                                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                                                                    >
                                                                        <Tag size={16} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeVideoFromModule(moduleIndex, videoIndex)}
                                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                             </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Sticky Add Video Bar */}
                            {formData.modules.length > 0 && (
                                <div className="sticky bottom-4 mt-6 z-20">
                                    <div className="glass-card bg-black/80 backdrop-blur-2xl border border-indigo-500/30 p-5 rounded-2xl shadow-2xl shadow-black/50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-white font-medium flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                                                Add Video to: <span className="text-indigo-400 font-bold">{formData.modules[selectedModuleIndex]?.title || "Select a Module"}</span>
                                            </h3>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Video Title"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none"
                                                    value={videoInput.title}
                                                    onChange={(e) => setVideoInput({ ...videoInput, title: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Duration"
                                                    className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none"
                                                    value={videoInput.duration}
                                                    onChange={(e) => setVideoInput({ ...videoInput, duration: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="url"
                                                        placeholder="Paste Video URL..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none pr-12"
                                                        value={videoInput.url}
                                                        onChange={(e) => setVideoInput({ ...videoInput, url: e.target.value })}
                                                    />
                                                    <Button 
                                                        type="button" 
                                                        onClick={(e) => addVideoToModule(e)}
                                                        className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-700 h-auto rounded-lg px-4"
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
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
                                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all ${uploadingVideo
                                                            ? "bg-gray-700 cursor-not-allowed"
                                                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                                                            } text-white font-medium shadow-lg`}
                                                    >
                                                        {uploadingVideo ? (
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                                        ) : (
                                                            <Upload size={18} />
                                                        )}
                                                        Upload
                                                    </label>
                                                </div>
                                            </div>
                                            
                                             {/* Upload Progress Bar */}
                                            {uploadingVideo && uploadProgress > 0 && (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-400">Uploading...</span>
                                                        <span className="text-emerald-400">{Math.round(uploadProgress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-out"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-8">
                        
                        {/* 4. Pricing & Signatures */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <DollarSign size={18} />
                                </div>
                                Pricing & Details
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500/50 outline-none text-2xl font-bold font-mono"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Original (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-gray-400 focus:border-green-500/50 outline-none"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Discount %</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-gray-400 focus:border-green-500/50 outline-none"
                                            value={formData.discountPercentage}
                                            onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full"/>

                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Students Count</label>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="e.g. 10k+"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                            value={formData.studentsCount}
                                            onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-all">
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isAvailable ? 'bg-green-500' : 'bg-gray-600'}`}>
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.isAvailable ? 'left-6' : 'left-1'}`}/>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.isAvailable}
                                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        />
                                        <div>
                                            <span className="text-white block font-medium">Available</span>
                                            <span className="text-xs text-gray-500">Visible to students</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* 5. Images & Certificates */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                                    <Image size={18} />
                                </div>
                                Media Assets
                            </h2>
                            
                            <div className="space-y-6">
                                {/* Thumbnail */}
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Course Thumbnail</label>
                                    <div className="relative group bg-black/40 rounded-xl aspect-video border border-white/10 overflow-hidden flex items-center justify-center">
                                        {formData.thumbnail ? (
                                            <>
                                                <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label htmlFor="thumb-upload" className="cursor-pointer p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                                        <Upload size={20} />
                                                    </label>
                                                    <button type="button" onClick={() => setFormData({...formData, thumbnail: ""})} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400">
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label htmlFor="thumb-upload" className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-white transition-colors">
                                                <Image size={32} />
                                                <span className="text-xs">Upload Thumbnail</span>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="thumb-upload"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            disabled={uploadingThumbnail}
                                            className="hidden"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Or paste URL..."
                                        className="mt-3 w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:border-orange-500/50 outline-none"
                                        value={formData.thumbnail}
                                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    />
                                </div>

                                <div className="h-px bg-white/5 w-full"/>

                                {/* Certificate Image */}
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Certificate Template</label>
                                    <div className="relative group bg-black/40 rounded-xl aspect-[4/3] border border-white/10 overflow-hidden flex items-center justify-center">
                                         {formData.certificateImage ? (
                                            <>
                                                <img src={formData.certificateImage} alt="Cert" className="w-full h-full object-contain" />
                                                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label htmlFor="cert-upload" className="cursor-pointer p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                                                        <Upload size={20} />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                             <label htmlFor="cert-upload" className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-white transition-colors">
                                                <FileText size={32} />
                                                <span className="text-xs">Upload Certificate</span>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="cert-upload"
                                            accept="image/*"
                                            onChange={handleCertificateUpload}
                                            disabled={uploadingCertificate}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* PDF Resources */}
                         <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                                    <FileText size={18} />
                                </div>
                                PDF Resources
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <input
                                        type="text"
                                        placeholder="Resource Title"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-red-500/50 outline-none mb-2"
                                        value={pdfInput.title}
                                        onChange={(e) => setPdfInput({ ...pdfInput, title: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-red-500/50 cursor-pointer"
                                            value={pdfInput.afterModule}
                                            onChange={(e) => setPdfInput({ ...pdfInput, afterModule: Number(e.target.value) })}
                                        >
                                            <option value={0} className="bg-gray-900 text-white">Global Resource</option>
                                            {formData.modules.map((m, i) => (
                                                <option key={i} value={i + 1} className="bg-gray-900 text-white">Mod {i+1}</option>
                                            ))}
                                        </select>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="pdf-upload"
                                                accept="application/pdf"
                                                onChange={handlePDFUpload}
                                                disabled={uploadingPdf}
                                                className="hidden"
                                            />
                                            <label 
                                                htmlFor="pdf-upload"
                                                className="block px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs cursor-pointer"
                                            >
                                                {uploadingPdf ? "..." : <Upload size={14}/>}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {pdfs.map((pdf) => (
                                        <div key={pdf._id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5 hover:border-white/10">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText size={14} className="text-red-400 flex-shrink-0" />
                                                <div className="truncate">
                                                    <p className="text-white text-xs truncate font-medium">{pdf.title}</p>
                                                    <p className="text-gray-500 text-[10px]">{(pdf.fileSize / 1024 / 1024).toFixed(1)}MB</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePDF(pdf._id)}
                                                className="text-gray-500 hover:text-red-400 p-1"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {pdfs.length === 0 && <p className="text-center text-gray-600 text-xs">No PDFs uploaded</p>}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
}
