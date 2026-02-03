"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Bot, BrainCircuit, Rocket, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";

export default function AIPrepLandingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [selectedMode, setSelectedMode] = useState<"interview" | "aptitude" | null>(null);

    // Auth Protection
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [user, loading, router]);

    if (!loading && !user) return null; // Prevent rendering while redirecting

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const handleStart = (mode: "interview" | "aptitude") => {
        router.push(`/ai-prep/session?mode=${mode}`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans">
            <Navbar />
            
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-500/5 to-transparent blur-[120px] pointer-events-none" />
                
                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                            <Rocket className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-gray-300">Level Up with Webory AI Nexus</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            AI-Powered Interview <br className="hidden md:block" /> & Aptitude Training
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                            Master your technical interviews and sharpen your logical reasoning with our intelligent AI mentor. Real-time feedback, personalized questions, and detailed analysis.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {/* Mock Interview Command Module */}
                        <div 
                            className="group relative h-full bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] cursor-pointer"
                            onClick={() => handleStart("interview")}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="h-full bg-[#0a0a0a]/80 rounded-[2.3rem] p-10 flex flex-col relative z-10 hover:bg-[#0a0a0a]/60 transition-colors">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500">
                                        <Bot size={40} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Protocol</span>
                                        <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">INTERVIEW_V2</span>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">Mock Interview</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Simulate high-stakes technical interviews. Real-time voice analysis, behavioral assessment, and coding challenges.
                                </p>
                                
                                <div className="space-y-4 mb-10">
                                    {[
                                        "Voice & Tone Analysis",
                                        "Role-Specific Scenarios",
                                        "Instant Feedback Report"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full h-14 bg-white/5 hover:bg-purple-600 text-white border border-white/10 hover:border-purple-500/50 rounded-xl group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 mt-auto text-lg font-bold tracking-wide uppercase">
                                    Initialize Session
                                </Button>
                            </div>
                        </div>

                        {/* Aptitude Test Command Module */}
                        <div 
                            className="group relative h-full bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] cursor-pointer"
                            onClick={() => handleStart("aptitude")}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="h-full bg-[#0a0a0a]/80 rounded-[2.3rem] p-10 flex flex-col relative z-10 hover:bg-[#0a0a0a]/60 transition-colors">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                                        <BrainCircuit size={40} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Protocol</span>
                                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">LOGIC_CORE_V1</span>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">Aptitude Test</h3>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Evaluate your cognitive abilities. Quantitative aptitude, logical reasoning, and data interpretation challenges.
                                </p>
                                
                                <div className="space-y-4 mb-10">
                                    {[
                                        "Adaptive Difficulty",
                                        "Timed Speed Tests",
                                        "Detailed Solution Breakdown"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-3 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full h-14 bg-white/5 hover:bg-cyan-600 text-white border border-white/10 hover:border-cyan-500/50 rounded-xl group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 mt-auto text-lg font-bold tracking-wide uppercase">
                                    Begin Diagnostics
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
