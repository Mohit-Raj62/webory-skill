"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Search,
    Filter,
    Check,
    X,
    Star,
    Trash2,
    Eye,
    Clock,
    User,
    ChevronDown,
    AlertCircle,
    EyeOff,
} from "lucide-react";

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    slug: string;
    status: "draft" | "pending" | "published" | "rejected";
    category: string;
    coverImage: string | null;
    readTime: number;
    isFeatured: boolean;
    rejectionReason: string | null;
    author: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
    };
    createdAt: string;
    publishedAt: string | null;
}

interface Stats {
    totalBlogs: number;
    pendingCount: number;
    publishedCount: number;
    draftCount: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: "Draft", color: "text-gray-300", bg: "bg-gray-500/20" },
    pending: { label: "Pending", color: "text-yellow-300", bg: "bg-yellow-500/20" },
    published: { label: "Published", color: "text-green-300", bg: "bg-green-500/20" },
    rejected: { label: "Rejected", color: "text-red-300", bg: "bg-red-500/20" },
};

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [stats, setStats] = useState<Stats>({ totalBlogs: 0, pendingCount: 0, publishedCount: 0, draftCount: 0 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/admin/blogs?${params}`);
            const data = await res.json();
            if (res.ok) {
                setBlogs(data.data);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [statusFilter]);

    const handleSearch = () => {
        setLoading(true);
        fetchBlogs();
    };

    const handleAction = async (id: string, action: string, extra?: any) => {
        setActionLoading(id);
        try {
            const body: any = { action, ...extra };
            const res = await fetch(`/api/admin/blogs/${id}`, {
                method: action === "delete" ? "DELETE" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: action === "delete" ? undefined : JSON.stringify(body),
            });
            if (res.ok) {
                if (action === "reject") setRejectingId(null);
                fetchBlogs();
            }
        } catch (error) {
            console.error("Action failed:", error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Blog Management</h1>
                <p className="text-gray-400 mt-1">Review, approve, and manage all blog posts</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Blogs", value: stats.totalBlogs, color: "blue", icon: FileText },
                    { label: "Pending Review", value: stats.pendingCount, color: "yellow", icon: Clock },
                    { label: "Published", value: stats.publishedCount, color: "green", icon: Check },
                    { label: "Drafts", value: stats.draftCount, color: "gray", icon: FileText },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white/5 border border-white/10 rounded-xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                            <stat.icon size={18} className="text-gray-500" />
                        </div>
                        <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search blogs by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {["all", "pending", "published", "draft", "rejected"].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setLoading(true); }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                statusFilter === s
                                    ? "bg-blue-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                            {s === "pending" && stats.pendingCount > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-yellow-500/30 text-yellow-300 rounded text-xs">
                                    {stats.pendingCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Blog List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-24 h-20 bg-white/10 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-3" />
                                    <div className="h-3 bg-white/10 rounded w-full mb-2" />
                                    <div className="h-3 bg-white/10 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-20">
                    <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
                    <p className="text-gray-400">No blogs match the current filters.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {blogs.map((blog) => {
                            const statusInfo = statusConfig[blog.status];
                            return (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            {blog.coverImage ? (
                                                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                                    <FileText size={24} className="text-white/20" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                    {blog.isFeatured && (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300">
                                                            ⭐ Featured
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500">{blog.category}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1 truncate">{blog.title}</h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-1">{blog.excerpt}</p>

                                            {/* Author & Meta */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {blog.author?.firstName} {blog.author?.lastName}
                                                </span>
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
                                        </div>

                                        {/* Actions */}
                                        <div className="flex md:flex-col items-center gap-2 flex-shrink-0">
                                            {blog.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(blog._id, "approve")}
                                                        disabled={actionLoading === blog._id}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-all disabled:opacity-50"
                                                    >
                                                        <Check size={14} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectingId(blog._id)}
                                                        disabled={actionLoading === blog._id}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                                                    >
                                                        <X size={14} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {blog.status === "published" && (
                                                <>
                                                    <a
                                                        href={`/blog/${blog.slug}`}
                                                        target="_blank"
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-all"
                                                    >
                                                        <Eye size={14} /> View
                                                    </a>
                                                    <button
                                                        onClick={() => handleAction(blog._id, "toggleFeatured")}
                                                        disabled={actionLoading === blog._id}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                                                            blog.isFeatured
                                                                ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                        }`}
                                                    >
                                                        <Star size={14} /> {blog.isFeatured ? "Unfeature" : "Feature"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Unpublish this blog?")) handleAction(blog._id, "unpublish");
                                                        }}
                                                        disabled={actionLoading === blog._id}
                                                        className="flex items-center gap-1.5 px-3 py-2 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/20 transition-all disabled:opacity-50"
                                                    >
                                                        <EyeOff size={14} /> Unpublish
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (confirm("Delete this blog permanently?")) handleAction(blog._id, "delete");
                                                }}
                                                disabled={actionLoading === blog._id}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reject Dialog */}
                                    {rejectingId === blog._id && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle size={18} className="text-red-400 mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-300 mb-2">Rejection reason (will be shown to author):</p>
                                                    <textarea
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        placeholder="Enter rejection reason..."
                                                        rows={2}
                                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm resize-none"
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleAction(blog._id, "reject", { reason: rejectReason })}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
                                                        >
                                                            Confirm Reject
                                                        </button>
                                                        <button
                                                            onClick={() => { setRejectingId(null); setRejectReason(""); }}
                                                            className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
