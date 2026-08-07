"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SmartFormatButton } from "@/components/admin/SmartFormatButton";
import { ArrowLeft, Plus, X, Upload, Image, FileText, Trash2, Video, DollarSign, Users, Clock, Tag, Layers, CheckCircle, Loader2, Save, Edit } from "lucide-react";
import Link from "next/link";
import { uploadFile, uploadPDFToCloudinary } from "@/lib/upload-utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SignaturesSection } from "@/components/admin/course-edit/SignaturesSection";

export default function EditInternshipPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingCertificate, setUploadingCertificate] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        company: "",
        location: "",
        type: "Remote",
        duration: "",
        stipend: "",
        price: 0,
        originalPrice: 0,
        discountPercentage: 0,
        gstPercentage: 0,
        description: "",
        syllabus: "",
        requirements: [] as string[],
        responsibilities: [] as string[],
        tags: [] as string[],
        perks: [] as string[],
        tagline: "Master production-ready tools",
        deadline: "",
        totalSeats: 50,
        filledSeats: 0,
        isFree: false,
        isActive: true,
        thumbnail: "",
        certificateImage: "",
        benefits: [
            { title: "Certified Experience", description: "Get a verified internship completion certificate and letter of recommendation from Webory.", icon: "ShieldCheck" },
            { title: "Direct Mentorship", description: "Work directly with industry experts who will guide you through complex real-world production cycles.", icon: "Sparkles" },
            { title: "Career Growth", description: "Top performers will receive Pre-Placement Offers (PPOs) and exclusive networking opportunities.", icon: "Briefcase" }
        ],
        signatures: {
            founder: { name: "Mohit Sinha", title: "Founder & CEO" },
            director: { name: "Vijay Kumar", title: "Director of Education, Webory", credential: "Alumnus, IIT Mandi" },
            partner: { name: "Partner Rep.", title: "Authorized Signatory" }
        },
        hasTiers: false,
        tiers: [
            { name: "Basic", price: 999, originalPrice: 2999, discountPercentage: 0, perks: ["Internship Certificate", "Standard Tasks"] },
            { name: "Intermediate", price: 1499, originalPrice: 3999, discountPercentage: 0, perks: ["Intermediate Certificate", "Mentorship Sessions", "Premium Tasks"] },
            { name: "Advanced", price: 2499, originalPrice: 5999, discountPercentage: 0, perks: ["Advanced Certificate", "1-on-1 Mentorship", "PPO Opportunity", "Real-world Project"] },
        ] as { name: "Basic" | "Intermediate" | "Advanced", price: number, originalPrice: number, discountPercentage?: number, perks: string[] }[],
        modules: [] as {
            title: string;
            description: string;
            order: number;
            tierAccess: string[];
            videos: { title: string; url: string; duration: string }[];
        }[],
    });

    const [requirementInput, setRequirementInput] = useState("");
    const [responsibilityInput, setResponsibilityInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [perkInput, setPerkInput] = useState("");
    
    const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
    const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });

    // PDF Resources State
    const [pdfs, setPdfs] = useState<any[]>([]);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [pdfInput, setPdfInput] = useState({ title: "", description: "", afterModule: 0, order: 0 });

    // Editing states for modules and videos
    const [editingModuleIdx, setEditingModuleIdx] = useState<number | null>(null);
    const [editingModuleData, setEditingModuleData] = useState({ title: "", description: "" });
    const [editingVideoIdx, setEditingVideoIdx] = useState<{ mIdx: number, vIdx: number } | null>(null);
    const [editingVideoData, setEditingVideoData] = useState({ title: "", url: "", duration: "" });

    useEffect(() => {
        fetchInternship();
        fetchPDFs();
    }, []);

    const fetchPDFs = async () => {
        try {
            const res = await fetch(`/api/admin/internships/${params.id}/pdfs`);
            if (res.ok) {
                const data = await res.json();
                setPdfs(data.pdfs || []);
            }
        } catch (error) {
            console.error("Failed to fetch PDFs", error);
        }
    };

    const fetchInternship = async () => {
        try {
            const res = await fetch(`/api/admin/internships/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                
                let modules = data.internship.modules || [];
                if (modules.length === 0 && data.internship.videos && data.internship.videos.length > 0) {
                    modules = [{
                        title: "Internship Content",
                        description: "All internship videos",
                        order: 0,
                        tierAccess: ["Basic", "Intermediate", "Advanced"],
                        videos: data.internship.videos
                    }];
                }
                
                const defaultBenefits = [
                    { title: "Certified Experience", description: "Get a verified internship completion certificate and letter of recommendation from Webory.", icon: "ShieldCheck" },
                    { title: "Direct Mentorship", description: "Work directly with industry experts who will guide you through complex real-world production cycles.", icon: "Sparkles" },
                    { title: "Career Growth", description: "Top performers will receive Pre-Placement Offers (PPOs) and exclusive networking opportunities.", icon: "Briefcase" }
                ];

                const defaultTiers = [
                    { name: "Basic", price: 999, originalPrice: 2999, discountPercentage: 0, perks: ["Internship Certificate", "Standard Tasks"] },
                    { name: "Intermediate", price: 1499, originalPrice: 3999, discountPercentage: 0, perks: ["Intermediate Certificate", "Mentorship Sessions", "Premium Tasks"] },
                    { name: "Advanced", price: 2499, originalPrice: 5999, discountPercentage: 0, perks: ["Advanced Certificate", "1-on-1 Mentorship", "PPO Opportunity", "Real-world Project"] },
                ];
                
                setFormData(prev => ({ 
                    ...prev, 
                    ...data.internship,
                    title: data.internship.title || prev.title,
                    slug: data.internship.slug || prev.slug,
                    company: data.internship.company || prev.company,
                    location: data.internship.location || prev.location,
                    type: data.internship.type || prev.type,
                    duration: data.internship.duration || prev.duration,
                    stipend: data.internship.stipend || prev.stipend,
                    price: data.internship.price ?? prev.price,
                    originalPrice: data.internship.originalPrice ?? prev.originalPrice,
                    discountPercentage: data.internship.discountPercentage ?? prev.discountPercentage,
                    gstPercentage: data.internship.gstPercentage ?? prev.gstPercentage,
                    description: data.internship.description || prev.description,
                    tagline: data.internship.tagline || prev.tagline,
                    deadline: data.internship.deadline || prev.deadline,
                    totalSeats: data.internship.totalSeats ?? prev.totalSeats,
                    filledSeats: data.internship.filledSeats ?? prev.filledSeats,
                    isFree: data.internship.isFree ?? prev.isFree,
                    isActive: data.internship.isActive ?? prev.isActive,
                    thumbnail: data.internship.thumbnail || prev.thumbnail,
                    certificateImage: data.internship.certificateImage || prev.certificateImage,
                    hasTiers: data.internship.hasTiers ?? prev.hasTiers,
                    modules,
                    requirements: data.internship.requirements?.length ? data.internship.requirements : prev.requirements,
                    responsibilities: data.internship.responsibilities?.length ? data.internship.responsibilities : prev.responsibilities,
                    perks: data.internship.perks?.length ? data.internship.perks : prev.perks,
                    tags: data.internship.tags?.length ? data.internship.tags : prev.tags,
                    benefits: data.internship.benefits?.length === 3 ? data.internship.benefits : defaultBenefits,
                    tiers: data.internship.tiers?.length === 3 ? data.internship.tiers : defaultTiers,
                    signatures: data.internship.signatures || prev.signatures
                }));
            }
        } catch (error) {
            console.error("Failed to fetch internship", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/internships/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast.success("Internship updated successfully!");
                await fetchInternship();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to update");
            }
        } catch (error) {
            toast.error("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const addItem = (type: "requirements" | "responsibilities" | "tags" | "perks", value: string, setter: any) => {
        if (value.trim()) {
            setFormData({ ...formData, [type]: [...formData[type], value.trim()] });
            setter("");
        }
    };

    const removeItem = (type: "requirements" | "responsibilities" | "tags" | "perks", index: number) => {
        setFormData({ ...formData, [type]: formData[type].filter((_, i) => i !== index) });
    };
    
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingThumbnail(true);
        try {
            const data = await uploadFile(file, "/api/upload/image");
            setFormData(prev => ({ ...prev, thumbnail: data.url }));
            toast.success("Thumbnail uploaded!");
        } catch (error: any) {
            toast.error("Failed to upload thumbnail");
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
            const data = await uploadFile(file, "/api/upload/image");
            setFormData(prev => ({ ...prev, certificateImage: data.url }));
            toast.success("Certificate template uploaded!");
        } catch (error: any) {
            toast.error("Failed to upload certificate");
        } finally {
            setUploadingCertificate(false);
            e.target.value = "";
        }
    };
    
    const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !pdfInput.title) {
            toast.error("Please enter a title before uploading");
            e.target.value = "";
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error("Please select a valid PDF file");
            e.target.value = "";
            return;
        }

        setUploadingPdf(true);
        try {
            const uploadData = await uploadPDFToCloudinary(file);
            const res = await fetch(`/api/admin/internships/${params.id}/pdfs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: pdfInput.title,
                    description: pdfInput.description,
                    fileUrl: uploadData.url,
                    fileName: file.name,
                    fileSize: file.size,
                    afterModule: pdfInput.afterModule,
                    order: pdfInput.order,
                    cloudinaryId: uploadData.public_id
                })
            });

            if (res.ok) {
                toast.success("PDF uploaded successfully!");
                setPdfInput({ title: "", description: "", afterModule: 0, order: 0 });
                fetchPDFs();
            } else {
                throw new Error("Failed to save PDF metadata");
            }
        } catch (error) {
            toast.error("Failed to upload PDF");
        } finally {
            setUploadingPdf(false);
            e.target.value = "";
        }
    };

    const deletePDF = async (pdfId: string) => {
        if (!confirm("Are you sure you want to delete this PDF?")) return;
        try {
            const res = await fetch(`/api/admin/internships/${params.id}/pdfs/${pdfId}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("PDF deleted");
                fetchPDFs();
            } else {
                toast.error("Failed to delete PDF");
            }
        } catch (error) {
            toast.error("Failed to delete PDF");
        }
    };

    const addModule = () => {
        if (moduleInput.title.trim()) {
            const newModule = {
                title: moduleInput.title,
                description: moduleInput.description,
                order: formData.modules.length,
                tierAccess: ["Basic", "Intermediate", "Advanced"],
                videos: []
            };
            setFormData({ ...formData, modules: [...formData.modules, newModule] });
            setModuleInput({ title: "", description: "" });
            setSelectedModuleIndex(formData.modules.length);
        }
    };

    const removeModule = (index: number) => {
        if (confirm("Are you sure?")) {
            const newModules = formData.modules.filter((_, i) => i !== index);
            setFormData({ ...formData, modules: newModules });
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
            setFormData({ ...formData, modules: newModules });
            setVideoInput({ title: "", url: "", duration: "" });
        }
    };

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header Sticky Bar */}
            <div className="sticky top-0 z-50 flex items-center justify-between mb-8 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
                <div>
                    <Link href="/admin/internships">
                        <Button variant="ghost" className="mb-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {formData.title || "Edit Internship"}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] px-8 py-6 rounded-xl text-lg font-semibold transition-all hover:scale-105 active:scale-95"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {saving ? "Saving..." : "Update Internship"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="xl:col-span-2 space-y-8">
                    
                    {/* Basic Info */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl"><Tag className="w-6 h-6 text-blue-400" /></div>
                            <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Title *</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Slug</label>
                                <input type="text" placeholder="Auto-generated if left empty" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Company *</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Location *</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Type *</label>
                                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Duration *</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Application Deadline *</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Total Seats</label>
                                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Initial Filled Seats</label>
                                <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.filledSeats} onChange={(e) => setFormData({ ...formData, filledSeats: Number(e.target.value) })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-300 block mb-2">Tagline</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-300 block mb-2">Description *</label>
                                <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Syllabus (Markdown Supported)</label>
                                    <SmartFormatButton text={formData.syllabus} onFormatted={(text) => setFormData({ ...formData, syllabus: text })} />
                                </div>
                                <textarea rows={8} placeholder="Use Markdown for Roadmap style:&#10;## Week 1: Basics&#10;- Topic 1&#10;- Topic 2&#10;&#10;## Week 2: Advanced&#10;- Topic 3" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-mono text-sm" value={formData.syllabus} onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Requirements & Responsibilities */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-xl"><Layers className="w-6 h-6 text-purple-400" /></div>
                            <h2 className="text-2xl font-bold text-white">Requirements & Responsibilities</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Requirements</label>
                                <div className="flex gap-2 mb-4">
                                    <input type="text" placeholder="Add requirement" className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none" value={requirementInput} onChange={(e) => setRequirementInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("requirements", requirementInput, setRequirementInput))} />
                                    <Button type="button" onClick={() => addItem("requirements", requirementInput, setRequirementInput)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"><Plus size={20} /></Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.requirements.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-purple-500/30 transition-colors">
                                            <span className="text-gray-300 text-sm">{item}</span>
                                            <button type="button" onClick={() => removeItem("requirements", index)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Responsibilities</label>
                                <div className="flex gap-2 mb-4">
                                    <input type="text" placeholder="Add responsibility" className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none" value={responsibilityInput} onChange={(e) => setResponsibilityInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("responsibilities", responsibilityInput, setResponsibilityInput))} />
                                    <Button type="button" onClick={() => addItem("responsibilities", responsibilityInput, setResponsibilityInput)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"><Plus size={20} /></Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.responsibilities.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-purple-500/30 transition-colors">
                                            <span className="text-gray-300 text-sm">{item}</span>
                                            <button type="button" onClick={() => removeItem("responsibilities", index)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Perks & Tags */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Perks</label>
                                <div className="flex gap-2 mb-4">
                                    <input type="text" placeholder="Add perk" className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none" value={perkInput} onChange={(e) => setPerkInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("perks", perkInput, setPerkInput))} />
                                    <Button type="button" onClick={() => addItem("perks", perkInput, setPerkInput)} className="bg-green-600 hover:bg-green-700 text-white rounded-xl"><Plus size={20} /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.perks.map((item, index) => (
                                        <span key={index} className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeItem("perks", index)} className="hover:text-red-400"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Tags</label>
                                <div className="flex gap-2 mb-4">
                                    <input type="text" placeholder="Add tag" className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem("tags", tagInput, setTagInput))} />
                                    <Button type="button" onClick={() => addItem("tags", tagInput, setTagInput)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"><Plus size={20} /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((item, index) => (
                                        <span key={index} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeItem("tags", index)} className="hover:text-red-400"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Benefits (3 Cards) */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-xl"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
                            <h2 className="text-2xl font-bold text-white">Bottom Benefits</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                    <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Card {index + 1}</h4>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase block mb-2">Title</label>
                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" value={benefit.title} onChange={(e) => { const newB = [...formData.benefits]; newB[index].title = e.target.value; setFormData({ ...formData, benefits: newB }); }} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase block mb-2">Description</label>
                                        <textarea rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500 resize-none" value={benefit.description} onChange={(e) => { const newB = [...formData.benefits]; newB[index].description = e.target.value; setFormData({ ...formData, benefits: newB }); }} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase block mb-2">Icon</label>
                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-emerald-500" value={benefit.icon} onChange={(e) => { const newB = [...formData.benefits]; newB[index].icon = e.target.value; setFormData({ ...formData, benefits: newB }); }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                         <SignaturesSection formData={formData as any} setFormData={setFormData as any} />
                    </div>

                    {/* Internship Content (Modules & Videos) */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-500/20 rounded-xl"><Video className="w-6 h-6 text-red-400" /></div>
                            <h2 className="text-2xl font-bold text-white">Internship Content</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                <h3 className="text-lg font-medium text-white mb-4">Add New Module</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Module Title" className="bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500" value={moduleInput.title} onChange={(e) => setModuleInput({ ...moduleInput, title: e.target.value })} />
                                    <input type="text" placeholder="Module Description" className="bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500" value={moduleInput.description} onChange={(e) => setModuleInput({ ...moduleInput, description: e.target.value })} />
                                    <Button onClick={addModule} className="md:col-span-2 bg-red-600 hover:bg-red-700 text-white rounded-xl">Add Module</Button>
                                </div>
                            </div>
                            
                            {formData.modules.length > 0 && (
                                <div className="space-y-6">
                                    {formData.modules.map((module, mIdx) => (
                                        <div key={mIdx} className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                                            <div className="p-4 bg-white/5 flex items-center justify-between">
                                                {editingModuleIdx === mIdx ? (
                                                    <div className="flex-1 flex gap-2 mr-4">
                                                        <input type="text" className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white flex-1 outline-none" value={editingModuleData.title} onChange={e => setEditingModuleData({...editingModuleData, title: e.target.value})} placeholder="Module Title" />
                                                        <input type="text" className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white flex-1 outline-none" value={editingModuleData.description} onChange={e => setEditingModuleData({...editingModuleData, description: e.target.value})} placeholder="Description" />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white">Module {mIdx + 1}: {module.title}</h4>
                                                        {module.description && <p className="text-sm text-gray-400">{module.description}</p>}
                                                    </div>
                                                )}
                                                
                                                <div className="flex gap-2">
                                                    {editingModuleIdx === mIdx ? (
                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                            const newM = [...formData.modules];
                                                            newM[mIdx].title = editingModuleData.title;
                                                            newM[mIdx].description = editingModuleData.description;
                                                            setFormData({ ...formData, modules: newM });
                                                            setEditingModuleIdx(null);
                                                        }} className="text-green-400 hover:text-green-300 hover:bg-green-500/10"><CheckCircle size={16} /></Button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                            setEditingModuleIdx(mIdx);
                                                            setEditingModuleData({ title: module.title, description: module.description });
                                                        }} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"><Edit size={16} /></Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" onClick={() => removeModule(mIdx)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 size={16} /></Button>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4 space-y-4">
                                                {/* Videos List */}
                                                <div className="space-y-2">
                                                    {module.videos.map((video, vIdx) => (
                                                        <div key={vIdx} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                                            {editingVideoIdx?.mIdx === mIdx && editingVideoIdx?.vIdx === vIdx ? (
                                                                <div className="flex-1 flex gap-2 mr-4">
                                                                    <input type="text" className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white flex-1" value={editingVideoData.title} onChange={e => setEditingVideoData({...editingVideoData, title: e.target.value})} placeholder="Title" />
                                                                    <input type="text" className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white flex-2" value={editingVideoData.url} onChange={e => setEditingVideoData({...editingVideoData, url: e.target.value})} placeholder="URL" />
                                                                    <input type="text" className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white w-24" value={editingVideoData.duration} onChange={e => setEditingVideoData({...editingVideoData, duration: e.target.value})} placeholder="Duration" />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{video.title}</p>
                                                                    <p className="text-xs text-gray-400">{video.duration} • {video.url}</p>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex gap-2">
                                                                {editingVideoIdx?.mIdx === mIdx && editingVideoIdx?.vIdx === vIdx ? (
                                                                    <Button variant="ghost" size="sm" onClick={() => {
                                                                        const newM = [...formData.modules];
                                                                        newM[mIdx].videos[vIdx] = { ...editingVideoData };
                                                                        setFormData({ ...formData, modules: newM });
                                                                        setEditingVideoIdx(null);
                                                                    }} className="text-green-400 hover:text-green-300 hover:bg-green-500/10"><CheckCircle size={16} /></Button>
                                                                ) : (
                                                                    <Button variant="ghost" size="sm" onClick={() => {
                                                                        setEditingVideoIdx({ mIdx, vIdx });
                                                                        setEditingVideoData({ title: video.title, url: video.url, duration: video.duration });
                                                                    }} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"><Edit size={16} /></Button>
                                                                )}
                                                                <Button variant="ghost" size="sm" onClick={() => {
                                                                    const newM = [...formData.modules];
                                                                    newM[mIdx].videos = newM[mIdx].videos.filter((_, i) => i !== vIdx);
                                                                    setFormData({ ...formData, modules: newM });
                                                                }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 size={16} /></Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* Add Video to this module */}
                                                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-2">
                                                    <input type="text" placeholder="Video Title" className="md:col-span-1 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white" value={selectedModuleIndex === mIdx ? videoInput.title : ""} onChange={(e) => { setSelectedModuleIndex(mIdx); setVideoInput({ ...videoInput, title: e.target.value }); }} />
                                                    <input type="text" placeholder="Video URL (Vimeo/Youtube)" className="md:col-span-2 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white" value={selectedModuleIndex === mIdx ? videoInput.url : ""} onChange={(e) => { setSelectedModuleIndex(mIdx); setVideoInput({ ...videoInput, url: e.target.value }); }} />
                                                    <input type="text" placeholder="Duration (e.g., 10:30)" className="bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white" value={selectedModuleIndex === mIdx ? videoInput.duration : ""} onChange={(e) => { setSelectedModuleIndex(mIdx); setVideoInput({ ...videoInput, duration: e.target.value }); }} />
                                                    <Button onClick={addVideoToModule} disabled={selectedModuleIndex !== mIdx || !videoInput.title || !videoInput.url} className="md:col-span-4 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 mt-2">
                                                        <Plus size={16} className="mr-2" /> Add Video to Module {mIdx + 1}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column - Settings & Media */}
                <div className="xl:col-span-1 space-y-8">
                    
                    {/* Pricing & Details */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500/20 rounded-xl"><DollarSign className="w-6 h-6 text-green-400" /></div>
                            <h2 className="text-xl font-bold text-white">Pricing & Details</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div>
                                    <h4 className="text-sm font-medium text-white">Free Internship</h4>
                                    <p className="text-xs text-gray-400">Make this internship completely free</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={formData.isFree} onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })} />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>
                            
                            {!formData.isFree && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-2">Registration Fee (₹) *</label>
                                        <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-2">Stipend *</label>
                                        <input type="text" placeholder="e.g., ₹15,000/month" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500" value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-300 block mb-2">GST %</label>
                                        <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-500" value={formData.gstPercentage} onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })} />
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-white">Tiered Pricing</h4>
                                                <p className="text-xs text-gray-400">Enable Basic, Intermediate, Advanced</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked={formData.hasTiers} onChange={(e) => setFormData({ ...formData, hasTiers: e.target.checked })} />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                            </label>
                                        </div>
                                        
                                        {formData.hasTiers && (
                                            <div className="space-y-4">
                                                {formData.tiers.map((tier, idx) => (
                                                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                                                        <h5 className={`text-xs font-bold uppercase tracking-wider ${idx === 0 ? "text-blue-400" : idx === 1 ? "text-purple-400" : "text-emerald-400"}`}>{tier.name} Tier</h5>
                                                        <div>
                                                            <label className="text-[10px] text-gray-400 uppercase block mb-1">Price</label>
                                                            <input type="number" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white" value={tier.price} onChange={(e) => { const newT = [...formData.tiers]; newT[idx].price = Number(e.target.value); setFormData({ ...formData, tiers: newT }); }} />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-gray-400 uppercase block mb-1">Original Price</label>
                                                            <input type="number" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white" value={tier.originalPrice} onChange={(e) => { const newT = [...formData.tiers]; newT[idx].originalPrice = Number(e.target.value); setFormData({ ...formData, tiers: newT }); }} />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-gray-400 uppercase block mb-1">Perks (comma separated)</label>
                                                            <textarea className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white resize-none" value={tier.perks.join(", ")} onChange={(e) => { const newT = [...formData.tiers]; newT[idx].perks = e.target.value.split(",").map(p=>p.trim()).filter(Boolean); setFormData({ ...formData, tiers: newT }); }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Media Assets */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-pink-500/20 rounded-xl"><Image className="w-6 h-6 text-pink-400" /></div>
                            <h2 className="text-xl font-bold text-white">Media Assets</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Thumbnail */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Thumbnail Image</label>
                                {formData.thumbnail ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full aspect-video object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="destructive" size="sm" onClick={() => setFormData({ ...formData, thumbnail: "" })}><Trash2 size={16} className="mr-2"/> Remove</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors relative">
                                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={uploadingThumbnail} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {uploadingThumbnail ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-2" /> : <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />}
                                        <p className="text-sm text-gray-400">{uploadingThumbnail ? "Uploading..." : "Click or drag image here"}</p>
                                    </div>
                                )}
                            </div>

                            {/* Certificate Image */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 block mb-2">Certificate Template</label>
                                {formData.certificateImage ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                                        <img src={formData.certificateImage} alt="Certificate" className="w-full aspect-video object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="destructive" size="sm" onClick={() => setFormData({ ...formData, certificateImage: "" })}><Trash2 size={16} className="mr-2"/> Remove</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors relative">
                                        <input type="file" accept="image/*" onChange={handleCertificateUpload} disabled={uploadingCertificate} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {uploadingCertificate ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-2" /> : <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />}
                                        <p className="text-sm text-gray-400">{uploadingCertificate ? "Uploading..." : "Upload certificate template"}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PDF Resources */}
                    <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-500/20 rounded-xl"><FileText className="w-6 h-6 text-orange-400" /></div>
                            <h2 className="text-xl font-bold text-white">PDF Resources</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <h3 className="text-sm font-medium text-white">Upload New PDF</h3>
                                <input type="text" placeholder="PDF Title *" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" value={pdfInput.title} onChange={(e) => setPdfInput({ ...pdfInput, title: e.target.value })} />
                                <input type="text" placeholder="Description (Optional)" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" value={pdfInput.description} onChange={(e) => setPdfInput({ ...pdfInput, description: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">After Module #</label>
                                        <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" value={pdfInput.afterModule} onChange={(e) => setPdfInput({ ...pdfInput, afterModule: Number(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Display Order</label>
                                        <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white" value={pdfInput.order} onChange={(e) => setPdfInput({ ...pdfInput, order: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5">
                                    <input type="file" accept="application/pdf" onChange={handlePDFUpload} disabled={uploadingPdf || !pdfInput.title} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                                    {uploadingPdf ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" /> : <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />}
                                    <p className="text-xs text-gray-400">{uploadingPdf ? "Uploading PDF..." : "Select PDF File"}</p>
                                </div>
                            </div>

                            {pdfs.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-white">Uploaded PDFs</h3>
                                    {pdfs.map((pdf) => (
                                        <div key={pdf._id} className="p-4 bg-black/40 rounded-xl border border-white/10 flex items-start justify-between group">
                                            <div>
                                                <p className="text-sm font-medium text-white">{pdf.title}</p>
                                                <p className="text-xs text-gray-400">Module {pdf.afterModule} • Order {pdf.order}</p>
                                                <a href={pdf.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline mt-1 inline-block">View PDF</a>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => deletePDF(pdf._id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"><Trash2 size={14} /></Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
