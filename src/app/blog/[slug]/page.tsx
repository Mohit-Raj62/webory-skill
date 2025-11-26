"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock blog data - in production, this would come from a database or CMS
const blogPosts: Record<string, any> = {
    "future-of-web-development": {
        title: "The Future of Web Development in 2025",
        author: "Alex Johnson",
        date: "Nov 15, 2024",
        category: "Technology",
        content: `
            <p>The web development landscape is evolving rapidly, with new technologies and paradigms emerging every year. As we look towards 2025, several key trends are shaping the future of how we build for the web.</p>
            
            <h2>AI-Driven Development</h2>
            <p>Artificial Intelligence is no longer just a buzzword—it's becoming an integral part of the development workflow. From code completion to automated testing, AI tools are helping developers work faster and smarter.</p>
            
            <h2>WebAssembly Goes Mainstream</h2>
            <p>WebAssembly (Wasm) is finally reaching mainstream adoption, allowing developers to run high-performance applications in the browser using languages like Rust, C++, and Go.</p>
            
            <h2>The Rise of Edge Computing</h2>
            <p>Edge computing is bringing computation closer to users, reducing latency and improving performance. Platforms like Cloudflare Workers and Vercel Edge Functions are making it easier than ever to deploy code at the edge.</p>
        `
    },
    "mastering-react-server-components": {
        title: "Mastering React Server Components",
        author: "Sarah Chen",
        date: "Nov 10, 2024",
        category: "Development",
        content: `
            <p>React Server Components represent a paradigm shift in how we think about building React applications. They allow us to render components on the server, reducing JavaScript bundle sizes and improving performance.</p>
            
            <h2>What Are Server Components?</h2>
            <p>Server Components are React components that run exclusively on the server. They can access backend resources directly, without the need for API routes or client-side data fetching.</p>
            
            <h2>Benefits</h2>
            <ul>
                <li>Reduced bundle size</li>
                <li>Direct database access</li>
                <li>Improved SEO</li>
                <li>Better performance</li>
            </ul>
        `
    }
};

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const post = blogPosts[slug];

    if (!post) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-20 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist.</p>
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
                <Link href="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
                    <ArrowLeft size={16} className="mr-2" /> Back to Blog
                </Link>

                <div className="mb-8">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-blue-300">
                        {post.category}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{post.title}</h1>

                <div className="flex items-center gap-6 text-gray-400 text-sm mb-12 pb-8 border-b border-white/10">
                    <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        {post.author}
                    </div>
                    <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {post.date}
                    </div>
                </div>

                <div
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={{
                        color: '#d1d5db'
                    }}
                />

                <div className="mt-16 pt-8 border-t border-white/10">
                    <Link href="/blog" className="inline-flex items-center text-blue-400 hover:text-blue-300">
                        <ArrowLeft size={16} className="mr-2" /> Back to all posts
                    </Link>
                </div>
            </article>

            <Footer />
        </main>
    );
}
