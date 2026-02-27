"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Calendar, User, ArrowLeft, Clock, Share2, Tag } from "lucide-react";
import Link from "next/link";

interface Blog {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    coverImage: string | null;
    category: string;
    tags: string[];
    readTime: number;
    publishedAt: string;
    author: {
        firstName: string;
        lastName: string;
        avatar: string | null;
        bio: string;
        expertise: string;
    };
}

interface RelatedBlog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    readTime: number;
    author: {
        firstName: string;
        lastName: string;
    };
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [related, setRelated] = useState<RelatedBlog[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs?slug=${slug}`);
                const data = await res.json();
                if (res.ok && data.data) {
                    setBlog(data.data);
                    setRelated(data.related || []);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog?.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-20">
                    <div className="animate-pulse">
                        <div className="h-8 bg-white/10 rounded w-3/4 mb-6" />
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-12" />
                        <div className="h-64 bg-white/5 rounded-2xl mb-8" />
                        <div className="space-y-4">
                            <div className="h-4 bg-white/10 rounded w-full" />
                            <div className="h-4 bg-white/10 rounded w-5/6" />
                            <div className="h-4 bg-white/10 rounded w-4/6" />
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    if (notFound || !blog) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-400 mb-6">
                        The blog post you are looking for does not exist or has been removed.
                    </p>
                    <Link href="/blog" className="text-blue-400 hover:text-blue-300">
                        ← Back to Blog
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <article className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-20">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Blog
                </Link>

                {/* Category & Tags */}
                <div className="flex items-center gap-2 flex-wrap mb-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-300">
                        {blog.category}
                    </span>
                    {blog.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-gray-400"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {blog.title}
                </h1>

                {/* Author & Meta */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {blog.author?.avatar ? (
                                <img
                                    src={blog.author.avatar}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <User size={18} className="text-purple-400" />
                                </div>
                            )}
                            <div>
                                <p className="text-white font-medium text-sm">
                                    {blog.author?.firstName} {blog.author?.lastName}
                                </p>
                                {blog.author?.expertise && (
                                    <p className="text-gray-500 text-xs">{blog.author.expertise}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} /> {blog.readTime} min read
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-sm transition-all"
                    >
                        <Share2 size={16} /> Share
                    </button>
                </div>

                {/* Cover Image */}
                {blog.coverImage && (
                    <div className="rounded-2xl overflow-hidden mb-10">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    style={{ color: "#d1d5db" }}
                />

                {/* Related Posts */}
                {related.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6">Related Posts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/blog/${post.slug}`}
                                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
                                >
                                    <div className="h-32 overflow-hidden">
                                        {post.coverImage ? (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                            {post.title}
                                        </h4>
                                        <p className="text-gray-500 text-xs">
                                            {post.readTime} min read · {post.author?.firstName} {post.author?.lastName}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back link */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to all posts
                    </Link>
                </div>
            </article>

            <Footer />
        </main>
    );
}
