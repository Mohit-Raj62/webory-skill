"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Send,
    X,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import Link from "next/link";

const categories = [
    "Technology", "Development", "Career", "Design", "AI",
    "Backend", "Frontend", "DevOps", "Mobile", "Other",
];

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const blogId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [blogStatus, setBlogStatus] = useState("");
    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Other",
        tags: "",
        coverImage: "",
    });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/teacher/blogs/${blogId}`);
                const data = await res.json();
                if (res.ok && data.data) {
                    const blog = data.data;
                    setForm({
                        title: blog.title || "",
                        excerpt: blog.excerpt || "",
                        content: blog.content || "",
                        category: blog.category || "Other",
                        tags: (blog.tags || []).join(", "),
                        coverImage: blog.coverImage || "",
                    });
                    setBlogStatus(blog.status);
                } else {
                    alert("Blog not found");
                    router.push("/teacher/blogs");
                }
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                router.push("/teacher/blogs");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload/blog-image", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setForm({ ...form, coverImage: data.url });
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (submitForReview = false) => {
        if (!form.title.trim() || !form.content.trim() || !form.excerpt.trim()) {
            alert("Please fill in title, excerpt, and content");
            return;
        }

        setSaving(true);
        try {
            const tags = form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            // First update the blog content
            const res = await fetch(`/api/teacher/blogs/${blogId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, tags }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to save");
                return;
            }

            // Then submit if requested
            if (submitForReview) {
                const submitRes = await fetch(`/api/teacher/blogs/${blogId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "submit" }),
                });
                if (!submitRes.ok) {
                    const data = await submitRes.json();
                    alert(data.error || "Failed to submit");
                    return;
                }
            }

            router.push("/teacher/blogs");
        } catch (error) {
            alert("Failed to save blog");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={32} className="text-purple-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/blogs"
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-gray-400"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Blog</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Status: <span className="capitalize font-medium">{blogStatus}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Cover Image */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Cover Image
                    </label>
                    {form.coverImage ? (
                        <div className="relative rounded-xl overflow-hidden h-52">
                            <img
                                src={form.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setForm({ ...form, coverImage: "" })}
                                className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg text-white hover:bg-black/80"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-52 bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500/50 transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {uploading ? (
                                <div className="text-purple-400 font-medium">Uploading...</div>
                            ) : (
                                <>
                                    <ImageIcon size={32} className="text-gray-500 mb-2" />
                                    <span className="text-gray-400 text-sm">
                                        Click to upload cover image
                                    </span>
                                </>
                            )}
                        </label>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Enter blog title..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Excerpt * <span className="text-gray-500 font-normal">(Short summary, max 300 chars)</span>
                    </label>
                    <textarea
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        placeholder="Brief summary of the blog..."
                        maxLength={300}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                    <p className="text-xs text-gray-600 mt-1">{form.excerpt.length}/300</p>
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Category
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c} className="bg-gray-900">
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                            Tags <span className="text-gray-500 font-normal">(comma separated)</span>
                        </label>
                        <input
                            type="text"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                            placeholder="react, nextjs, web dev"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Content * <span className="text-gray-500 font-normal">(HTML supported)</span>
                    </label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        placeholder="Write your blog content here..."
                        rows={20}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-y font-mono text-sm"
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    {(blogStatus === "draft" || blogStatus === "rejected") && (
                        <button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                        >
                            <Send size={18} />
                            {saving ? "Saving..." : "Save & Submit for Review"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
