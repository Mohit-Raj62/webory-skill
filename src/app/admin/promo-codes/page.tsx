"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Tag, X, Check } from "lucide-react";
import Link from "next/link";

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        maxUses: "",
        expiresAt: "",
        isActive: true,
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const res = await fetch("/api/admin/promo-codes");
            if (res.ok) {
                const data = await res.json();
                setPromoCodes(data.promoCodes);
            }
        } catch (error) {
            console.error("Failed to fetch promo codes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `/api/admin/promo-codes/${editingId}`
                : "/api/admin/promo-codes";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    maxUses: formData.maxUses ? Number(formData.maxUses) : null,
                    expiresAt: formData.expiresAt || null,
                }),
            });

            if (res.ok) {
                fetchPromoCodes();
                closeModal();
                alert(editingId ? "Promo code updated!" : "Promo code created!");
            } else {
                const data = await res.json();
                alert(data.error || "Operation failed");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promo code?")) return;

        try {
            const res = await fetch(`/api/admin/promo-codes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPromoCodes(promoCodes.filter((code) => code._id !== id));
            } else {
                alert("Failed to delete promo code");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete promo code");
        }
    };

    const openModal = (code?: any) => {
        if (code) {
            setEditingId(code._id);
            setFormData({
                code: code.code,
                discountType: code.discountType,
                discountValue: code.discountValue,
                minOrderValue: code.minOrderValue || 0,
                maxUses: code.maxUses || "",
                expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().split('T')[0] : "",
                isActive: code.isActive,
            });
        } else {
            setEditingId(null);
            setFormData({
                code: "",
                discountType: "percentage",
                discountValue: 0,
                minOrderValue: 0,
                maxUses: "",
                expiresAt: "",
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Promo Codes</h1>
                    <p className="text-gray-400">Manage discount coupons</p>
                </div>
                <Button
                    onClick={() => openModal()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Plus size={20} className="mr-2" />
                    Create New
                </Button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {promoCodes.map((code) => (
                        <div
                            key={code._id}
                            className="glass-card p-6 rounded-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Tag size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white">{code.code}</h3>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${code.isActive
                                                    ? "bg-green-500/20 text-green-300"
                                                    : "bg-red-500/20 text-red-300"
                                                }`}
                                        >
                                            {code.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${code.discountType === "percentage"
                                                    ? "bg-purple-500/20 text-purple-300"
                                                    : "bg-blue-500/20 text-blue-300"
                                                }`}
                                        >
                                            {code.discountType === "percentage" ? "Percentage" : "Fixed Amount"}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        <span className="text-white font-medium">
                                            {code.discountType === "percentage"
                                                ? `${code.discountValue}% Off`
                                                : `₹${code.discountValue} Off`}
                                        </span>
                                        {code.minOrderValue > 0 && (
                                            <span className="text-yellow-400 ml-2">
                                                • Min Order: ₹{code.minOrderValue}
                                            </span>
                                        )}
                                        <span className="ml-2 text-gray-500">
                                            • Used: {code.usedCount}
                                            {code.maxUses ? ` / ${code.maxUses}` : ""}
                                        </span>
                                        {code.expiresAt && (
                                            <span className="ml-2 text-gray-500">
                                                • Expires: {new Date(code.expiresAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openModal(code)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <Edit size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(code._id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {promoCodes.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No promo codes found. Create one to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingId ? "Edit Promo Code" : "New Promo Code"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g., SUMMER2024"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Type</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Value</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Minimum Order Value (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.minOrderValue}
                                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                                    placeholder="0 for no minimum"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Max Uses</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                                        placeholder="Unlimited"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Expires At</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.expiresAt}
                                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-4 h-4 rounded border-gray-300"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-white cursor-pointer">
                                    Active
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 mt-4"
                            >
                                {editingId ? "Update Code" : "Create Code"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
