"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, BookOpen, Loader2, CheckCircle, Clock, Target, Zap, Award, TrendingUp, Rocket, MessageCircle, Map, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    const [mode, setMode] = useState<"roadmap" | "chat">("roadmap");
    const [topic, setTopic] = useState("");
    const [roadmapData, setRoadmapData] = useState<RoadmapPhase[]>([]);
    const [overview, setOverview] = useState("");
    const [prerequisites, setPrerequisites] = useState<string[]>([]);
    const [careerPaths, setCareerPaths] = useState<string[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const parseRoadmap = (text: string) => {
        const phases: RoadmapPhase[] = [];
        const colors = [
            "from-blue-500 via-cyan-500 to-teal-500", 
            "from-purple-500 via-pink-500 to-rose-500", 
            "from-orange-500 via-amber-500 to-yellow-500"
        ];
        
        const overviewMatch = text.match(/## 📚 Overview\n(.*?)(?=##|$)/s);
        if (overviewMatch) setOverview(overviewMatch[1].trim());

        const prereqMatch = text.match(/## ✅ Prerequisites\n(.*?)(?=##|$)/s);
        if (prereqMatch) {
            const prereqs = prereqMatch[1].match(/- (.*)/g)?.map(p => p.replace('- ', '')) || [];
            setPrerequisites(prereqs);
        }

        const careerMatch = text.match(/## 💼 Career Paths\n(.*?)(?=##|$)/s);
        if (careerMatch) {
            const careers = careerMatch[1].match(/- (.*)/g)?.map(c => c.replace('- ', '')) || [];
            setCareerPaths(careers);
        }

        const phaseMatches = text.matchAll(/### Phase \d+: (.*?) \(Estimated: (.*?)\)(.*?)(?=###|##|$)/gs);
        let colorIndex = 0;
        
        for (const match of phaseMatches) {
            const topicsMatch = match[3].match(/\*\*Topics to Learn:\*\*(.*?)(?=\*\*|$)/s);
            const projectsMatch = match[3].match(/\*\*Practice Projects:\*\*(.*?)(?=\*\*|$)/s);
            
            const topics = topicsMatch?.[1].match(/- (.*?):/g)?.map(t => t.replace('- ', '').replace(':', '')) || [];
            const projects = projectsMatch?.[1].match(/\d+\. (.*)/g)?.map(p => p.replace(/\d+\. /, '')) || [];

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
            <Navbar />
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-8 sm:pb-12 max-w-7xl relative z-10">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full mb-4 border border-white/10 backdrop-blur-sm">
                        <Sparkles className="text-blue-400 animate-pulse" size={18} />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold text-sm">AI-Powered Learning</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-5 px-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">AI Mentor</span>
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 leading-relaxed mb-6">
                        Transform your learning journey with AI-powered personalized roadmaps and instant answers.
                    </p>

                    <div className="inline-flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setMode("roadmap")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                mode === "roadmap" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <Map size={18} />
                            <span className="text-sm sm:text-base">Roadmap</span>
                        </button>
                        <button
                            onClick={() => setMode("chat")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                mode === "chat" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <MessageCircle size={18} />
                            <span className="text-sm sm:text-base">Q&A Chat</span>
                        </button>
                    </div>
                </div>

                {/* Chat Mode */}
                {mode === "chat" && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                                {chatHistory.length > 0 ? (
                                    <>
                                        {chatHistory.map((msg, idx) => (
                                            <div key={idx} className={`flex gap-4 animate-fadeIn ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                {msg.role === "assistant" && (
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                                        <Bot className="text-white" size={20} />
                                                    </div>
                                                )}
                                                <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                                    <div className={`inline-block p-4 rounded-2xl shadow-lg ${
                                                        msg.role === "user"
                                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-sm"
                                                            : "bg-gray-800/80 text-gray-100 border border-white/10 rounded-tl-sm"
                                                    }`}>
                                                        {msg.role === "assistant" ? (
                                                            <div className="prose prose-invert prose-sm max-w-none">
                                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                        )}
                                                    </div>
                                                    <div className={`text-xs text-gray-500 mt-1 px-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                                        {msg.role === "user" ? "You" : "AI Mentor"}
                                                    </div>
                                                </div>
                                                {msg.role === "user" && (
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-white/20 shadow-lg">
                                                        <User className="text-gray-300" size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4 border border-white/10">
                                                <MessageCircle className="text-blue-400" size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Start a conversation</h3>
                                            <p className="text-gray-400 text-sm">Ask me anything about tech, programming, or learning</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/10 bg-gray-900/80 backdrop-blur-xl p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="Message AI Mentor..."
                                            className="flex-1 bg-gray-800/50 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none transition-all"
                                            disabled={loading}
                                        />
                                        <Button type="submit" disabled={loading || !topic.trim()} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 rounded-xl transition-all hover:scale-105">
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                        </Button>
                                    </div>

                                    {chatHistory.length === 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {exampleQuestions.map((q) => (
                                                <button key={q} type="button" onClick={() => setTopic(q)} className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 rounded-lg text-xs text-gray-300 transition-all" disabled={loading}>
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {chatHistory.length > 0 && (
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{chatHistory.length} messages</span>
                                            <button type="button" onClick={() => setChatHistory([])} className="text-red-400 hover:text-red-300 transition-colors">Clear chat</button>
                                        </div>
                                    )}
                                </form>

                                {error && <div className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
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
                                        What do you want to master?
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., React.js, Python, Machine Learning..." className="flex-1 bg-black/30 border-2 border-white/10 focus:border-blue-500/50 rounded-2xl p-4 text-white text-sm sm:text-base placeholder-gray-500 outline-none transition-all" disabled={loading} />
                                        <Button type="submit" disabled={loading || !topic.trim()} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 px-8 sm:px-10 w-full sm:w-auto h-14 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                            {loading ? (<><Loader2 className="animate-spin mr-2" size={20} /><span>Generating...</span></>) : (<><Send size={20} className="mr-2" /><span>Generate Roadmap</span></>)}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-xs sm:text-sm mb-3 flex items-center gap-2">
                                        <Zap className="text-yellow-400" size={16} />
                                        Popular topics:
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
                                            <div key={idx} className="relative group">
                                                {idx < roadmapData.length - 1 && <div className="absolute left-1/2 top-full h-8 w-1 bg-gradient-to-b from-white/30 to-transparent transform -translate-x-1/2 z-0"></div>}

                                                <div className={`relative bg-gradient-to-r ${phase.color} p-[3px] rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-all`}>
                                                    <div className="bg-black/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                                                        <div className="flex items-start sm:items-center justify-between mb-6 gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Phase {idx + 1}: {phase.phase}</h3>
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Clock size={16} className="flex-shrink-0" />
                                                                    <span className="text-sm sm:text-base font-medium">{phase.duration}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>{idx + 1}</div>
                                                        </div>

                                                        <div className="mb-6">
                                                            <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-base sm:text-lg">
                                                                <Zap size={20} className="text-yellow-400" />
                                                                Topics to Master
                                                            </h4>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {phase.topics.map((topic, topicIdx) => (
                                                                    <div key={topicIdx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105">
                                                                        <div className="flex items-start gap-2">
                                                                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                                                            <span className="text-gray-300 text-sm font-medium">{topic}</span>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {recommendedCourses.map((course: any) => (
                                                <div key={course.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all hover:scale-105 group">
                                                    {course.thumbnail && (
                                                        <div className="h-40 overflow-hidden bg-gray-800">
                                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                        </div>
                                                    )}
                                                    <div className="p-5">
                                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-2xl font-bold text-blue-400">₹{course.price}</span>
                                                            <a href={`/courses/${course.id}`} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105">
                                                                Enroll Now
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 justify-center pt-4">
                                    <Button onClick={() => { setTopic(""); setRoadmapData([]); setOverview(""); setPrerequisites([]); setCareerPaths([]); }} className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105">
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

            <Footer />
        </div>
    );
}
