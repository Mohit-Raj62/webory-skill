"use client";

import { Code2, Layout, FileJson, Server, Container, Database, Cloud, GitBranch } from "lucide-react";

const techStack = [
    { name: "React", icon: Code2, color: "text-blue-400" },
    { name: "Next.js", icon: Layout, color: "text-white" },
    { name: "JavaScript", icon: FileJson, color: "text-yellow-400" },
    { name: "Node.js", icon: Server, color: "text-green-500" },
    { name: "Python", icon: Code2, color: "text-yellow-400" },
    { name: "TypeScript", icon: Code2, color: "text-blue-500" },
    { name: "Docker", icon: Container, color: "text-blue-400" },
    { name: "MongoDB", icon: Database, color: "text-green-400" },
    { name: "AWS", icon: Cloud, color: "text-orange-400" },
    { name: "Git", icon: GitBranch, color: "text-red-500" },
    { name: "Figma", icon: Layout, color: "text-purple-400" },
];

export function TechStack() {
    return (
        <section className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden relative z-10">
            <div className="text-center mb-8">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Powering Next-Gen Applications</p>
            </div>
            
            <div className="flex overflow-hidden group">
                <div className="flex animate-scroll hover:pause-scroll gap-6 md:gap-12 whitespace-nowrap">
                    {[...techStack, ...techStack].map((tech, i) => (
                        <div key={i} className="flex items-center gap-3 text-lg md:text-2xl font-bold px-4">
                            <tech.icon className={`w-6 h-6 md:w-8 md:h-8 ${tech.color}`} />
                            <span className="text-gray-400">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                    display: flex;
                    width: max-content;
                }
                .hover\:pause-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
