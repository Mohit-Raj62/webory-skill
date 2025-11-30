"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Internship {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    stipend: string;
    price: number;
    createdAt: string;
}

export default function InternshipsAdminPage() {
    const [internships, setInternships] = useState < Internship[] > ([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const res = await fetch("/api/internships");
            if (res.ok) {
                const data = await res.json();
                setInternships(data.internships || []);
            }
        } catch (error) {
            console.error("Failed to fetch internships", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (internshipId: string) => {
        if (!confirm("Are you sure you want to delete this internship?")) return;

        try {
            const res = await fetch(`/api/admin/internships/${internshipId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setInternships(internships.filter((i) => i._id !== internshipId));
                alert("Internship deleted successfully");
            } else {
                alert("Failed to delete internship");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete internship");
        }
    };

    const filteredInternships = internships.filter((internship) =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading internships...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Internship Management</h1>
                    <p className="text-gray-400">Manage all internship opportunities</p>
                </div>
                <Link href="/admin/internships/new" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                        <Plus size={20} className="mr-2" />
                        Add Internship
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search internships..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Internships</p>
                    <p className="text-3xl font-bold text-white">{internships.length}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Remote</p>
                    <p className="text-3xl font-bold text-white">
                        {internships.filter((i) => i.type === "Remote").length}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">On-site</p>
                    <p className="text-3xl font-bold text-white">
                        {internships.filter((i) => i.type === "On-site").length}
                    </p>
                </div>
            </div>

            {/* Internships Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Stipend</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInternships.map((internship) => (
                                <tr key={internship._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{internship.title}</td>
                                    <td className="px-6 py-4 text-gray-300">{internship.company}</td>
                                    <td className="px-6 py-4 text-gray-300">{internship.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${internship.type === "Remote"
                                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                            }`}>
                                            {internship.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{internship.stipend}</td>
                                    <td className="px-6 py-4 text-white font-semibold">₹{internship.price}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Link href={`/admin/internships/${internship._id}/edit`}>
                                                <button className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-blue-400">
                                                    <Edit size={18} />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(internship._id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <Link href={`/admin/internships/${internship._id}/tasks`}>
                                                <button className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors text-purple-400" title="Manage Tasks">
                                                    <FileText size={18} />
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredInternships.length === 0 && (
                    <div className="text-center py-12 text-gray-400">No internships found</div>
                )}
            </div>
        </div>
    );
}
