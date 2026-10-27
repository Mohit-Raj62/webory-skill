import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { InteractiveRoadmapCard } from "@/components/roadmap/interactive-roadmap";
import { TechCareerCalculator } from "@/components/landing/career-calculator";
import { Compass, TrendingUp, Layers, ArrowDown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Career Roadmaps & Tech Worth Intelligence | Webory Skills",
    description: "Explore production-ready engineering tracks, simulate real-time industry CTC compensation, and inspect comprehensive course syllabi with Webory Skills.",
};

export default function CareerRoadmapPage() {
    return (
        <main className="min-h-screen bg-[#070913] text-white selection:bg-blue-600/30 overflow-x-hidden font-sans">
            <Navbar />

            {/* Subtle Neutral Radial Accent (Restrained & Professional) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-slate-800/20 rounded-full blur-[140px] opacity-40" />
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.015]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24 max-w-7xl">
                
                {/* Clean, Handcrafted Header */}
                <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
                    {/* Professional Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span>Curated with Industry Leads & IIT Mandi Mentorship</span>
                    </div>

                    {/* Headline - Solid High-Contrast Typography (No AI Rainbow Gradients) */}
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                        Career Roadmaps & Tech Worth Intelligence
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Select a production engineering track, calculate real-time market compensation, and explore detailed course syllabi built for employability.
                    </p>

                    {/* Segmented Jump Navigation - Crisp, Linear-style Controls */}
                    <div className="pt-2">
                        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
                            <Link 
                                href="#career-tracks" 
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-medium transition-colors"
                            >
                                <Compass className="w-3.5 h-3.5 text-blue-400" />
                                <span>1. Career Tracks</span>
                                <ArrowDown className="w-3 h-3 text-slate-400" />
                            </Link>
                            <Link 
                                href="#syllabus-intelligence" 
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                            >
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                <span>2. Tech Worth & Syllabus</span>
                                <ArrowDown className="w-3 h-3 text-slate-400" />
                            </Link>
                        </div>
                    </div>

                    {/* Professional Metric Strip - Clean Slate Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-4 max-w-3xl mx-auto text-left">
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="text-sm sm:text-base font-semibold text-white">5 Tracks</div>
                            <div className="text-[11px] text-slate-400">Full-Stack to GenAI</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="text-sm sm:text-base font-semibold text-slate-200">₹8.5 - 24 LPA</div>
                            <div className="text-[11px] text-slate-400">Industry CTC Range</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="text-sm sm:text-base font-semibold text-white">Production Repos</div>
                            <div className="text-[11px] text-slate-400">100% Practical Builds</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <div className="text-sm sm:text-base font-semibold text-white">IIT Mandi Mentored</div>
                            <div className="text-[11px] text-slate-400">Curriculum Review</div>
                        </div>
                    </div>
                </div>

                {/* SECTION 1: Interactive Career Roadmap */}
                <section id="career-tracks" className="mb-20 sm:mb-28 scroll-mt-24">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-400" />
                            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                                1. Engineering Career Tracks
                            </h2>
                        </div>
                        <span className="text-xs text-slate-400 hidden sm:inline">
                            Select a track to inspect phased milestones
                        </span>
                    </div>

                    <InteractiveRoadmapCard className="w-full" />
                </section>

                {/* SECTION 2: Know Your Tech Worth & Detailed Syllabus Intelligence */}
                <section id="syllabus-intelligence" className="scroll-mt-24">
                    <TechCareerCalculator />
                </section>
            </div>

            <Footer />
        </main>
    );
}
