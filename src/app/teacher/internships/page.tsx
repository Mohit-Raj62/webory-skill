"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Video, ClipboardList, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Internship {
    _id: string;
    title: string;
    description: string;
    level: string;
    price: number;
    studentsCount: string;
    videos: any[];
    createdAt: string;
}

export default function TeacherInternshipsPage() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const res = await fetch("/api/teacher/internships");
            if (res.ok) {
                const data = await res.json();
                setInternships(data.data || []);
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
            const res = await fetch(`/api/teacher/internships/${internshipId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setInternships(internships.filter((c) => c._id !== internshipId));
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
        internship.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-4xl font-bold text-white mb-2">My Internships</h1>
                    <p className="text-gray-400">Manage your internships and content</p>
                </div>
                <Link href="/teacher/internships/create" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus size={20} className="mr-2" />
                        Create New Internship
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
                    <p className="text-gray-400 text-sm mb-1">Total Videos</p>
                    <p className="text-3xl font-bold text-white">
                        {internships.reduce((sum, c) => sum + (c.videos?.length || 0), 0)}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">
                        ₹{internships.reduce((sum, c) => sum + c.price, 0)}
                    </p>
                </div>
            </div>

            {/* Internships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map((internship) => (
                    <div key={internship._id} className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">{internship.title}</h3>
                            <div className="flex gap-2">
                                <Link href={`/teacher/internships/${internship._id}/edit`}>
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
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {internship.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {internship.level}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <Video size={16} />
                                {internship.videos?.length || 0} videos
                            </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-bold text-white">₹{internship.price}</span>
                                <span className="text-gray-400 text-sm">{internship.studentsCount} students</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Link href={`/teacher/internships/${internship._id}/quizzes`}>
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <ClipboardList size={16} className="mr-1" />
                                        Quizzes
                                    </Button>
                                </Link>
                                <Link href={`/teacher/internships/${internship._id}/assignments`}>
                                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                                        <FileText size={16} className="mr-1" />
                                        Assignments
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredInternships.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No internships found
                </div>
            )}
        </div>
    );
}
