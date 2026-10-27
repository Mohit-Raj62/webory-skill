"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Code2, 
    Bot, 
    Database, 
    Zap, 
    Briefcase, 
    Check, 
    Lock, 
    Play, 
    ArrowRight,
    TrendingUp,
    Clock,
    Layers,
    BookOpen
} from "lucide-react";

export interface RoadmapTrack {
    id: string;
    label: string;
    title: string;
    description: string;
    duration: string;
    avgSalary: string;
    projectsCount: string;
    progress: number;
    icon: any;
    techStack: string[];
    steps: {
        title: string;
        note: string;
        state: "done" | "now" | "locked";
        milestone: string;
    }[];
}

export const ROADMAP_TRACKS: RoadmapTrack[] = [
    {
        id: "fullstack",
        label: "Full-Stack AI",
        title: "Full-Stack GenAI Developer",
        description: "Master modern enterprise web development with Next.js 15, PostgreSQL, and autonomous GenAI / RAG architectures.",
        duration: "14 Weeks",
        avgSalary: "₹8.5 - 18 LPA",
        projectsCount: "4 Production Apps",
        progress: 65,
        icon: Code2,
        techStack: ["Next.js 15", "React 19", "TypeScript", "Node.js", "PostgreSQL", "LangChain"],
        steps: [
            { 
                milestone: "M1",
                title: "HTML5, Tailwind & Modern JavaScript ES6+", 
                note: "Core fundamentals, asynchronous JS, DOM manipulation & responsive design", 
                state: "done" 
            },
            { 
                milestone: "M2",
                title: "React 19, TypeScript & Next.js App Router", 
                note: "Server components, state management, custom hooks & type safety", 
                state: "done" 
            },
            { 
                milestone: "M3",
                title: "Build AI SaaS Platform & RAG System", 
                note: "Active Live Sprint: Vector databases, LangChain orchestration & OpenAI APIs", 
                state: "now" 
            },
            { 
                milestone: "M4",
                title: "Node.js, Express & Scalable PostgreSQL", 
                note: "Prisma ORM, relational indexing, auth sessions & high-throughput REST APIs", 
                state: "locked" 
            },
            { 
                milestone: "M5",
                title: "Verified Credential & 1:1 IIT Mentorship", 
                note: "Capstone code defense, official experience credential & placement referrals", 
                state: "locked" 
            },
        ],
    },
    {
        id: "genai",
        label: "GenAI & LLMs",
        title: "Generative AI Engineer",
        description: "Build cutting-edge autonomous agents, fine-tune open-weights models (LLaMA/Mistral), and deploy production RAG pipelines.",
        duration: "12 Weeks",
        avgSalary: "₹10 - 24 LPA",
        projectsCount: "3 AI Multi-Agents",
        progress: 45,
        icon: Bot,
        techStack: ["Python", "LangChain", "OpenAI / LLaMA", "ChromaDB", "PyTorch", "vLLM"],
        steps: [
            { 
                milestone: "M1",
                title: "Python for AI, Linear Algebra & Vector Math", 
                note: "Core Python 3.12, matrix transformations, tensors & API integrations", 
                state: "done" 
            },
            { 
                milestone: "M2",
                title: "LangChain, Vector DBs & RAG Workflows", 
                note: "Context chunking, hybrid search with ChromaDB & prompt engineering", 
                state: "done" 
            },
            { 
                milestone: "M3",
                title: "Autonomous Multi-Agent Swarms", 
                note: "Active Live Sprint: LangGraph, function-calling tools & self-healing workflows", 
                state: "now" 
            },
            { 
                milestone: "M4",
                title: "Fine-Tuning Open Source LLMs (LoRA/QLoRA)", 
                note: "GPU parameter-efficient tuning, model evaluation & HuggingFace pipelines", 
                state: "locked" 
            },
            { 
                milestone: "M5",
                title: "Deploy Production AI Systems & APIs", 
                note: "vLLM serving, latency optimization, Dockerization & enterprise evaluation", 
                state: "locked" 
            },
        ],
    },
    {
        id: "datascience",
        label: "Data & ML",
        title: "Data Science & Machine Learning",
        description: "Transform raw datasets into predictive intelligence. Master statistical modeling, neural networks, and automated MLOps pipelines.",
        duration: "12 Weeks",
        avgSalary: "₹7.5 - 16 LPA",
        projectsCount: "5 Predictive Models",
        progress: 55,
        icon: Database,
        techStack: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau", "Neural Networks"],
        steps: [
            { 
                milestone: "M1",
                title: "Python for Data Analysis & Advanced SQL", 
                note: "Data manipulation, complex window functions, aggregations & EDA", 
                state: "done" 
            },
            { 
                milestone: "M2",
                title: "Data Wrangling with Pandas & NumPy", 
                note: "Real financial and e-commerce dataset cleaning & feature engineering", 
                state: "done" 
            },
            { 
                milestone: "M3",
                title: "Supervised & Unsupervised Machine Learning", 
                note: "Active Live Sprint: Scikit-learn algorithms, hyperparameter tuning & churn models", 
                state: "now" 
            },
            { 
                milestone: "M4",
                title: "Deep Learning with TensorFlow & Keras", 
                note: "Computer vision, image classifiers & natural language NLP pipelines", 
                state: "locked" 
            },
            { 
                milestone: "M5",
                title: "Data Analytics Portfolio & IIT Credential", 
                note: "Executive dashboard presentations, case-study review & placement clearance", 
                state: "locked" 
            },
        ],
    },
    {
        id: "python",
        label: "Python Core",
        title: "Python Backend & Automation",
        description: "Become a proficient backend engineer. Write idiomatic, concurrent Python, build resilient APIs, and automate enterprise workflows.",
        duration: "8 Weeks",
        avgSalary: "₹6.5 - 14 LPA",
        projectsCount: "4 Real World Scripts",
        progress: 75,
        icon: Zap,
        techStack: ["Python 3.12", "FastAPI", "OOPs", "Web Scraping", "Docker", "PostgreSQL"],
        steps: [
            { 
                milestone: "M1",
                title: "Python Syntax, Data Structures & Logic", 
                note: "Advanced OOP concepts, generators, decorators & algorithmic thinking", 
                state: "done" 
            },
            { 
                milestone: "M2",
                title: "OOPs, Decorators & System Design Patterns", 
                note: "25+ LeetCode Medium challenges & production coding standards", 
                state: "done" 
            },
            { 
                milestone: "M3",
                title: "FastAPI REST API & Automated Scraper Bot", 
                note: "Active Live Sprint: AsyncIO, high-throughput scraping & database persistence", 
                state: "now" 
            },
            { 
                milestone: "M4",
                title: "Database Integration with SQLAlchemy", 
                note: "JWT authentication, alembic migrations & Docker containerization", 
                state: "locked" 
            },
            { 
                milestone: "M5",
                title: "Verified Python Developer Certificate", 
                note: "Direct code audit, instant QR verification & project showcase", 
                state: "locked" 
            },
        ],
    },
    {
        id: "internship",
        label: "Live Internship",
        title: "Production Industry Internship",
        description: "Work on live client repositories with senior tech leads, participate in agile standups, and earn a verified company LOR.",
        duration: "8 Weeks",
        avgSalary: "Stipend + LOR",
        projectsCount: "Live Client Project",
        progress: 50,
        icon: Briefcase,
        techStack: ["Live Repo", "Git PR Reviews", "Agile Sprints", "CI/CD", "Client Brief", "Verified LOR"],
        steps: [
            { 
                milestone: "M1",
                title: "Client Architecture Brief & Team Onboarding", 
                note: "Git branching flow, issue tracking setup & codebase orientation", 
                state: "done" 
            },
            { 
                milestone: "M2",
                title: "Frontend UI/UX & Responsive Core Features", 
                note: "Weekly sprint deliverables & code reviews by senior engineering lead", 
                state: "done" 
            },
            { 
                milestone: "M3",
                title: "Backend API Integration & Security Audits", 
                note: "Active Live Sprint: API testing, rate-limiting & performance benchmarking", 
                state: "now" 
            },
            { 
                milestone: "M4",
                title: "CI/CD Pipeline & Production Launch", 
                note: "Automated test runs, staging deployment & production go-live", 
                state: "locked" 
            },
            { 
                milestone: "M5",
                title: "Experience Certificate & Letter of Recommendation", 
                note: "Official company LOR signed by Director with verified QR credential", 
                state: "locked" 
            },
        ],
    },
];

