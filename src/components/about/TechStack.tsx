"use client";

import { Code2, Layout, FileJson, Server, Container, Database, Cloud, GitBranch } from "lucide-react";

const techStack = [
    { name: "React", icon: Code2, color: "text-blue-400" },
    { name: "Next.js", icon: Layout, color: "text-slate-100" },
    { name: "JavaScript", icon: FileJson, color: "text-amber-400" },
    { name: "Node.js", icon: Server, color: "text-emerald-400" },
    { name: "Python", icon: Code2, color: "text-amber-400" },
    { name: "TypeScript", icon: Code2, color: "text-blue-400" },
    { name: "Docker", icon: Container, color: "text-sky-400" },
    { name: "MongoDB", icon: Database, color: "text-emerald-400" },
    { name: "AWS Cloud", icon: Cloud, color: "text-amber-400" },
    { name: "Git & GitHub", icon: GitBranch, color: "text-rose-400" },
    { name: "System Design", icon: Layout, color: "text-indigo-400" },
];

export function TechStack() {
    return (
        <section className="py-8 border-y border-slate-800/80 bg-[#06090e] overflow-hidden relative z-10">
            <div className="text-center mb-6">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    Industry Tools & Production Technologies
                </span>
            </div>
            
            <div className="flex overflow-hidden group">
                <div className="flex animate-scroll hover:pause-scroll gap-6 md:gap-10 whitespace-nowrap">
                    {[...techStack, ...techStack].map((tech, i) => (
                        <div 
                            key={i} 
                            className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm font-semibold text-slate-300"
                        >
                            <tech.icon size={16} className={tech.color} />
                            <span>{tech.name}</span>
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
                .hover\\:pause-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
