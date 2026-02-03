"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, TrendingUp, AlertCircle, RotateCcw, Home, Zap, Flame } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/session-provider";

interface ResultData {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    tips: string[];
    summary: string;
    xpEarned?: number;
    streakBonus?: number;
    totalXp?: number;
    currentStreak?: number;
}

export default function AIPrepResultPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<ResultData | null>(null);
    const [sessionData, setSessionData] = useState<any>(null);

    useEffect(() => {
        // Retrieve session data from localStorage
        const dataStr = localStorage.getItem("ai_session_history");
        if (!dataStr) {
            router.push("/ai-prep");
            return;
        }

        const data = JSON.parse(dataStr);
        setSessionData(data);
        generateReport(data);
    }, [router]);

    const { refreshAuth } = useAuth();
    
    // ... useEffect ...

    const generateReport = async (data: any) => {
        try {
            const res = await fetch("/api/ai/practice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    mode: data.mode, 
                    topic: data.topic,
                    action: "analyze",
                    history: data.history
                })
            });
            const report = await res.json();
            if (report.error) throw new Error(report.error);
            setResult(report);
            
            // Refresh global auth state to update XP/Streak in UI
            refreshAuth();
            
        } catch (error: any) {
            toast.error(error.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="animate-pulse space-y-6 text-center max-w-md">
                        <div className="inline-flex items-center justify-center bg-purple-500/10 p-6 rounded-full border border-purple-500/20">
                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Generating Performance Report</h2>
                        <p className="text-gray-400">Our AI mentor is analyzing your answers, identifying strengths, and preparing personalized improvement tips...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />
            
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 pt-24 pb-12">
                <div className="text-center mb-12">
                     <h1 className="text-3xl font-bold text-white mb-2">Practice Session Complete!</h1>
                     <p className="text-gray-400">Here is how you performed in your {sessionData?.mode} session on {sessionData?.topic}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Score Card */}
                    <div className="glass-card p-6 rounded-3xl border border-white/10 md:col-span-1 flex flex-col items-center justify-center text-center bg-gray-900/50">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * (result?.overallScore || 0)) / 100} className={`text-${result && result.overallScore >= 80 ? 'green' : result && result.overallScore >= 50 ? 'yellow' : 'red'}-500 transition-all duration-1000 ease-out`} />
                            </svg>
                            <span className="absolute text-3xl font-bold">{result?.overallScore}%</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Overall Score</h3>
                        <p className={`text-sm mt-1 px-3 py-1 rounded-full ${
                             result && result.overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
                             result && result.overallScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                             'bg-red-500/20 text-red-500'
                        }`}>
                            {result && result.overallScore >= 80 ? 'Excellent' : result && result.overallScore >= 50 ? 'Good' : 'Needs Improvement'}
                        </p>
                    </div>

                    {/* Report Summary */}
                    <div className="glass-card p-8 rounded-3xl border border-white/10 md:col-span-2 bg-gray-900/50">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> Mentor's Summary
                        </h3>
                        <p className="text-gray-300 leading-relaxed mb-6">{result?.summary}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center text-green-400 font-medium mb-2">
                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Key Strengths
                                </h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {result?.strengths.map((s, i) => (
                                        <li key={i} className="bg-green-500/5 border border-green-500/10 px-3 py-2 rounded-lg text-sm text-gray-300">{s}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="flex items-center text-orange-400 font-medium mb-2">
                                    <AlertCircle className="w-4 h-4 mr-2" /> Areas for Improvement
                                </h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {result?.weaknesses.map((w, i) => (
                                        <li key={i} className="bg-orange-500/5 border border-orange-500/10 px-3 py-2 rounded-lg text-sm text-gray-300">{w}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* XP & Streak Rewards */}
                {result?.xpEarned && (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="glass-card p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm">XP Earned</div>
                                <div className="text-2xl font-bold text-yellow-400">+{result.xpEarned + (result.streakBonus || 0)}</div>
                            </div>
                            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                                <Zap className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-between">
                            <div>
                                <div className="text-gray-400 text-sm">Learning Streak</div>
                                <div className="text-2xl font-bold text-orange-400">{result.currentStreak} Days</div>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                                <Flame className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Tips */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 bg-gray-900/50 mb-8">
                     <h3 className="text-xl font-bold text-white mb-4">💡 Actionable Tips for Next Time</h3>
                     <div className="space-y-3">
                        {result?.tips.map((tip, i) => (
                            <div key={i} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{i+1}</span>
                                <p className="text-gray-300">{tip}</p>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => router.push("/ai-prep")}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    >
                        <Home className="w-4 h-4 mr-2" /> Back to Hub
                    </Button>
                    <Button 
                        onClick={() => router.push(`/ai-prep/session?mode=${sessionData?.mode}`)}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Start New Session
                    </Button>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
