"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

const blogPosts = [
    {
        id: 1,
        title: "The Future of Web Development in 2025",
        excerpt: "Explore the latest trends and technologies shaping the web development landscape, from AI-driven coding to WebAssembly.",
        author: "Alex Johnson",
        date: "Nov 15, 2024",
        category: "Technology",
        image: "bg-blue-500/10"
    },
    {
        id: 2,
        title: "Mastering React Server Components",
        excerpt: "A deep dive into Next.js App Router and how React Server Components are changing the way we build performant applications.",
        author: "Sarah Chen",
        date: "Nov 10, 2024",
        category: "Development",
        image: "bg-purple-500/10"
    },
    {
        id: 3,
        title: "How to Land Your First Tech Internship",
        excerpt: "Practical tips and strategies for students to stand out in the competitive tech internship market.",
        author: "Mike Wilson",
        date: "Nov 05, 2024",
        category: "Career",
        image: "bg-green-500/10"
    },
    {
        id: 4,
        title: "UI/UX Design Principles for Developers",
        excerpt: "Essential design concepts that every developer should know to build better, more user-friendly interfaces.",
        author: "Emily Davis",
        date: "Oct 28, 2024",
        category: "Design",
        image: "bg-orange-500/10"
    },
    {
        id: 5,
        title: "The Rise of AI Agents in Software Engineering",
        excerpt: "How autonomous AI agents are assisting developers in writing, debugging, and deploying code faster than ever.",
        author: "David Kim",
        date: "Oct 20, 2024",
        category: "AI",
        image: "bg-red-500/10"
    },
    {
        id: 6,
        title: "Building Scalable Backend Systems with Node.js",
        excerpt: "Best practices for designing and implementing robust backend architectures that can handle millions of users.",
        author: "Chris Martin",
        date: "Oct 15, 2024",
        category: "Backend",
        image: "bg-teal-500/10"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8 bg-gradient-to-b from-blue-900/20 to-transparent">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">Blog</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Insights, tutorials, and stories from the world of technology and education.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article key={post.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all group flex flex-col h-full">
                                <div className={`h-48 w-full ${post.image} flex items-center justify-center`}>
                                    <span className="text-white/20 font-bold text-4xl">Image</span>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-300">
                                            {post.category}
                                        </span>
                                        <div className="flex items-center text-gray-500 text-xs">
                                            <Calendar size={14} className="mr-1" />
                                            {post.date}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <User size={14} className="mr-2" />
                                            {post.author}
                                        </div>
                                        <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                                            Read More <ArrowRight size={14} className="ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
