"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, PenTool } from "lucide-react";
import Link from "next/link";
import { SignaturesSection } from "@/components/admin/course-edit/SignaturesSection";

export default function NewInternshipPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
            partner: { name: "Partner Rep.", title: "Authorized Signatory" },
        },
        hasTiers: false,
        tiers: [
            { name: "Basic", price: 999, originalPrice: 2999, perks: ["Internship Certificate", "Standard Tasks"] },
            { name: "Intermediate", price: 1499, originalPrice: 3999, perks: ["Intermediate Certificate", "Mentorship Sessions", "Premium Tasks"] },
            { name: "Advanced", price: 2499, originalPrice: 5999, perks: ["Advanced Certificate", "1-on-1 Mentorship", "PPO Opportunity", "Real-world Project"] },
        ] as { name: "Basic" | "Intermediate" | "Advanced", price: number, originalPrice: number, discountPercentage?: number, perks: string[] }[],
    });

    const [requirementInput, setRequirementInput] = useState("");
    const [responsibilityInput, setResponsibilityInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [perkInput, setPerkInput] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/internships", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Internship created successfully!");
                router.push("/admin/internships");
            } else {
                alert("Failed to create internship");
            }
        } catch (error) {
            console.error("Create internship error:", error);
            alert("Failed to create internship");
        } finally {
            setLoading(false);
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

    const removeItem = (type: 'requirements' | 'responsibilities' | 'tags' | 'perks', index: number) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter((_, i) => i !== index),
        });
    };

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
                <h1 className="text-4xl font-bold text-white mb-2">Add New Internship</h1>
                <p className="text-gray-400">Create a new internship opportunity</p>
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
                            <label className="text-sm text-gray-300 block mb-2">Initial Filled Seats</label>
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
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                        >
                            {loading ? "Creating..." : "Create Internship"}
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
