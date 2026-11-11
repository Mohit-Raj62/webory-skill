"use client";

import { Code2, GitPullRequest, Laptop, Award } from "lucide-react";

const steps = [
    { 
        step: "01",
        title: "Concept & Architecture", 
        desc: "Deep-dive into core computer science and software design patterns with interactive documentation and industry-aligned masterclasses.", 
        icon: Laptop 
    },
    { 
        step: "02",
        title: "Production Building", 
        desc: "Write clean, modular code for real industrial use cases on GitHub, learning Git workflows, tests, and CI/CD pipelines.", 
        icon: Code2 
    },
    { 
        step: "03",
        title: "Code Review & Refactoring", 
        desc: "Receive line-by-line feedback from experienced senior engineers and IIT alumni mentors simulating real workplace code reviews.", 
        icon: GitPullRequest 
    },
    { 
        step: "04",
        title: "Portfolio & Placement", 
        desc: "Deploy capstone projects to production and earn a government-recognized MSME certificate to showcase to top hiring partners.", 
        icon: Award 
    }
];

export function LearningPath() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Proven Pedagogy
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        How You Learn at Webory
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        A structured 4-step framework engineered to transition beginners and college students into confident, hireable software developers.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {steps.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-md group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-mono text-2xl font-bold text-blue-400">
                                        {item.step}
                                    </span>
                                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center">
                                        <item.icon size={18} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

