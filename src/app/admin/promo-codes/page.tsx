"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, Tag } from "lucide-react";

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        applicableTo: "both",
        maxUses: "",
        expiresAt: "",
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const res = await fetch("/api/promo-codes");
            if (res.ok) {
                const data = await res.json();
                setPromoCodes(data.promoCodes);
            }
        } catch (error) {
            console.error("Failed to fetch promo codes:", error);
            toast.error("Failed to load promo codes");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/promo-codes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                    expiresAt: formData.expiresAt || null,
                }),
            });

            if (res.ok) {
                toast.success("Promo code created successfully!");
                setShowForm(false);
                setFormData({
                    code: "",
                    discountType: "percentage",
                    discountValue: 0,
                    applicableTo: "both",
                    maxUses: "",
                    expiresAt: "",
                });
                fetchPromoCodes();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create promo code");
            }
        } catch (error) {
            console.error("Error creating promo code:", error);
            toast.error("Failed to create promo code");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promo code?")) return;

        try {
            const res = await fetch(`/api/promo-codes?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Promo code deleted");
                fetchPromoCodes();
            } else {
                toast.error("Failed to delete promo code");
            }
        } catch (error) {
            console.error("Error deleting promo code:", error);
            toast.error("Failed to delete promo code");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Promo Codes
                        </h1>
                        <p className="text-gray-400 mt-2">Manage discount codes for courses and internships</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {showForm ? "Cancel" : "Create Promo Code"}
                    </Button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Create New Promo Code</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Code *</Label>
                                    <Input
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="SAVE20"
                                        required
                                        className="bg-gray-900 border-gray-700"
                                    />
                                </div>

                                <div>
                                    <Label>Discount Type *</Label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>Discount Value *</Label>
                                    <Input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                                        placeholder={formData.discountType === "percentage" ? "20" : "500"}
                                        required
                                        min="0"
                                        className="bg-gray-900 border-gray-700"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formData.discountType === "percentage" ? "Enter percentage (0-100)" : "Enter amount in ₹"}
                                    </p>
                                </div>

                                <div>
                                    <Label>Applicable To</Label>
                                    <select
                                        value={formData.applicableTo}
                                        onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                                    >
                                        <option value="both">Both</option>
                                        <option value="course">Courses Only</option>
                                        <option value="internship">Internships Only</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>Max Uses (Optional)</Label>
                                    <Input
                                        type="number"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                        placeholder="Leave empty for unlimited"
                                        min="1"
                                        className="bg-gray-900 border-gray-700"
                                    />
                                </div>

                                <div>
                                    <Label>Expires At (Optional)</Label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                        className="bg-gray-900 border-gray-700"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                Create Promo Code
                            </Button>
                        </form>
                    </div>
                )}

                {/* Promo Codes List */}
                <div className="space-y-4">
                    {promoCodes.length === 0 ? (
                        <div className="bg-gray-800/30 rounded-xl p-12 text-center border border-gray-700">
                            <Tag className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                            <p className="text-gray-400">No promo codes yet. Create one to get started!</p>
                        </div>
                    ) : (
                        promoCodes.map((promo) => (
                            <div
                                key={promo._id}
                                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl font-bold text-blue-400">{promo.code}</span>
                                            {promo.isActive ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Discount</p>
                                                <p className="text-white font-semibold">
                                                    {promo.discountType === "percentage"
                                                        ? `${promo.discountValue}%`
                                                        : `₹${promo.discountValue}`}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Applicable To</p>
                                                <p className="text-white font-semibold capitalize">{promo.applicableTo}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Usage</p>
                                                <p className="text-white font-semibold">
                                                    {promo.usedCount} / {promo.maxUses || "∞"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400">Expires</p>
                                                <p className="text-white font-semibold">
                                                    {promo.expiresAt
                                                        ? new Date(promo.expiresAt).toLocaleDateString()
                                                        : "Never"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleDelete(promo._id)}
                                        variant="ghost"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
