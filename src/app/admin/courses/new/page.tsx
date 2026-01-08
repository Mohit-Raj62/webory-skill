"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Upload, Image } from "lucide-react";
import Link from "next/link";
import { uploadFile } from "@/lib/upload-utils";

export default function NewCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        videos: [] as { title: string; url: string; duration: string }[],
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
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Course created successfully!");
                router.push("/admin/courses");
            } else {
                alert("Failed to create course");
            }
        } catch (error) {
            console.error("Create course error:", error);
            alert("Failed to create course");
        } finally {
            setLoading(false);
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
            setFormData({
                ...formData,
                benefits: [...formData.benefits, benefitsInput.trim()],
            });
            setBenefitsInput("");
        }
    };

    const removeBenefitsItem = (index: number) => {
        setFormData({
            ...formData,
            benefits: formData.benefits.filter((_, i) => i !== index),
        });
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingThumbnail(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const res = await fetch("/api/upload/image", {
                method: "POST",
                body: uploadFormData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, thumbnail: data.url }));
                alert("Thumbnail uploaded successfully!");
            } else {
                alert("Failed to upload thumbnail");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload thumbnail");
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
            } else {
                alert("Failed to upload certificate image");
            }
        } catch (error) {
            console.error("Certificate upload failed", error);
            alert("Certificate upload failed");
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

    const addVideoByUrl = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (!videoInput.title || !videoInput.url) {
            alert("Please fill in both video title and URL");
            return;
        }

        setFormData({
            ...formData,
            videos: [...formData.videos, { ...videoInput }],
        });
        setVideoInput({ title: "", url: "", duration: "" });
    };

    const removeVideo = (index: number) => {
        setFormData({
            ...formData,
            videos: formData.videos.filter((_, i) => i !== index),
        });
    };

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
                <h1 className="text-4xl font-bold text-white mb-2">Add New Course</h1>
                <p className="text-gray-400">Create a new course with videos and curriculum</p>
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

                        <div className="md:col-span-2">
                             <label className="text-sm text-gray-300 block mb-2">Collaboration (Optional)</label>
                             <input
                                type="text"
                                placeholder="e.g. In Partnership with College"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.collaboration}
                                onChange={(e) => setFormData({ ...formData, collaboration: e.target.value })}
                            />
                            <p className="text-xs text-gray-400 mt-1">This text will appear on the student certificate.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-white/10 bg-black/20 text-blue-500 focus:ring-blue-500/50"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                />
                                <span className="text-gray-300">Available for Students</span>
                            </label>
                            <p className="text-xs text-gray-400 mt-1 ml-7">
                                If unchecked, this course will be hidden from the student course list.
                            </p>
                        </div>
                    </div>

                    {/* Certificate Signatures Section */}
                    <div className="border-t border-white/10 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Certificate Signatures</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Founder */}
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Signature 1 (Left)</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Mohit Raj)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm"
                                        value={formData.signatures.founder.name}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            signatures: { ...formData.signatures, founder: { ...formData.signatures.founder, name: e.target.value } } 
                                        })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title (e.g. Founder & CEO)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm"
                                        value={formData.signatures.founder.title}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            signatures: { ...formData.signatures, founder: { ...formData.signatures.founder, title: e.target.value } } 
                                        })}
                                    />
                                </div>
                            </div>
                            
                            {/* Director */}
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Signature 2 (Right/Center)</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Name (e.g. Webory Team)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm"
                                        value={formData.signatures.director.name}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            signatures: { ...formData.signatures, director: { ...formData.signatures.director, name: e.target.value } } 
                                        })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title (e.g. Director of Education)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-sm"
                                        value={formData.signatures.director.title}
                                        onChange={(e) => setFormData({ 
                                            ...formData, 
                                            signatures: { ...formData.signatures, director: { ...formData.signatures.director, title: e.target.value } } 
                                        })}
                                    />
                                </div>
                            </div>

                            {/* Partner (Only if collaboration) */}
                            {formData.collaboration && (
                                <div className="md:col-span-2">
                                    <label className="text-sm text-[#c5a059] block mb-2">Signature 3 (Partner Rep)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Name (e.g. Partner Rep.)"
                                            className="w-full bg-black/20 border border-[#c5a059]/30 rounded-xl p-3 text-white text-sm"
                                            value={formData.signatures.partner.name}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                signatures: { ...formData.signatures, partner: { ...formData.signatures.partner, name: e.target.value } } 
                                            })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Title (e.g. Authorized Signatory)"
                                            className="w-full bg-black/20 border border-[#c5a059]/30 rounded-xl p-3 text-white text-sm"
                                            value={formData.signatures.partner.title}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                signatures: { ...formData.signatures, partner: { ...formData.signatures.partner, title: e.target.value } } 
                                            })}
                                        />
                                    </div>
                                </div>
                            )}
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

                    {/* Thumbnail */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Course Thumbnail</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="Thumbnail URL or upload file"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            />
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
                                    : "bg-purple-600 hover:bg-purple-700"
                                    } text-white`}
                            >
                                <Image size={20} />
                                {uploadingThumbnail ? "Uploading..." : "Upload"}
                            </label>
                        </div>
                        {formData.thumbnail && (
                            <img
                                src={formData.thumbnail}
                                alt="Thumbnail preview"
                                className="mt-3 w-full max-w-md h-48 object-cover rounded-xl"
                            />
                        )}
                    </div>

                    {/* Certificate Preview Image */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Sample Certificate Image</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="Certificate Image URL or upload file"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.certificateImage}
                                onChange={(e) => setFormData({ ...formData, certificateImage: e.target.value })}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCertificateUpload}
                                disabled={uploadingCertificate}
                                className="hidden"
                                id="certificate-upload"
                            />
                            <label
                                htmlFor="certificate-upload"
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${uploadingCertificate
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    } text-white`}
                            >
                                <Image size={20} />
                                {uploadingCertificate ? "Uploading..." : "Upload"}
                            </label>
                        </div>
                        {formData.certificateImage && (
                            <img
                                src={formData.certificateImage}
                                alt="Certificate preview"
                                className="mt-3 w-full max-w-md h-auto object-contain rounded-xl border border-white/10"
                            />
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
                            {formData.curriculum.map((item, index) => (
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

                    {/* Benefits */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Key Benefits (What you'll get)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add benefit (e.g. Certificate, Lifetime Access)"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={benefitsInput}
                                onChange={(e) => setBenefitsInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefitsItem())}
                            />
                            <Button type="button" onClick={addBenefitsItem}>
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.benefits.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <span className="text-white">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeBenefitsItem(index)}
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
                                placeholder="Video title *"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={videoInput.title}
                                onChange={(e) => setVideoInput({ ...videoInput, title: e.target.value })}
                            />

                            {/* Upload or URL tabs */}
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
                                <Button type="button" onClick={addVideoByUrl}>
                                    <Plus size={20} className="mr-2" />
                                    Add by URL
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {formData.videos.map((video, index) => (
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
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {loading ? "Creating..." : "Create Course"}
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
