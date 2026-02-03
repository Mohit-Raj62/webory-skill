"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Bot, Rocket, Send, Loader2, Trophy, BrainCircuit, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/session-provider";

interface Question {
    question: string;
    options?: string[]; // For aptitude
    intro?: string;
    score?: number;
    feedback?: string;
}

export default function AIPrepSessionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const mode = searchParams.get("mode") as "interview" | "aptitude";

    // Config State
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [started, setStarted] = useState(false);
    
    // Session State
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 60s per aptitude question
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial Setup
    useEffect(() => {
        if (!mode) router.push("/ai-prep");
    }, [mode, router]);

    // Auth Protection
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Timer Logic for Aptitude
    useEffect(() => {
        if (mode === "aptitude" && currentQuestion && !loading) {
            setTimeLeft(60);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
             if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentQuestion, loading, mode]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            </div>
        );
    }
    
    if (!user) return null;

    const handleTimeout = () => {
        toast.error("Time's up!");
        handleSubmitAnswer("Time Limit Exceeded");
    };

    const handleStart = async () => {
        if (!topic.trim()) return toast.error("Please enter a topic");
        setStarted(true);
        setLoading(true);

        try {
            const res = await fetch("/api/ai/practice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode, topic, level, action: "start" })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setCurrentQuestion(data);
            setQuestionCount(1);
        } catch (error: any) {
            toast.error(error.message || "Failed to start session");
            setStarted(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async (answer: string = userAnswer) => {
        if (!answer.trim()) return toast.error("Please provide an answer");
        
        // Stop timer
        if (timerRef.current) clearInterval(timerRef.current);

        setLoading(true);
        const currentQ = currentQuestion?.question;

        try {
            const res = await fetch("/api/ai/practice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    mode, topic, 
                    action: "submit_answer",
                    currentQuestion: currentQ,
                    userAnswer: answer,
                    history: history // Pass history to prevent repetition
                })
            });
            const data = await res.json();
            
            // Save to history
            const newEntry = {
                question: currentQ,
                userAnswer: answer,
                feedback: data.feedback,
                score: data.score || 0,
                isCorrect: data.isCorrect
            };
            setHistory(prev => [...prev, newEntry]);

            const questionLimit = mode === "aptitude" ? 30 : 15;
            if (questionCount >= questionLimit) {
                finishSession([...history, newEntry]);
            } else {
                setCurrentQuestion({
                    question: data.nextQuestion,
                    options: data.options,
                    feedback: data.feedback // Show feedback for previous
                });
                setQuestionCount(prev => prev + 1);
                setUserAnswer("");
            }

        } catch (error) {
            toast.error("Failed to submit answer");
        } finally {
            setLoading(false);
        }
    };

    const handleExit = () => {
        if (confirm("Are you sure you want to end the session? Progress will be lost.")) {
            router.push("/ai-prep");
        }
    };

    const finishSession = (finalHistory: any[]) => {
        // Store history in localStorage to pass to result page
        localStorage.setItem("ai_session_history", JSON.stringify({
            mode, topic, history: finalHistory
        }));
        router.push("/ai-prep/result");
    };

    if (!started) {
        return (
            <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-hidden font-sans relative">
                <Navbar />
                
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="flex-1 flex items-center justify-center p-4 min-h-[90vh]">
                    <div className="relative w-full max-w-lg">
                        <div className="bg-[#09090b] p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-xl max-w-lg w-full relative">
                             <Button 
                                variant="ghost" 
                                size="icon"
                                className="absolute top-6 left-6 text-gray-500 hover:text-white hover:bg-zinc-800 rounded-full"
                                onClick={() => router.push("/ai-prep")}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <div className="text-center mb-10 mt-2">
                                <div className={`inline-flex p-4 rounded-2xl mb-6 bg-zinc-900 border border-zinc-800 text-white shadow-sm`}>
                                    {mode === "interview" ? (
                                        <Bot className="w-10 h-10" />
                                    ) : (
                                        <BrainCircuit className="w-10 h-10" />
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                                    {mode} Setup
                                </h1>
                                <p className="text-gray-500 text-sm mt-2 font-medium">Configure session details</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block pl-1">Topic</label>
                                    <div className="relative group">
                                        <Input 
                                            placeholder={mode === "interview" ? "e.g., React Developer" : "e.g., Algebra"}
                                            className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl focus:ring-1 focus:ring-white focus:border-transparent transition-all pl-4"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block pl-1">Difficulty</label>
                                    <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
                                        {["Beginner", "Intermediate", "Advanced"].map(l => (
                                            <button
                                                key={l}
                                                onClick={() => setLevel(l)}
                                                className={`py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                                                    level === l 
                                                    ? "bg-zinc-800 text-white shadow-sm" 
                                                    : "text-zinc-500 hover:text-zinc-300"
                                                }`}
                                            >
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button 
                                onClick={handleStart} 
                                disabled={loading}
                                className={`w-full mt-10 h-14 text-sm font-bold tracking-widest uppercase rounded-xl transition-all hover:opacity-90 ${
                                    mode === "interview" 
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Start Session"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020305] text-white flex flex-col font-sans overflow-hidden">
            <Navbar />
            
             {/* HUD Overlay / Background */}
             <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/10 to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900/10 to-transparent opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(5,5,5,0.8)_100%)]" />
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full p-4 pt-28 pb-10 flex flex-col relative z-10 h-screen">
                {/* HUD Header */}
                <header className="flex justify-between items-center mb-8 px-2">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl h-10 w-10 p-0 border border-white/5" 
                            onClick={handleExit}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${mode === "interview" ? "bg-purple-500 animate-pulse" : "bg-blue-500 animate-pulse"}`} />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Live Session</span>
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">{topic}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                         {/* Progress HUD */}
                         <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Simulation Progress</span>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: mode === "aptitude" ? 30 : 15 }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 w-3 rounded-sm transition-all ${
                                            i < questionCount 
                                            ? (mode === "interview" ? "bg-purple-500 shadow-[0_0_8px_#a855f7]" : "bg-blue-500 shadow-[0_0_8px_#3b82f6]") 
                                            : "bg-white/10"
                                        }`} 
                                    />
                                ))}
                            </div>
                         </div>

                        {mode === "aptitude" && (
                            <div className="bg-[#0f1115] border border-white/10 rounded-xl px-5 py-2.5 flex items-center gap-3 shadow-lg">
                                <div className={`text-2xl font-mono font-bold tracking-widest ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-400"}`}>
                                    {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 uppercase -rotate-90 origin-center">SEC</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                    
                    {/* Question Panel */}
                    <div className="lg:col-span-8 flex flex-col h-full min-h-0">
                         {/* Question Card */}
                        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden relative flex flex-col shadow-2xl">
                             {/* Decorative Top Bar */}
                             <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            
                            {loading && (
                                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className={`w-10 h-10 animate-spin ${mode === "interview" ? "text-purple-500" : "text-blue-500"}`} />
                                        <span className="text-xs font-mono text-gray-400 animate-pulse">PROCESSING DATA...</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-6 ${
                                    mode === "interview" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}>
                                   <BrainCircuit className="w-3 h-3" /> System Inquiry #{questionCount}
                                </div>

                                {currentQuestion?.intro && (
                                    <div className="mb-6 p-4 rounded-xl bg-white/5 border-l-2 border-gray-500 text-gray-400 text-sm italic leading-relaxed">
                                        {currentQuestion.intro}
                                    </div>
                                )}

                                <h3 className="text-2xl md:text-3xl font-medium text-white leading-normal tracking-tight">
                                    {currentQuestion?.question}
                                </h3>

                                {/* Aptitude Options Grid */}
                                {mode === "aptitude" && currentQuestion?.options && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                                        {currentQuestion.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSubmitAnswer(option)}
                                                disabled={loading}
                                                className="group relative text-left p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300 active:scale-[0.99] overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                <div className="relative z-10 flex items-center">
                                                    <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-gray-400 mr-4 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors">
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="text-gray-300 group-hover:text-white font-medium">{option}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                             {/* Interview Input Area (Docked at bottom of card) */}
                             {mode === "interview" && (
                                <div className="p-6 bg-black/20 border-t border-white/5">
                                    <div className="relative bg-white/5 rounded-2xl border border-white/10 focus-within:border-purple-500/50 focus-within:bg-white/10 transition-all hover:border-white/20">
                                        <textarea
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="Transmission channel open. Enter response..."
                                            className="w-full bg-transparent border-none text-white placeholder:text-gray-500/50 resize-none p-5 min-h-[120px] focus:ring-0 outline-none font-sans text-lg"
                                        />
                                        <div className="absolute bottom-3 right-3">
                                            <Button 
                                                onClick={() => handleSubmitAnswer()} 
                                                disabled={loading || !userAnswer.trim()}
                                                className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/20 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-2">Transmit <Send className="w-3 h-3" /></span>}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback / Info Panel (Side) */}
                    <div className="lg:col-span-4 flex flex-col h-full gap-4 min-h-0">
                         {/* Previous Feedback Card */}
                        <div className={`flex-1 rounded-[2rem] p-6 border border-white/10 relative overflow-hidden backdrop-blur-md ${
                            currentQuestion?.feedback 
                            ? (currentQuestion.feedback.toLowerCase().includes("correct") ? "bg-green-500/5 border-green-500/20" : "bg-orange-500/5 border-orange-500/20")
                            : "bg-white/5 opacity-50 flex items-center justify-center"
                        }`}>
                            {currentQuestion?.feedback ? (
                                <div className="h-full overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`p-2 rounded-lg ${currentQuestion.feedback.toLowerCase().includes("correct") ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <span className={`text-sm font-bold uppercase tracking-wider ${currentQuestion.feedback.toLowerCase().includes("correct") ? "text-green-400" : "text-orange-400"}`}>
                                            Analysis Report
                                        </span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-sm">
                                        {currentQuestion.feedback}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Loader2 className="w-8 h-8 text-gray-600 animate-spin-slow" />
                                    </div>
                                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Awaiting Input Data...</p>
                                </div>
                            )}
                        </div>

                         {/* Stats / Info - Placeholder for future expansion */}
                        <div className="h-32 bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between backdrop-blur-md">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Session Metrics</span>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-black text-white">{history.length}</div>
                                    <div className="text-[10px] text-gray-400 uppercase">Submissions</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{Math.round((history.filter(h => h.isCorrect).length / (history.length || 1)) * 100)}%</div>
                                    <div className="text-[10px] text-gray-400 uppercase">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
