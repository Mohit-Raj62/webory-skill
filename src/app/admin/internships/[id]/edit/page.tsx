"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, PenTool, Trash2, Video, Clock, Layers, ChevronDown, ChevronUp, CheckCircle, Tag } from "lucide-react";
import Link from "next/link";
import { SignaturesSection } from "@/components/admin/course-edit/SignaturesSection";

export default function EditInternshipPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Remote",
        duration: "",
        stipend: "",
        price: 0,
        gstPercentage: 0,
        description: "",
        requirements: [] as string[],
        responsibilities: [] as string[],
        tags: [] as string[],
        perks: [] as string[],
        tagline: "Master production-ready tools",
        deadline: "",
        isFree: false,
        totalSeats: 50,
        filledSeats: 0,
        benefits: [
            { title: "Certified Experience", description: "Get a verified internship completion certificate and letter of recommendation from Webory.", icon: "ShieldCheck" },
            { title: "Direct Mentorship", description: "Work directly with industry experts who will guide you through complex real-world production cycles.", icon: "Sparkles" },
            { title: "Career Growth", description: "Top performers will receive Pre-Placement Offers (PPOs) and exclusive networking opportunities.", icon: "Briefcase" }
        ],
        collaboration: "",
        collaborations: [] as { name: string, logo?: string, website?: string }[],
        signatures: {
            founder: { name: "Mohit Sinha", title: "Founder & CEO" },
            director: { name: "Vijay Kumar", title: "Director of Education, Webory", credential: "Alumnus, IIT Mandi" },
            partner: { name: "Partner Rep.", title: "Authorized Signatory" },
        },
        hasTiers: false,
        tiers: [
            { name: "Basic", price: 999, originalPrice: 2999, perks: ["Internship Certificate", "Standard Tasks"] },
            { name: "Intermediate", price: 1499, originalPrice: 3999, perks: ["Intermediate Certificate", "Mentorship Sessions", "Premium Tasks"] },
            { name: "Advanced", price: 2499, originalPrice: 5999, perks: ["Advanced Certificate", "1-on-1 Mentorship", "PPO Opportunity", "Real-world Project"] },
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
    
    // Curriculum Management State
    const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
    const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });
    const [editingVideo, setEditingVideo] = useState<{moduleIndex: number, videoIndex: number} | null>(null);
    const [editingModule, setEditingModule] = useState<number | null>(null);

    useEffect(() => {
        fetchInternship();
    }, []);

    const fetchInternship = async () => {
        try {
            const res = await fetch(`/api/admin/internships/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                // Ensure arrays have default values
                setFormData({
                    ...data.internship,
                    title: data.internship.title || "",
                    company: data.internship.company || "",
                    location: data.internship.location || "",
                    type: data.internship.type || "Remote",
                    duration: data.internship.duration || "",
                    stipend: data.internship.stipend || "",
                    price: data.internship.price || 0,
                    description: data.internship.description || "",
                    requirements: data.internship.requirements || [],
                    responsibilities: data.internship.responsibilities || [],
                    gstPercentage: data.internship.gstPercentage || 0,
                    tags: data.internship.tags || [],
                    perks: data.internship.perks || [],
                    tagline: data.internship.tagline || "Master production-ready tools",
                    deadline: data.internship.deadline || "",
                    isFree: data.internship.isFree || false,
                    totalSeats: data.internship.totalSeats || 50,
                    filledSeats: data.internship.filledSeats || 0,
                    benefits: data.internship.benefits || [
                        { title: "Certified Experience", description: "Get a verified internship completion certificate and letter of recommendation from Webory.", icon: "ShieldCheck" },
                        { title: "Direct Mentorship", description: "Work directly with industry experts who will guide you through complex real-world production cycles.", icon: "Sparkles" },
                        { title: "Career Growth", description: "Top performers will receive Pre-Placement Offers (PPOs) and exclusive networking opportunities.", icon: "Briefcase" }
                    ],
                    collaboration: data.internship.collaboration || "",
                    collaborations: data.internship.collaborations || [],
                    signatures: data.internship.signatures || {
                        founder: { name: "Mohit Sinha", title: "Founder & CEO" },
                        director: { name: "Vijay Kumar", title: "Director of Education, Webory", credential: "Alumnus, IIT Mandi" },
                        partner: { name: "Partner Rep.", title: "Authorized Signatory" },
                    },
                    hasTiers: data.internship.hasTiers || false,
                    tiers: data.internship.tiers || [
                        { name: "Basic", price: 999, originalPrice: 2999, perks: ["Internship Certificate", "Standard Tasks"] },
                        { name: "Intermediate", price: 1499, originalPrice: 3999, perks: ["Intermediate Certificate", "Mentorship Sessions", "Premium Tasks"] },
                        { name: "Advanced", price: 2499, originalPrice: 5999, perks: ["Advanced Certificate", "1-on-1 Mentorship", "PPO Opportunity", "Real-world Project"] },
                    ],
                    modules: data.internship.modules?.map((m: any) => ({
                        ...m,
                        tierAccess: m.tierAccess || ["Basic", "Intermediate", "Advanced"]
                    })) || [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch internship", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Clean data before sending to avoid "Failed to fetch" or Mongoose errors
            const { _id, __v, createdAt, updatedAt, ...saveData } = formData as any;

            const res = await fetch(`/api/admin/internships/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(saveData),
            });

            if (res.ok) {
                alert("Internship updated successfully!");
                router.push("/admin/internships");
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || "Failed to update"}`);
            }
        } catch (error) {
            console.error("Update internship error:", error);
            alert("Network Error: Failed to connect to server. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const addItem = (type: 'requirements' | 'responsibilities' | 'tags' | 'perks', value: string) => {
        if (value.trim()) {
            setFormData({
                ...formData,
                [type]: [...formData[type], value.trim()],
            });
            if (type === 'requirements') setRequirementInput("");
            if (type === 'responsibilities') setResponsibilityInput("");
            if (type === 'tags') setTagInput("");
            if (type === 'perks') setPerkInput("");
        }
    };

    // Curriculum Methods
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
        if (confirm("Are you sure?")) {
            const newModules = formData.modules.filter((_, i) => i !== index);
            newModules.forEach((m, i) => m.order = i);
            setFormData({ ...formData, modules: newModules });
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
            setFormData({ ...formData, modules: newModules });
            setVideoInput({ title: "", url: "", duration: "" });
        }
    };

    const removeVideoFromModule = (mIdx: number, vIdx: number) => {
        const newModules = [...formData.modules];
        newModules[mIdx].videos = newModules[mIdx].videos.filter((_, i) => i !== vIdx);
        setFormData({ ...formData, modules: newModules });
    };

    const removeItem = (type: 'requirements' | 'responsibilities' | 'tags' | 'perks', index: number) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter((_, i) => i !== index),
        });
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading internship...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/internships">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Internships
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Edit Internship</h1>
                <p className="text-gray-400">Update internship details</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl max-w-4xl">
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Internship Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Company *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Location *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Type *</label>
                            <select
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Remote">Remote</option>
                                <option value="On-site">On-site</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Duration *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., 3-6 Months"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Application Deadline *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Next week!"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Tagline (Industry Standard Text)</label>
                            <input
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.tagline}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Stipend *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., ₹15,000/month"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.stipend}
                                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Registration Fee ($) *</label>
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
                            <label className="text-sm text-gray-300 block mb-2">GST %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.gstPercentage}
                                onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 mt-2">
                            <div>
                                <h4 className="text-white font-medium">Free Internship</h4>
                                <p className="text-xs text-gray-400">Skip registration fee for this internship</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isFree: !formData.isFree })}
                                className={`w-12 h-6 rounded-full relative transition-all ${formData.isFree ? 'bg-green-600' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFree ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Total Seats</label>
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.totalSeats}
                                onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Filled Seats (Auto-increments on apply)</label>
                            <input
                                type="number"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.filledSeats}
                                onChange={(e) => setFormData({ ...formData, filledSeats: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Tiers Management */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Tiered Pricing & Access</h3>
                                <p className="text-sm text-gray-400">Enable 3 distinct levels: Basic, Intermediate, Advanced</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, hasTiers: !formData.hasTiers })}
                                className={`w-12 h-6 rounded-full relative transition-all ${formData.hasTiers ? 'bg-blue-600' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.hasTiers ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        {formData.hasTiers && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {formData.tiers.map((tier, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                        <h4 className={`text-sm font-black uppercase tracking-widest ${idx === 0 ? 'text-blue-400' : idx === 1 ? 'text-purple-400' : 'text-emerald-400'}`}>
                                            {tier.name} Tier
                                        </h4>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase block mb-1">Price ($)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                                value={tier.price}
                                                onChange={(e) => {
                                                    const newTiers = [...formData.tiers];
                                                    newTiers[idx].price = Number(e.target.value);
                                                    setFormData({ ...formData, tiers: newTiers });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase block mb-1">Original Price ($)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                                value={tier.originalPrice}
                                                onChange={(e) => {
                                                    const newTiers = [...formData.tiers];
                                                    newTiers[idx].originalPrice = Number(e.target.value);
                                                    setFormData({ ...formData, tiers: newTiers });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase block mb-1">Perks (comma separated)</label>
                                            <textarea
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white h-20 outline-none resize-none scroller"
                                                value={tier.perks.join(", ")}
                                                onChange={(e) => {
                                                    const newTiers = [...formData.tiers];
                                                    newTiers[idx].perks = e.target.value.split(",").map(p => p.trim()).filter(p => p);
                                                    setFormData({ ...formData, tiers: newTiers });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

                    {/* Requirements */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Requirements</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add requirement"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={requirementInput}
                                onChange={(e) => setRequirementInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem('requirements', requirementInput))}
                            />
                            <Button type="button" onClick={() => addItem('requirements', requirementInput)}>
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.requirements.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <span className="text-white">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeItem('requirements', index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Responsibilities */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Responsibilities</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add responsibility"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={responsibilityInput}
                                onChange={(e) => setResponsibilityInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem('responsibilities', responsibilityInput))}
                            />
                            <Button type="button" onClick={() => addItem('responsibilities', responsibilityInput)}>
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.responsibilities.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <span className="text-white">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeItem('responsibilities', index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Perks / Bonus */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Perks & Bonuses (e.g. Performance Bonus)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add perk (e.g., Skill-Based Bonus)"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={perkInput}
                                onChange={(e) => setPerkInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem('perks', perkInput))}
                            />
                            <Button type="button" onClick={() => addItem('perks', perkInput)}>
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.perks.map((perk, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2"
                                >
                                    {perk}
                                    <button
                                        type="button"
                                        onClick={() => removeItem('perks', index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Tags (Technology Stack)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Add tag (e.g., React, Node.js)"
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem('tags', tagInput))}
                            />
                            <Button type="button" onClick={() => addItem('tags', tagInput)}>
                                <Plus size={20} />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeItem('tags', index)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Benefits Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Bottom Benefits (3 Cards)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                    <h4 className="text-sm font-bold text-emerald-400">Card {index + 1}</h4>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase block mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                            value={benefit.title}
                                            onChange={(e) => {
                                                const newBenefits = [...formData.benefits];
                                                newBenefits[index].title = e.target.value;
                                                setFormData({ ...formData, benefits: newBenefits });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase block mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                            value={benefit.description}
                                            onChange={(e) => {
                                                const newBenefits = [...formData.benefits];
                                                newBenefits[index].description = e.target.value;
                                                setFormData({ ...formData, benefits: newBenefits });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase block mb-1">Icon (ShieldCheck, Sparkles, Briefcase)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                                            value={benefit.icon}
                                            onChange={(e) => {
                                                const newBenefits = [...formData.benefits];
                                                newBenefits[index].icon = e.target.value;
                                                setFormData({ ...formData, benefits: newBenefits });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Curriculum Management Section */}
                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Layers className="text-blue-400" size={24} />
                            Curriculum Management
                        </h2>
                        
                        <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase block mb-1">Module Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Introduction to React" 
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500/50" 
                                        value={moduleInput.title} 
                                        onChange={(e) => setModuleInput({...moduleInput, title: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase block mb-1">Description</label>
                                    <input 
                                        type="text" 
                                        placeholder="Module overview..." 
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500/50" 
                                        value={moduleInput.description} 
                                        onChange={(e) => setModuleInput({...moduleInput, description: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <Button type="button" onClick={addModule} className="w-full bg-blue-600 hover:bg-blue-700">
                                <Plus size={18} className="mr-2" /> Create Module
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {formData.modules.map((module, mIdx) => (
                                <div key={mIdx} className={`bg-black/40 border ${selectedModuleIndex === mIdx ? 'border-blue-500/50' : 'border-white/10'} rounded-2xl overflow-hidden`}>
                                    <div className="p-5 flex items-center justify-between bg-white/5 border-b border-white/5">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="bg-white/10 text-gray-400 text-[10px] px-2 py-0.5 rounded font-black uppercase">Module {mIdx + 1}</span>
                                                <h3 className="text-white font-bold">{module.title}</h3>
                                            </div>
                                            <p className="text-gray-400 text-xs">{module.description}</p>
                                            {formData.hasTiers && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {["Basic", "Intermediate", "Advanced"].map(t => (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newModules = [...formData.modules];
                                                                const currentAccess = newModules[mIdx].tierAccess || [];
                                                                if (currentAccess.includes(t)) {
                                                                    newModules[mIdx].tierAccess = currentAccess.filter(x => x !== t);
                                                                } else {
                                                                    newModules[mIdx].tierAccess = [...currentAccess, t];
                                                                }
                                                                setFormData({ ...formData, modules: newModules });
                                                            }}
                                                            className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                                                (formData.modules[mIdx].tierAccess || []).includes(t)
                                                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                                                    : 'bg-white/5 border-white/10 text-gray-600'
                                                            }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={selectedModuleIndex === mIdx ? "secondary" : "ghost"}
                                                className={selectedModuleIndex === mIdx ? "bg-blue-500 text-white" : "text-gray-400"}
                                                onClick={() => setSelectedModuleIndex(mIdx)}
                                            >
                                                {selectedModuleIndex === mIdx ? "Adding Content" : "Select"}
                                            </Button>
                                            <button type="button" onClick={() => removeModule(mIdx)} className="p-2 text-red-500/70 hover:text-red-400">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {selectedModuleIndex === mIdx && (
                                        <div className="p-5 bg-blue-500/5 border-b border-white/5">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Add Lesson to {module.title}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <input type="text" placeholder="Video Title" className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white" value={videoInput.title} onChange={(e) => setVideoInput({...videoInput, title: e.target.value})} />
                                                <input type="text" placeholder="YouTube URL" className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white" value={videoInput.url} onChange={(e) => setVideoInput({...videoInput, url: e.target.value})} />
                                                <input type="text" placeholder="Duration (e.g. 12:30)" className="bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white" value={videoInput.duration} onChange={(e) => setVideoInput({...videoInput, duration: e.target.value})} />
                                            </div>
                                            <Button type="button" onClick={addVideoToModule} className="w-full bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
                                                <Plus size={16} className="mr-2" /> Add Lesson
                                            </Button>
                                        </div>
                                    )}

                                    <div className="p-4 space-y-2">
                                        {module.videos?.map((video, vIdx) => (
                                            <div key={vIdx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Video size={14} className="text-blue-400" />
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{video.title}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{video.duration}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeVideoFromModule(mIdx, vIdx)} className="p-2 text-red-500/50 hover:text-red-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Signatures & Partnerships Section */}
                    <div className="mt-8">
                        <SignaturesSection 
                            formData={formData} 
                            setFormData={setFormData}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        >
                            {saving ? "Saving..." : "Update Internship"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/internships")}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
