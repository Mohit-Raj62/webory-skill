"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

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
    });

    const [requirementInput, setRequirementInput] = useState("");
    const [responsibilityInput, setResponsibilityInput] = useState("");
    const [tagInput, setTagInput] = useState("");

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
                    requirements: data.internship.requirements || [],
                    responsibilities: data.internship.responsibilities || [],
                    gstPercentage: data.internship.gstPercentage || 0,
                    tags: data.internship.tags || [],
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
            const res = await fetch(`/api/admin/internships/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Internship updated successfully!");
                router.push("/admin/internships");
            } else {
                alert("Failed to update internship");
            }
        } catch (error) {
            console.error("Update internship error:", error);
            alert("Failed to update internship");
        } finally {
            setSaving(false);
        }
    };

    const addItem = (type: 'requirements' | 'responsibilities' | 'tags', value: string) => {
        if (value.trim()) {
            setFormData({
                ...formData,
                [type]: [...formData[type], value.trim()],
            });
            if (type === 'requirements') setRequirementInput("");
            if (type === 'responsibilities') setResponsibilityInput("");
            if (type === 'tags') setTagInput("");
        }
    };

    const removeItem = (type: 'requirements' | 'responsibilities' | 'tags', index: number) => {
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
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Duration *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., 3 months"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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

                    {/* Tags */}
                    <div>
                        <label className="text-sm text-gray-300 block mb-2">Tags</label>
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