export function InteractiveRoadmapCard({ className = "" }: { className?: string }) {
    const [activeTrackIndex, setActiveTrackIndex] = useState(0);
    const activeTrack = ROADMAP_TRACKS[activeTrackIndex];

    return (
        <div className={`rounded-2xl border border-slate-800 bg-[#0B0F19] shadow-xl overflow-hidden ${className}`}>
            
            {/* Professional Track Selector Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-[#0E1322]">
                <div 
                    className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {ROADMAP_TRACKS.map((t, idx) => {
                        const isActive = idx === activeTrackIndex;
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveTrackIndex(idx)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                                    isActive
                                        ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                                }`}
                            >
                                <Icon size={14} className={isActive ? "text-blue-400" : "text-slate-500"} />
                                <span>{t.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area - Split 2-Column Professional Layout */}
            <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                
                {/* LEFT COLUMN: Track Overview & Metadata (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Track Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                Engineering Track
                            </span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Active Sprint
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {activeTrack.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                            {activeTrack.description}
                        </p>
                    </div>

                    {/* Quick Outcome Metrics */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                                <Clock size={12} className="text-slate-400" />
                                <span>Program Duration</span>
                            </div>
                            <div className="text-sm font-semibold text-white">
                                {activeTrack.duration}
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                                <TrendingUp size={12} className="text-emerald-400" />
                                <span>Target CTC</span>
                            </div>
                            <div className="text-sm font-semibold text-emerald-400">
                                {activeTrack.avgSalary}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar - Clean and Non-Flashy */}
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-slate-400">Curriculum Sprint Progress</span>
                            <span className="font-medium text-slate-200">{activeTrack.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${activeTrack.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Tools & Frameworks */}
                    <div>
                        <div className="text-xs font-medium text-slate-400 mb-2">
                            Core Technologies:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {activeTrack.techStack.map((tech) => (
                                <span 
                                    key={tech}
                                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Standard, Professional Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <Link href="/courses" className="flex-1">
                            <button 
                                type="button"
                                className="w-full h-10 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                <Play size={13} className="fill-current text-slate-900" />
                                <span>Watch Module 1 Free</span>
                            </button>
                        </Link>
                        <Link href="#syllabus-intelligence" className="flex-1">
                            <button 
                                type="button"
                                className="w-full h-10 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <BookOpen size={13} className="text-slate-400" />
                                <span>Inspect Syllabus</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN: Milestone Timeline Progression (7 Cols) */}
                <div className="lg:col-span-7 bg-[#0E1322] rounded-xl p-4 sm:p-5 border border-slate-800">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Layers size={14} className="text-slate-400" />
                            <h4 className="text-xs sm:text-sm font-semibold text-white">
                                Phased Learning Milestones
                            </h4>
                        </div>
                        <span className="text-[11px] text-slate-400">
                            5 Progressive Steps
                        </span>
                    </div>

                    {/* Connected Milestones */}
                    <div className="relative space-y-2.5">
                        {/* Guideline */}
                        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-800 pointer-events-none" aria-hidden />

                        {activeTrack.steps.map((s) => {
                            const isDone = s.state === "done";
                            const isNow = s.state === "now";
                            const isLocked = s.state === "locked";

                            return (
                                <div
                                    key={s.title}
                                    className={`relative flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                        isNow 
                                            ? "bg-slate-900/90 border-slate-700"
                                            : "bg-slate-900/40 border-slate-800/80"
                                    }`}
                                >
                                    {/* Indicator Dot */}
                                    <div className="relative z-10 shrink-0 mt-0.5">
                                        {isDone && (
                                            <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center">
                                                <Check size={12} strokeWidth={2.5} />
                                            </div>
                                        )}
                                        {isNow && (
                                            <div className="h-6 w-6 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                            </div>
                                        )}
                                        {isLocked && (
                                            <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center">
                                                <Lock size={11} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                                                    {s.milestone}
                                                </span>
                                                <h5 className={`text-xs sm:text-sm font-semibold truncate ${
                                                    isLocked ? "text-slate-400" : "text-white"
                                                }`}>
                                                    {s.title}
                                                </h5>
                                            </div>

                                            {/* Status Badge */}
                                            {isDone && (
                                                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                                                    Completed
                                                </span>
                                            )}
                                            {isNow && (
                                                <span className="text-[10px] text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                                                    Active Sprint
                                                </span>
                                            )}
                                            {isLocked && (
                                                <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                                                    Upcoming
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {s.note}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
