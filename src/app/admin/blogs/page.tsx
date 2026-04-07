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
    EyeOff,
    Maximize,
    ChevronLeft,
    ChevronRight,
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
    content: string;
    tags: string[];
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
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

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
                                            <div 
                                                className="flex-1 min-w-0 cursor-pointer"
                                                onClick={() => setSelectedBlog(blog)}
                                            >
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

                                                <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-blue-400 transition-colors">{blog.title}</h3>
                                                <p className="text-gray-400 text-sm mb-3 line-clamp-1">{blog.excerpt}</p>

                                                {/* Author & Meta */}
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Maximize size={12} className="text-blue-400" /> View Full Blog
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        {blog.author?.firstName} {blog.author?.lastName}
                                                    </span>
                                                    <span>•</span>
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

            {/* Blog Quick-View Modal */}
            <AnimatePresence>
                {selectedBlog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedBlog(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative h-48 md:h-64 shrink-0">
                                {selectedBlog.coverImage ? (
                                    <img 
                                        src={selectedBlog.coverImage} 
                                        alt={selectedBlog.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 flex items-center justify-center">
                                        <FileText size={64} className="text-white/10" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                                
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedBlog(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-md border border-white/10"
                                >
                                    <X size={20} />
                                </button>

                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig[selectedBlog.status].bg} ${statusConfig[selectedBlog.status].color}`}>
                                            {statusConfig[selectedBlog.status].label}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest border border-white/5">
                                            {selectedBlog.category}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                                        {selectedBlog.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-900">
                                {/* Author info row */}
                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                            <span className="text-blue-400 font-bold uppercase">{selectedBlog.author?.firstName?.[0]}</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{selectedBlog.author?.firstName} {selectedBlog.author?.lastName}</p>
                                            <p className="text-gray-500 text-xs">{selectedBlog.author?.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right text-gray-500 text-xs font-medium">
                                        <p>Created on {new Date(selectedBlog.createdAt).toLocaleDateString()}</p>
                                        <p className="mt-1">{selectedBlog.readTime} min read</p>
                                    </div>
                                </div>

                                {/* Main Blog Text */}
                                <div className="prose prose-invert max-w-none">
                                    <div 
                                        className="text-gray-300 leading-relaxed text-base md:text-lg space-y-4"
                                        dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                                    />
                                </div>

                                {/* Tags */}
                                {selectedBlog.tags?.length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-white/5">
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBlog.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs border border-white/5 italic">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer (Actions) */}
                            <div className="p-6 bg-black/40 border-t border-white/10 flex items-center justify-between shrink-0">
                                <div className="flex gap-4">
                                    {selectedBlog.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => { handleAction(selectedBlog._id, "approve"); setSelectedBlog(null); }}
                                                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-600/20"
                                            >
                                                Approve Post
                                            </button>
                                            <button
                                                onClick={() => { setRejectingId(selectedBlog._id); setSelectedBlog(null); }}
                                                className="px-6 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm transition-all"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {selectedBlog.status === 'published' && (
                                         <button
                                            onClick={() => { handleAction(selectedBlog._id, "unpublish"); setSelectedBlog(null); }}
                                            className="px-6 py-2.5 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-xl font-bold text-sm transition-all"
                                        >
                                            Unpublish Post
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedBlog(null)}
                                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-sm transition-all"
                                >
                                    Close Preview
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
