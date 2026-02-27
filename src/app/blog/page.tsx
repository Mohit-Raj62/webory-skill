"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Calendar, User, ArrowRight, Search, Clock, Star } from "lucide-react";
import Link from "next/link";

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    slug: string;
    coverImage: string | null;
    category: string;
    readTime: number;
    isFeatured: boolean;
    publishedAt: string;
    author: {
        firstName: string;
        lastName: string;
        avatar: string | null;
    };
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCategory !== "all") params.set("category", activeCategory);
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/blogs?${params}`);
            const data = await res.json();
            if (res.ok) {
                setBlogs(data.data);
                if (data.categories) setCategories(data.categories);
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [activeCategory]);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8 bg-gradient-to-b from-blue-900/20 to-transparent">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">Blog</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                        Insights, tutorials, and stories from the world of technology and education.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchBlogs()}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            {categories.length > 0 && (
                <section className="px-4 md:px-8 pb-8">
                    <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                activeCategory === "all"
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeCategory === cat
                                        ? "bg-purple-600 text-white"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-48 bg-white/5" />
                                    <div className="p-6">
                                        <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
                                        <div className="h-3 bg-white/10 rounded w-full mb-2" />
                                        <div className="h-3 bg-white/10 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
                            <p className="text-gray-400">Check back later for new content!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <article
                                    key={blog._id}
                                    className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all group flex flex-col h-full"
                                >
                                    {/* Image */}
                                    <div className="h-48 w-full overflow-hidden relative">
                                        {blog.coverImage ? (
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                                <span className="text-white/20 font-bold text-4xl">Blog</span>
                                            </div>
                                        )}
                                        {blog.isFeatured && (
                                            <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500/80 backdrop-blur-sm rounded-full text-xs font-medium text-black flex items-center gap-1">
                                                <Star size={12} /> Featured
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-300">
                                                {blog.category}
                                            </span>
                                            <div className="flex items-center text-gray-500 text-xs gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} /> {blog.readTime} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                                            {blog.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                            <div className="flex items-center text-gray-400 text-sm gap-2">
                                                {blog.author?.avatar ? (
                                                    <img
                                                        src={blog.author.avatar}
                                                        alt=""
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                                {blog.author?.firstName} {blog.author?.lastName}
                                            </div>
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                                            >
                                                Read More <ArrowRight size={14} className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
