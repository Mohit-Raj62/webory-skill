"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Send,
    Eye,
    Clock,
    Search,
    Filter,
} from "lucide-react";
import Link from "next/link";

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    slug: string;
    status: "draft" | "pending" | "published" | "rejected";
    category: string;
    coverImage: string | null;
    readTime: number;
    rejectionReason: string | null;
    createdAt: string;
    publishedAt: string | null;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: "Draft", color: "text-gray-300", bg: "bg-gray-500/20" },
    pending: { label: "Pending Review", color: "text-yellow-300", bg: "bg-yellow-500/20" },
    published: { label: "Published", color: "text-green-300", bg: "bg-green-500/20" },
    rejected: { label: "Rejected", color: "text-red-300", bg: "bg-red-500/20" },
};

export default function TeacherBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            const params = new URLSearchParams();
            if (filter !== "all") params.set("status", filter);
            const res = await fetch(`/api/teacher/blogs?${params}`);
            const data = await res.json();
            if (res.ok) setBlogs(data.data);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [filter]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/teacher/blogs/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBlogs(blogs.filter((b) => b._id !== id));
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeleting(null);
        }
    };

    const handleSubmit = async (id: string) => {
        if (!confirm("Submit this blog for admin review?")) return;
        setSubmitting(id);
        try {
            const res = await fetch(`/api/teacher/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "submit" }),
            });
            if (res.ok) {
                fetchBlogs();
            }
        } catch (error) {
            console.error("Submit failed:", error);
        } finally {
            setSubmitting(null);
        }
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: blogs.length,
        draft: blogs.filter((b) => b.status === "draft").length,
        pending: blogs.filter((b) => b.status === "pending").length,
        published: blogs.filter((b) => b.status === "published").length,
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Blogs</h1>
                    <p className="text-gray-400 mt-1">Write and manage your blog posts</p>
                </div>
                <Link
                    href="/teacher/blogs/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all"
                >
                    <Plus size={20} />
                    Write New Blog
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total", value: stats.total, color: "blue" },
                    { label: "Drafts", value: stats.draft, color: "gray" },
                    { label: "Pending", value: stats.pending, color: "yellow" },
                    { label: "Published", value: stats.published, color: "green" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    {["all", "draft", "pending", "published", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                filter === s
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blog List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                            <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
                            <div className="h-3 bg-white/10 rounded w-full mb-2" />
                            <div className="h-3 bg-white/10 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-20">
                    <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
                    <p className="text-gray-400 mb-6">Start writing your first blog post!</p>
                    <Link
                        href="/teacher/blogs/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all"
                    >
                        <Plus size={20} /> Write New Blog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredBlogs.map((blog) => {
                            const statusInfo = statusConfig[blog.status];
                            return (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
                                >
                                    {/* Cover Image */}
                                    {blog.coverImage ? (
                                        <div className="h-40 overflow-hidden">
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                            <FileText size={32} className="text-white/20" />
                                        </div>
                                    )}

                                    <div className="p-5">
                                        {/* Status & Category */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-xs text-gray-500">{blog.category}</span>
                                        </div>

                                        {/* Title & Excerpt */}
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                            {blog.excerpt}
                                        </p>

                                        {/* Rejection reason */}
                                        {blog.status === "rejected" && blog.rejectionReason && (
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                                                <p className="text-red-300 text-xs">
                                                    <strong>Rejection Reason:</strong> {blog.rejectionReason}
                                                </p>
                                            </div>
                                        )}

                                        {/* Meta */}
                                        <div className="flex items-center gap-3 text-gray-500 text-xs mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} /> {blog.readTime} min read
                                            </span>
                                            <span>
                                                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                            {blog.status === "published" && (
                                                <Link
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-all"
                                                >
                                                    <Eye size={14} /> View
                                                </Link>
                                            )}
                                            <Link
                                                href={`/teacher/blogs/edit/${blog._id}`}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-all"
                                            >
                                                <Edit size={14} /> Edit
                                            </Link>
                                            {(blog.status === "draft" || blog.status === "rejected") && (
                                                <button
                                                    onClick={() => handleSubmit(blog._id)}
                                                    disabled={submitting === blog._id}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-all disabled:opacity-50"
                                                >
                                                    <Send size={14} />
                                                    {submitting === blog._id ? "Submitting..." : "Submit for Review"}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                disabled={deleting === blog._id}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-all ml-auto disabled:opacity-50"
                                            >
                                                <Trash2 size={14} />
                                                {deleting === blog._id ? "..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
