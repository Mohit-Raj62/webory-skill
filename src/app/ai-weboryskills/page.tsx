
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, BookOpen, Loader2, CheckCircle, Clock, Target, Zap, Award, TrendingUp, Rocket, MessageCircle, Map, User, Bot, Star, Code, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BackgroundCodeAnimation } from "@/components/ui/background-code-animation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth/session-provider";
import Image from "next/image";

interface RoadmapPhase {
  phase: string;
  duration: string;
  topics: string[];
  projects: string[];
  color: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AIWeboryskillsPage() {
    const RoadmapSkeleton = () => (
        <div className="space-y-8 animate-pulse">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-5">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="h-8 w-56" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                </div>
            </div>
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-8">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="space-y-8">
                    {[1, 2].map(i => (
                        <div key={i} className="p-[3px] rounded-3xl bg-white/5">
                            <div className="bg-black/90 p-6 sm:p-8 rounded-3xl space-y-4">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-4 w-1/4" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <Skeleton className="h-24 rounded-xl" />
                                    <Skeleton className="h-24 rounded-xl" />
                                    <Skeleton className="h-24 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const [mode, setMode] = useState<"roadmap" | "chat">("roadmap");
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("Beginner");  // Added Level state
    const [roadmapData, setRoadmapData] = useState<RoadmapPhase[]>([]);
    const [overview, setOverview] = useState("");
    const [prerequisites, setPrerequisites] = useState<string[]>([]);
    const [careerPaths, setCareerPaths] = useState<string[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    // Direct Login Redirect
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?callbackUrl=/ai-weboryskills");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    // Added Scroll Lock for Chat Mode
    useEffect(() => {
        if (mode === "chat") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mode]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-gray-400 font-mono text-sm animate-pulse">Authenticating Mentor Access...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const parseRoadmap = (text: string) => {
        const phases: RoadmapPhase[] = [];
        const colors = [
            "from-blue-500 via-cyan-500 to-teal-500", 
            "from-purple-500 via-pink-500 to-rose-500", 
            "from-orange-500 via-amber-500 to-yellow-500"
        ];
        
        const overviewMatch = text.match(/## 📚 Overview\n([\s\S]*?)(?=##|$)/);
        if (overviewMatch) setOverview(overviewMatch[1].trim());

        const prereqMatch = text.match(/## ✅ Prerequisites\n([\s\S]*?)(?=##|$)/);
        if (prereqMatch) {
            const prereqs = prereqMatch[1].match(/- (.*)/g)?.map(p => p.replace('- ', '')) || [];
            setPrerequisites(prereqs);
        }

        const careerMatch = text.match(/## 💼 Career Paths\n([\s\S]*?)(?=##|$)/);
        if (careerMatch) {
            const careers = careerMatch[1].match(/- (.*)/g)?.map(c => c.replace('- ', '')) || [];
            setCareerPaths(careers);
        }

        const phaseMatches = text.matchAll(/### Phase \d+: (.*?) \(Estimated: (.*?)\)([\s\S]*?)(?=###|##|$)/g);
        let colorIndex = 0;
        
        for (const match of phaseMatches) {
            const topicsMatch = match[3].match(/\*\*Topics to Learn:\*\*([\s\S]*?)(?=\*\*Practice Projects:|\*\*Resources:|$)/);
            const projectsMatch = match[3].match(/\*\*Practice Projects:\*\*([\s\S]*?)(?=\*\*Resources:|$)/);
            
            console.log('Phase content:', match[3]);
            console.log('Topics match:', topicsMatch?.[1]);
            console.log('Projects match:', projectsMatch?.[1]);
            
            
            // Extract topics - handle bold markdown format: - **Topic**: Description
            let topics: string[] = [];
            if (topicsMatch?.[1]) {
                // Primary format: "- **Topic Name**: Full description..."
                // Capture full line including description (until next - or end)
                const topicLines = topicsMatch[1].match(/- \*\*[^*]+\*\*:[^\n-]+(?:\n(?!-)[^\n-]+)*/g);
                if (topicLines && topicLines.length > 0) {
                    topics = topicLines.map(t => t.replace(/^- /, '').replace(/\n/g, ' ').trim());
                } else {
                    // Fallback: "- Topic: Description" (without bold)
                    const topicsWithColon = topicsMatch[1].match(/- ([^:\n]+):/g);
                    if (topicsWithColon && topicsWithColon.length > 0) {
                        topics = topicsWithColon.map(t => t.replace('- ', '').replace(':', '').trim());
                    } else {
                        // Fallback: "- Topic Description" (plain text)
                        const topicsPlain = topicsMatch[1].match(/- ([^\n]+)/g);
                        if (topicsPlain) {
                            topics = topicsPlain.map(t => t.replace('- ', '').trim());
                        }
                    }
                }
            }
            
            
            // Extract projects - handle bold markdown format: 1. **Project**: Description
            let projects: string[] = [];
            if (projectsMatch?.[1]) {
                // Primary format: "1. **Project Name**: Full description..."
                // Capture full paragraph including description
                const projectLines = projectsMatch[1].match(/\d+\. \*\*[^*]+\*\*:[^\n]+(?:\n(?!\d)[^\n]+)*/g);
                if (projectLines && projectLines.length > 0) {
                    projects = projectLines.map(p => p.replace(/^\d+\. /, '').replace(/\n/g, ' ').trim());
                } else {
                    // Fallback: "1. Project description" (plain text)
                    const projectsPlain = projectsMatch[1].match(/\d+\. (.*)/g);
                    if (projectsPlain) {
                        projects = projectsPlain.map(p => p.replace(/\d+\. /, '').trim());
                    }
                }
            }
            
            console.log('Extracted topics:', topics);
            console.log('Extracted projects:', projects);

            phases.push({
                phase: match[1],
                duration: match[2],
                topics: topics.slice(0, 6),
                projects: projects.slice(0, 3),
                color: colors[colorIndex % colors.length]
            });
            colorIndex++;
        }

        setRoadmapData(phases);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!topic.trim()) {
            setError(mode === "chat" ? "Please enter a question" : "Please enter a topic");
            return;
        }

        setLoading(true);
        setError("");

        if (mode === "roadmap") {
            setRoadmapData([]);
            setOverview("");
            setPrerequisites([]);
            setRecommendedCourses([]);
            setCareerPaths([]);
        }

        try {
            const res = await fetch("/api/ai/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    topic: topic.trim(),
                    level: level,
                    mode: mode,
                    conversationHistory: mode === "chat" ? chatHistory : undefined
                }),
            });

            if (res.ok) {
                const data = await res.json();
                
                if (mode === "chat") {
                    const newMessages: ChatMessage[] = [
                        ...chatHistory,
                        { role: "user", content: topic },
                        { role: "assistant", content: data.answer }
                    ];
                    setChatHistory(newMessages);
                    setTopic("");
                } else {
                    parseRoadmap(data.roadmap);
                    if (data.recommendedCourses && data.recommendedCourses.length > 0) {
                        setRecommendedCourses(data.recommendedCourses);
                    }
                }
            } else {
                const errorData = await res.json();
                setError(errorData.error || "Failed to generate response");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exampleTopics = ["React.js", "Python", "Machine Learning", "Full Stack", "DevOps", "Blockchain"];
    const exampleQuestions = ["What is React?", "How to learn Python?", "Explain AI vs ML", "Best coding practices?"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {mode !== "chat" && <Navbar />}
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                {/* 3D Code Animation Layer */}
                <BackgroundCodeAnimation />
            </div>

            <div className="container mx-auto px-4 pt-24 md:pt-36 pb-8 md:pb-12 max-w-7xl relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-4 border border-white/10 backdrop-blur-sm">
                        <Sparkles className="text-blue-400 animate-pulse" size={16} />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold text-[10px] md:text-sm">AI-Powered Learning</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 md:mb-6 px-2 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">AI Mentor</span>
                    </h1>
                    <p className="text-gray-400 text-[13px] sm:text-base md:text-lg max-w-2xl mx-auto px-4 leading-relaxed mb-8 font-medium">
                        Elevate your career with AI-driven personalized roadmaps and 24/7 senior mentor guidance tailored for your goals.
                    </p>

                    <div className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                        <button
                            onClick={() => setMode("roadmap")}
                            className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl font-bold transition-all duration-300 ${
                                mode === "roadmap" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "text-gray-500 hover:text-white"
                            }`}
                        >
                            <Map size={18} className={mode === "roadmap" ? "animate-bounce" : ""} />
                            <span className="text-xs sm:text-base uppercase tracking-wider">Roadmap</span>
                        </button>
                        <button
                            onClick={() => setMode("chat")}
                            className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl font-bold transition-all duration-300 ${
                                mode === "chat" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "text-gray-500 hover:text-white"
                            }`}
                        >
                            <MessageCircle size={18} className={mode === "chat" ? "animate-pulse" : ""} />
                            <span className="text-xs sm:text-base uppercase tracking-wider">Chat AI</span>
                        </button>
                    </div>
                </div>

                {/* Chat Mode Overlay */}
                {mode === "chat" && (
                    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex flex-col animate-fadeIn overflow-hidden">
                        {/* Dynamic Safe Area Padding for Mobile Headers */}
                        <div className="h-[env(safe-area-inset-top,0px)] w-full bg-black/20 md:hidden" />
                        
                        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col min-h-0 relative z-50 p-3 sm:p-6 lg:p-10">
                            {/* Enhanced Header - Responsive for Mobile Applications */}
                            <div className="flex items-center justify-between mb-3 md:mb-6 flex-shrink-0 bg-white/5 backdrop-blur-2xl p-3 md:p-5 rounded-2xl border border-white/10 shadow-xl">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <Bot className="text-white w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Mentor Chat</h2>
                                        <p className="text-[10px] text-gray-400">Ask about coding & tech</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setMode("roadmap")} 
                                    className="group flex items-center gap-1.5 md:gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300"
                                >
                                    <span className="text-xs md:text-sm font-bold text-red-400">Exit</span>
                                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col min-h-0">
                                
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scroll-smooth scrollbar-none">
                                    {chatHistory.length > 0 ? (
                                        <>
                                            {chatHistory.map((msg, idx) => (
                                                <div key={idx} className={`flex gap-4 animate-fadeIn ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                    {msg.role === "assistant" && (
                                                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-white/10">
                                                            <Bot className="text-white" size={20} />
                                                        </div>
                                                    )}
                                                    <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                                        <div className={`inline-block p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                                                            msg.role === "user"
                                                                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm border border-white/10"
                                                                : "bg-white/5 text-gray-100 border border-white/10 rounded-2xl rounded-tl-sm hover:bg-white/10"
                                                        }`}>
                                                            {msg.role === "assistant" ? (
                                                                <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                                                            )}
                                                        </div>
                                                        <div className={`text-xs text-gray-400 mt-2 px-1 flex items-center gap-1 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                            {msg.role === "user" ? (
                                                                <>You <User size={10} /></>
                                                            ) : (
                                                                <><Bot size={10} /> AI Mentor</>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {msg.role === "user" && (
                                                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 shadow-lg">
                                                            <User className="text-gray-300" size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {loading && (
                                                <div className="flex gap-4 animate-pulse">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg opacity-70">
                                                        <Bot className="text-white" size={20} />
                                                    </div>
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        <span className="text-xs text-gray-400 ml-2 font-medium">Thinking...</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full sm:px-6">
                                            <div className="text-center p-6 sm:p-10 glass-card rounded-[2rem] border border-white/10 max-w-lg mx-4 sm:mx-auto transform transition-all duration-500 hover:scale-[1.02]">
                                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl mb-4 sm:mb-8 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.15)] ring-1 ring-white/20">
                                                    <MessageCircle className="text-blue-400 w-8 h-8 sm:w-12 sm:h-12" />
                                                </div>
                                                <h3 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400">
                                                    Senior Mentor AI
                                                </h3>
                                                <p className="text-gray-400 text-[13px] sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-[280px] sm:max-w-md mx-auto font-medium">
                                                    Ask complex technical questions, request code reviews, or get architecture advice anytime.
                                                </p>
                                                <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center">
                                                    {exampleQuestions.slice(0, 3).map((q) => (
                                                        <button key={q} type="button" onClick={() => setTopic(q)} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs sm:text-sm text-gray-300 transition-all hover:border-blue-500/40 text-center font-bold">
                                                            {q}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="border-t border-white/10 bg-black/70 backdrop-blur-2xl p-4 sm:p-8 pb-[max(1rem,env(safe-area-inset-bottom))] rounded-b-[2.5rem] relative z-20">
                                    <form onSubmit={handleSubmit} className="relative group">
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-10 blur-xl"></div>
                                            <div className="relative flex gap-2 sm:gap-3 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-blue-500/50 transition-all duration-300 shadow-2xl">
                                                <input
                                                    type="text"
                                                    value={topic}
                                                    onChange={(e) => setTopic(e.target.value)}
                                                    placeholder="Ask your senior mentor..."
                                                    className="flex-1 bg-transparent border-none focus:ring-0 px-3 sm:px-5 py-3.5 text-white text-[15px] sm:text-base placeholder-gray-500 outline-none w-full"
                                                    disabled={loading}
                                                />
                                                <Button 
                                                    type="submit" 
                                                    disabled={loading || !topic.trim()} 
                                                    className={`aspect-square sm:aspect-auto sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center ${
                                                        topic.trim() ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/40" : "bg-gray-800 text-gray-500 opacity-50"
                                                    }`}
                                                >
                                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                                </Button>
                                            </div>
                                        </div>

                                        {chatHistory.length > 0 && (
                                            <div className="absolute -top-10 right-0">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setChatHistory([])} 
                                                    className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5"
                                                >
                                                    <Sparkles size={10} /> Clear Chat
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                    {error && <div className="absolute -top-16 left-0 right-0 mx-4 p-3 bg-red-900/80 backdrop-blur-md border border-red-500/50 rounded-xl text-red-200 text-sm text-center animate-shake z-10">{error}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Roadmap Mode */}
                {mode === "roadmap" && (
                    <>
                        <div className="glass-card p-6 sm:p-8 md:p-10 rounded-3xl mb-8 border border-white/10 shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-white font-semibold block mb-3 text-base sm:text-lg flex items-center gap-2">
                                        <Rocket className="text-blue-400" size={20} />
                                        What is your Career Goal?
                                    </label>
                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        <div className="relative group">
                                             <input 
                                                type="text" 
                                                value={topic} 
                                                onChange={(e) => setTopic(e.target.value)} 
                                                placeholder="e.g., Full Stack Developer, AI Engineer..." 
                                                className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl p-3.5 sm:p-5 text-white text-sm sm:text-base placeholder-gray-500 outline-none transition-all shadow-inner" 
                                                disabled={loading} 
                                            />
                                            <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                                        </div>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl p-3.5 sm:p-5 text-white text-sm sm:text-base outline-none transition-all appearance-none cursor-pointer shadow-inner"
                                                disabled={loading}
                                                value={level}
                                                onChange={(e) => setLevel(e.target.value)}
                                            >
                                                <option value="Beginner" className="bg-gray-900">Beginner (Student)</option>
                                                <option value="Intermediate" className="bg-gray-900">Intermediate (Pro)</option>
                                                <option value="Advanced" className="bg-gray-900">Advanced (Expert)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={loading || !topic.trim()} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 px-6 sm:px-10 w-full md:w-auto h-12 sm:h-14 text-sm sm:text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                <span>Connecting with Mentor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} className="mr-2" />
                                                <span>Get Free AI Roadmap</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {loading && (
                                     <div className="mt-12">
                                        <div className="text-center mb-8 animate-pulse">
                                            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full mb-4 border border-blue-500/20">
                                                <Loader2 className="animate-spin text-blue-400" size={16} />
                                                <span className="text-blue-300 text-sm font-medium">Mentor is analyzing your goal...</span>
                                            </div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Generating Your Personalized Roadmap</h2>
                                            <p className="text-gray-400 text-sm">This usually takes 5-10 seconds. Hang tight!</p>
                                        </div>
                                        <RoadmapSkeleton />
                                     </div>
                                )}
                                
                                <div>
                                    <p className="text-gray-400 text-xs sm:text-sm mb-3 flex items-center gap-2">
                                        <Zap className="text-yellow-400" size={16} />
                                        Popular Career Paths:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {exampleTopics.map((example) => (
                                            <button key={example} type="button" onClick={() => setTopic(example)} className="px-4 py-2 bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/10 rounded-xl text-sm text-gray-300 transition-all hover:scale-105" disabled={loading}>
                                                {example}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>

                            {error && <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-2xl text-red-400 text-sm flex items-center gap-2"><span className="text-red-500">⚠️</span>{error}</div>}
                        </div>

                        {roadmapData.length > 0 && (
                            <div className="space-y-8">
                                {overview && (
                                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-500/20 rounded-xl"><BookOpen className="text-blue-400" size={24} /></div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Overview</h2>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{overview}</p>
                                    </div>
                                )}

                                {prerequisites.length > 0 && (
                                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="p-2 bg-green-500/20 rounded-xl"><CheckCircle className="text-green-400" size={24} /></div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Prerequisites</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {prerequisites.map((prereq, idx) => (
                                                <div key={idx} className="flex items-start gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                                                    <span className="text-gray-300 text-sm">{prereq}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="glass-card p-6 sm:p-8 md:p-10 rounded-3xl border border-white/10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-purple-500/20 rounded-xl"><Target className="text-purple-400" size={24} /></div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-white">Learning Path</h2>
                                    </div>

                                    <div className="space-y-8">
                                        {roadmapData.map((phase, idx) => (
                                            <div key={idx} className="relative group/phase">
                                                {/* Desktop Connector */}
                                                {idx < roadmapData.length - 1 && <div className="hidden md:block absolute left-1/2 top-full h-8 w-0.5 bg-gradient-to-b from-white/20 to-transparent transform -translate-x-1/2 z-0"></div>}
                                                {/* Mobile Connector */}
                                                {idx < roadmapData.length - 1 && <div className="md:hidden absolute left-8 top-full h-8 w-0.5 bg-gradient-to-b from-white/20 to-transparent z-0"></div>}

                                                <div className={`relative bg-gradient-to-r ${phase.color} p-[1px] rounded-[1.5rem] sm:rounded-[2.5rem] hover:scale-[1.01] transition-all duration-500 shadow-xl`}>
                                                    <div className="bg-[#0a0a0a] backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
                                                            <div className="flex-1 min-w-0 order-2 md:order-1">
                                                                <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">Phase {idx + 1}: {phase.phase}</h3>
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <div className="p-1 sm:p-1.5 bg-white/5 rounded-lg border border-white/10">
                                                                        <Clock size={12} className="text-blue-400" />
                                                                    </div>
                                                                    <span className="text-[11px] sm:text-base font-bold uppercase tracking-widest">{phase.duration}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`w-10 h-10 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl sm:rounded-[1.5rem] bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-black text-lg sm:text-4xl shadow-2xl order-1 md:order-2 self-start md:self-center transform group-hover/phase:rotate-6 transition-transform duration-500`}>
                                                                {idx + 1}
                                                            </div>
                                                        </div>

                                                        <div className="mb-6">
                                                            <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm sm:text-lg">
                                                                <Zap size={18} className="text-yellow-400" />
                                                                Topics to Master
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                                                {phase.topics.map((topic, topicIdx) => (
                                                                    <div key={topicIdx} className="group/topic bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-300">
                                                                        <div className="space-y-3">
                                                                            {(() => {
                                                                                const match = topic.match(/\*\*(.+?)\*\*:(.+)/);
                                                                                if (match) {
                                                                                    return (
                                                                                        <>
                                                                                            <h5 className="text-white font-bold text-[15px] sm:text-lg flex items-start gap-2.5 leading-snug">
                                                                                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 group-hover/topic:scale-125 transition-transform"></div>
                                                                                                {match[1].trim()}
                                                                                            </h5>
                                                                                            <p className="text-gray-400 text-[13px] sm:text-sm leading-relaxed pl-5 font-medium">{match[2].trim()}</p>
                                                                                        </>
                                                                                    );
                                                                                }
                                                                                return (
                                                                                    <div className="flex items-start gap-3">
                                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                                                        <span className="text-gray-300 text-sm font-bold">{topic}</span>
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {phase.projects.length > 0 && (
                                                            <div>
                                                                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-base sm:text-lg">
                                                                    <Target size={20} className="text-green-400" />
                                                                    Practice Projects
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {phase.projects.map((project, projIdx) => (
                                                                        <div key={projIdx} className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all">
                                                                            <div className="flex items-start gap-3">
                                                                                <span className="text-green-400 font-bold text-base flex-shrink-0">{projIdx + 1}.</span>
                                                                                <span className="text-gray-300 text-sm font-medium">{project}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {careerPaths.length > 0 && (
                                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-yellow-500/30 transition-all">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="p-2 bg-yellow-500/20 rounded-xl"><Award className="text-yellow-400" size={24} /></div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Career Opportunities</h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {careerPaths.map((career, idx) => (
                                                <div key={idx} className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-5 hover:scale-105 hover:border-yellow-500/50 transition-all group">
                                                    <div className="flex items-start gap-3">
                                                        <TrendingUp className="text-yellow-400 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                                                        <span className="text-gray-200 font-semibold text-sm">{career}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* WeborySkills Recommended Courses */}
                                {recommendedCourses.length > 0 && (
                                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-blue-500/20 rounded-xl"><BookOpen className="text-blue-400" size={24} /></div>
                                            <h2 className="text-2xl sm:text-3xl font-bold text-white">Recommended Courses from WeborySkills</h2>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-6">Start learning with our curated courses that match your roadmap!</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                                            {recommendedCourses.map((course: any) => (
                                                <div key={course.id} className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:translate-y-[-8px] group shadow-2xl">
                                                    {course.thumbnail && (
                                                        <div className="h-48 sm:h-56 overflow-hidden bg-gray-900 relative">
                                                            <Image 
                                                                src={course.thumbnail} 
                                                                alt={course.title} 
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                                        </div>
                                                    )}
                                                    <div className="p-5 sm:p-8">
                                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 font-medium leading-relaxed">{course.description}</p>
                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Starting at</span>
                                                                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">₹{course.price}</span>
                                                            </div>
                                                            <a href={`/courses/${course.id}`} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                                                JOIN NOW
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 justify-center pt-4">
                                    <Button onClick={() => { setTopic(""); setRoadmapData([]); setOverview(""); setPrerequisites([]); setCareerPaths([]); }} className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 px-8 py-3 w-full sm:w-auto rounded-xl font-bold transition-all hover:scale-105 active:scale-95">
                                        Generate Another
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!roadmapData.length && !loading && (
                            <div className="text-center py-16 sm:py-20">
                                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl mb-6 border border-white/10">
                                    <Sparkles className="text-blue-400 animate-pulse" size={36} />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to start your journey?</h3>
                                <p className="text-gray-400 text-sm sm:text-base px-4 max-w-md mx-auto">Enter a topic above and let AI create your personalized learning roadmap</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {mode !== "chat" && <Footer />}
        </div>
    );
}

