"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    ArrowLeft, Plus, X, Upload, Image, FileText, Trash2, Video, 
    DollarSign, Users, Clock, Tag, Layers, CheckCircle, PenTool, Loader2 
} from "lucide-react";
import Link from "next/link";
import { uploadFile, uploadPDFToCloudinary } from "@/lib/upload-utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SignaturesSection } from "@/components/admin/course-edit/SignaturesSection";

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
        gstPercentage: 0,
        studentsCount: "0",
        language: "English/Hindi",
        promoVideoUrl: "",
        promoVideoDuration: "",
        lastUpdatedDate: "",
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
        collaborations: [] as { name: string, logo?: string, website?: string }[],
        signatures: {
            founder: { name: "Mohit Sinha", title: "Founder & CEO" },
            director: { name: "Vijay Kumar", title: "Director of Education, Webory", credential: "Alumnus, IIT Mandi" },
            partner: { name: "Partner Rep.", title: "Authorized Signatory" }
        },
        isAvailable: true,
        isFree: false
    });

    const [curriculumInput, setCurriculumInput] = useState("");
    const [benefitsInput, setBenefitsInput] = useState("");
    const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
    const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });
    const [editingVideo, setEditingVideo] = useState<{moduleIndex: number, videoIndex: number} | null>(null);
    const [editingModule, setEditingModule] = useState<number | null>(null);

    // Auto-calculate price when originalPrice or discountPercentage changes
    useEffect(() => {
        const calculatedPrice = formData.originalPrice - (formData.originalPrice * formData.discountPercentage) / 100;
        setFormData(prev => ({ ...prev, price: Math.round(calculatedPrice) }));
    }, [formData.originalPrice, formData.discountPercentage]);
    
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
                    ...data.course,
                    modules: modules,
                    collaboration: data.course.collaboration || "",
                    collaborations: data.course.collaborations || [],
                    signatures: data.course.signatures || {
                        founder: { name: "Mohit Sinha", title: "Founder & CEO" },
                        director: { name: "Vijay Kumar", title: "Director of Education, Webory", credential: "Alumnus, IIT Mandi" },
                        partner: { name: "Partner Rep.", title: "Authorized Signatory" }
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/courses/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Course updated successfully!");
                await fetchCourse();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update course");
            }
        } catch (error) {
            console.error("Update course error:", error);
            toast.error("Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    const updateSignature = (role: string, field: string, value: string) => {
        setFormData({
            ...formData,
            signatures: {
                ...formData.signatures,
                [role]: {
                    ...formData.signatures[role as keyof typeof formData.signatures],
                    [field]: value
                }
            }
        });
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

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File too large! Maximum size is 5MB.");
            return;
        }

        setUploadingThumbnail(true);
        try {
            const data = await uploadFile(file, "/api/upload/image");
            setFormData((prev) => ({ ...prev, thumbnail: data.url }));
            toast.success("Thumbnail uploaded successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload thumbnail");
        } finally {
            setUploadingThumbnail(false);
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
                toast.success("Certificate image uploaded!");
            }
        } catch (error: any) {
            toast.error(error.message || "Certificate upload failed");
        } finally {
            setUploadingCertificate(false);
        }
    };

    const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!videoInput.title) {
            toast.error("Please enter video title first");
            return;
        }

        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File too large! Max 500MB.");
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
                newModules.push({ title: "Course Content", description: "All videos", order: 0, videos: [] });
                setSelectedModuleIndex(0);
            }
            
            if (!newModules[selectedModuleIndex].videos) {
                newModules[selectedModuleIndex].videos = [];
            }
            
            newModules[selectedModuleIndex].videos.push({
                title: videoInput.title,
                url: data.url,
                duration: videoInput.duration || Math.floor(data.duration || 0).toString() + "s",
            });

            setFormData((prev) => ({ ...prev, modules: newModules }));
            setVideoInput({ title: "", url: "", duration: "" });
            toast.success("Video uploaded!");
        } catch (error: any) {
            toast.error(error.message || "Upload failed");
        } finally {
            setUploadingVideo(false);
            setUploadProgress(0);
        }
    };

    const removeVideoFromModule = (moduleIndex: number, videoIndex: number) => {
        const newModules = [...formData.modules];
        newModules[moduleIndex].videos = newModules[moduleIndex].videos.filter((_, i) => i !== videoIndex);
        setFormData({ ...formData, modules: newModules });
    };

    const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!pdfInput.title) {
            toast.error("Please enter PDF title first");
            return;
        }

        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File too large! Max 100MB.");
            return;
        }

        setUploadingPdf(true);
        setUploadProgress(0);

        try {
            const targetModule = Number(pdfInput.afterModule);
            const existingInModule = pdfs.filter(p => (p.afterModule || 0) === targetModule);
            const maxOrder = existingInModule.reduce((max, p) => Math.max(max, p.order || 0), 0);
            const nextOrder = maxOrder + 1;
            
            const uploadData = await uploadPDFToCloudinary(file);
            const res = await fetch(`/api/admin/courses/${params?.id}/pdfs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: pdfInput.title,
                    description: pdfInput.description,
                    fileUrl: uploadData.url,
                    fileName: uploadData.fileName,
                    fileSize: uploadData.fileSize,
                    afterModule: targetModule,
                    order: nextOrder,
                    cloudinaryId: uploadData.cloudinaryId
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPdfs([...pdfs, data.pdf]);
                setPdfInput({ title: "", description: "", afterModule: 0, order: 0 });
                toast.success("PDF uploaded!");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to upload PDF");
        } finally {
            setUploadingPdf(false);
            setUploadProgress(0);
        }
    };

    const handleDeletePDF = async (pdfId: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/pdfs/${pdfId}`, { method: "DELETE" });
            if (res.ok) {
                setPdfs(pdfs.filter(p => p._id !== pdfId));
                toast.success("PDF deleted");
            }
        } catch (error) {
            toast.error("Failed to delete PDF");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white">Loading course data...</p>
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
                        onClick={() => handleSubmit()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 px-8 py-6 rounded-xl font-medium text-lg transition-all transform hover:scale-[1.02]"
                    >
                        {saving ? "Saving..." : (
                            <span className="flex items-center gap-2">
                                <CheckCircle size={20} />
                                Update Course
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            <form className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN */}
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all text-lg"
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all resize-y"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Detailed description..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-400 font-medium mb-2 block">Level *</label>
                                        <select
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500/50 outline-none appearance-none"
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
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500/50"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="e.g. 10h 30m"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 font-medium mb-2 block">Students Enrolled</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500/50"
                                            value={formData.studentsCount}
                                            onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                                            placeholder="e.g. 500+"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 font-medium mb-2 block">Language</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500/50"
                                            value={formData.language}
                                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            placeholder="e.g. English/Hindi"
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
                                <div>
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">What will be learned?</label>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none"
                                            value={curriculumInput}
                                            onChange={(e) => setCurriculumInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCurriculumItem())}
                                        />
                                        <Button type="button" onClick={addCurriculumItem} className="bg-purple-600 p-3 rounded-xl"><Plus size={20} /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.curriculum.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full">
                                                <span className="text-purple-200 text-sm">{item}</span>
                                                <button type="button" onClick={() => removeCurriculumItem(index)} className="text-purple-400"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <label className="text-sm text-gray-400 font-medium mb-2 block">Benefits & Outcomes *</label>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500/50 outline-none"
                                            value={benefitsInput}
                                            onChange={(e) => setBenefitsInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefitsItem())}
                                            placeholder="e.g. Master React.js basics"
                                        />
                                        <Button type="button" onClick={addBenefitsItem} className="bg-emerald-600 p-3 rounded-xl"><Plus size={20} /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.benefits.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                                                <span className="text-emerald-200 text-sm">{item}</span>
                                                <button type="button" onClick={() => removeBenefitsItem(index)} className="text-emerald-400"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signatures & Partnerships Section */}
                        <SignaturesSection 
                            formData={formData} 
                            setFormData={setFormData}
                        />

                        {/* 3. Modules & Content */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <Video size={20} />
                                </div>
                                Course Content
                            </h2>
                            <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 mb-8">
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <input type="text" placeholder="Module Title" className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white" value={moduleInput.title} onChange={(e) => setModuleInput({...moduleInput, title: e.target.value})} />
                                    <input type="text" placeholder="Description" className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white" value={moduleInput.description} onChange={(e) => setModuleInput({...moduleInput, description: e.target.value})} />
                                </div>
                                <Button type="button" onClick={addModule} className="w-full bg-indigo-600">Create Module</Button>
                            </div>
                            <div className="space-y-6">
                                {formData.modules.map((module, mIdx) => (
                                    <div key={mIdx} className={`bg-black/40 border ${selectedModuleIndex === mIdx ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-white/10'} rounded-2xl overflow-hidden transition-all duration-300`}>
                                        
                                        {/* Module Header */}
                                        <div className="p-5 flex items-start justify-between bg-white/5 border-b border-white/5">
                                            <div className="flex-1 mr-4">
                                                 {editingModule === mIdx ? (
                                                    <div className="space-y-3">
                                                        <input
                                                            type="text"
                                                            value={module.title}
                                                            onChange={(e) => {
                                                                const newModules = [...formData.modules];
                                                                newModules[mIdx].title = e.target.value;
                                                                setFormData({ ...formData, modules: newModules });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-bold text-lg focus:border-indigo-500/50 outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={module.description || ""}
                                                            onChange={(e) => {
                                                                const newModules = [...formData.modules];
                                                                newModules[mIdx].description = e.target.value;
                                                                setFormData({ ...formData, modules: newModules });
                                                            }}
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-300 text-sm focus:border-indigo-500/50 outline-none"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="bg-white/10 text-gray-400 text-xs px-2 py-0.5 rounded font-mono">Module {mIdx + 1}</span>
                                                            <h3 className="text-white font-bold text-lg">{module.title}</h3>
                                                        </div>
                                                        <p className="text-gray-400 text-sm">{module.description}</p>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingModule(editingModule === mIdx ? null : mIdx)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit Module Info"
                                                >
                                                    {editingModule === mIdx ? <CheckCircle size={18} className="text-green-500"/> : <Tag size={18} />}
                                                </button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={selectedModuleIndex === mIdx ? "secondary" : "ghost"}
                                                    className={selectedModuleIndex === mIdx ? "bg-indigo-500 text-white hover:bg-indigo-600 border-none" : "hover:text-white hover:bg-white/10"}
                                                    onClick={() => setSelectedModuleIndex(mIdx)}
                                                >
                                                    {selectedModuleIndex === mIdx ? "Adding Videos..." : "Select to Add"}
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeModule(mIdx)}
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
                                                    {module.videos.map((video: any, vIdx: number) => (
                                                        <div key={vIdx} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                                                             <div className="flex items-center gap-3 flex-1">
                                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                                    <Video size={14} />
                                                                </div>
                                                                
                                                                {editingVideo?.moduleIndex === mIdx && editingVideo?.videoIndex === vIdx ? (
                                                                    <div className="flex-1 space-y-2 mr-4">
                                                                        <input
                                                                            type="text"
                                                                            value={formData.modules[mIdx].videos[vIdx].title}
                                                                            onChange={(e) => {
                                                                                const newModules = [...formData.modules];
                                                                                newModules[mIdx].videos[vIdx].title = e.target.value;
                                                                                setFormData({ ...formData, modules: newModules });
                                                                            }}
                                                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm"
                                                                        />
                                                                        <div className="flex gap-2">
                                                                             <input
                                                                                type="text"
                                                                                value={formData.modules[mIdx].videos[vIdx].url}
                                                                                onChange={(e) => {
                                                                                    const newModules = [...formData.modules];
                                                                                    newModules[mIdx].videos[vIdx].url = e.target.value;
                                                                                    setFormData({ ...formData, modules: newModules });
                                                                                }}
                                                                                className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-gray-400 text-xs"
                                                                            />
                                                                             <input
                                                                                type="text"
                                                                                value={formData.modules[mIdx].videos[vIdx].duration}
                                                                                onChange={(e) => {
                                                                                    const newModules = [...formData.modules];
                                                                                    newModules[mIdx].videos[vIdx].duration = e.target.value;
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
                                                                {editingVideo?.moduleIndex === mIdx && editingVideo?.videoIndex === vIdx ? (
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
                                                                        onClick={() => setEditingVideo({moduleIndex: mIdx, videoIndex: vIdx})}
                                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
                                                                    >
                                                                        <Tag size={16} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeVideoFromModule(mIdx, vIdx)}
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
                            {formData.modules.length > 0 && (
                                 <div className="sticky bottom-4 mt-6 z-20 glass-card bg-black/80 backdrop-blur-2xl border border-indigo-500/30 p-5 rounded-2xl shadow-2xl shadow-black/50">
                                    <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                                        Add Video to: <span className="text-indigo-400 font-bold">{formData.modules[selectedModuleIndex]?.title || "Select a Module"}</span>
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="Video Title" className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={videoInput.title} onChange={(e) => setVideoInput({...videoInput, title: e.target.value})} />
                                            <input type="text" placeholder="Duration" className="w-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={videoInput.duration} onChange={(e) => setVideoInput({...videoInput, duration: e.target.value})} />
                                        </div>
                                        <div className="flex gap-4">
                                            <input type="url" placeholder="Video URL..." className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={videoInput.url} onChange={(e) => setVideoInput({...videoInput, url: e.target.value})} />
                                            <Button type="button" onClick={() => addVideoToModule()} className="bg-indigo-600">Add</Button>
                                            <label className="bg-emerald-600 px-6 py-3 rounded-xl cursor-pointer text-white flex items-center gap-2">
                                                {uploadingVideo ? <Loader2 className="animate-spin" size={18}/> : <Upload size={18}/>}
                                                Upload <input type="file" className="hidden" accept="video/*" onChange={handleVideoFileUpload} disabled={uploadingVideo} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">
                        {/* 4. Status & Visibility (Admin Specific) */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center">
                                    <CheckCircle size={18} />
                                </div>
                                Status & Visibility
                            </h3>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-gray-300 text-sm">Course Visible</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                                    className={`w-12 h-6 rounded-full relative transition-all ${formData.isAvailable ? 'bg-green-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAvailable ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 mt-3">
                                <span className="text-gray-300 text-sm">Free Course</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isFree: !formData.isFree })}
                                    className={`w-12 h-6 rounded-full relative transition-all ${formData.isFree ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFree ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* 5. Pricing & GST (Admin Specific) */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                    <DollarSign size={18} />
                                </div>
                                Pricing & GST
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Original Price (₹)</label>
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Discount (%)</label>
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.discountPercentage} onChange={(e) => setFormData({...formData, discountPercentage: Number(e.target.value)})} />
                                </div>
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1">Final Price After Discount</p>
                                    <p className="text-xl font-black text-white">₹{formData.price}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">GST (%)</label>
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.gstPercentage} onChange={(e) => setFormData({...formData, gstPercentage: Number(e.target.value)})} />
                                </div>
                                <div className="h-px bg-white/5 w-full"/>
                                <div>
                                    <label className="text-sm text-gray-400 mb-2 block font-medium">Actual Price (Final)</label>
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-2xl font-mono font-bold" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                                </div>
                            </div>
                        </div>

                        {/* 6. Media Assets */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400"><Image size={18} /></div>
                                Media Assets
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block font-bold uppercase">Thumbnail</label>
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center bg-black/40">
                                        {formData.thumbnail ? <img src={formData.thumbnail} alt="thumb" className="w-full h-full object-cover" /> : <Image size={32} className="text-gray-600"/>}
                                        <label htmlFor="thumb-up" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"><Upload size={24} className="text-white"/></label>
                                        <input type="file" id="thumb-up" className="hidden" accept="image/*" onChange={handleThumbnailUpload} disabled={uploadingThumbnail} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-2 block font-bold uppercase">Certificate Mockup</label>
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center bg-black/40">
                                        {formData.certificateImage ? <img src={formData.certificateImage} alt="cert" className="w-full h-full object-contain" /> : <FileText size={32} className="text-gray-600"/>}
                                        <label htmlFor="cert-up" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"><Upload size={24} className="text-white"/></label>
                                        <input type="file" id="cert-up" className="hidden" accept="image/*" onChange={handleCertificateUpload} disabled={uploadingCertificate} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 7. PDF Resources */}
                        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><FileText size={18} /></div>
                                PDF Resources
                            </h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Title" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white" value={pdfInput.title} onChange={(e) => setPdfInput({...pdfInput, title: e.target.value})} />
                                <div className="flex gap-2">
                                    <select className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white" value={pdfInput.afterModule} onChange={(e) => setPdfInput({...pdfInput, afterModule: Number(e.target.value)})}>
                                        <option value={0} className="bg-gray-900">Immediately</option>
                                        {formData.modules.map((_, i) => <option key={i} value={i+1} className="bg-gray-900">Module {i+1}</option>)}
                                    </select>
                                    <label className="p-2 bg-red-500/20 text-red-400 rounded-lg cursor-pointer">{uploadingPdf ? "..." : <Upload size={14}/>}<input type="file" className="hidden" accept=".pdf" onChange={handlePDFUpload}/></label>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {pdfs.map((p) => (
                                        <div key={p._id} className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-xs">
                                            <span className="text-white truncate">{p.title}</span>
                                            <button type="button" onClick={() => handleDeletePDF(p._id)} className="text-red-500"><Trash2 size={12}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
