"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, XCircle, AlertTriangle, Loader2, Sparkles, ChevronRight, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/session-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResumeChecker() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const [fileA, setFileA] = useState<File | null>(null);
    const [fileB, setFileB] = useState<File | null>(null);
    const [analyzingA, setAnalyzingA] = useState(false);
    const [analyzingB, setAnalyzingB] = useState(false);
    const [resultA, setResultA] = useState<any>(null);
    const [resultB, setResultB] = useState<any>(null);
    const [resumeTextA, setResumeTextA] = useState("");
    const [resumeTextB, setResumeTextB] = useState("");
    const [isABTesting, setIsABTesting] = useState(false);

    const fileInputRefA = useRef<HTMLInputElement>(null);
    const fileInputRefB = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: 'A' | 'B') => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (slot === 'A') {
                setFileA(selectedFile);
                startAnalysis(selectedFile, 'A');
            } else {
                setFileB(selectedFile);
                startAnalysis(selectedFile, 'B');
            }
        }
    };

    const startAnalysis = async (fileToAnalyze: File, slot: 'A' | 'B') => {
        const setAnalyzing = slot === 'A' ? setAnalyzingA : setAnalyzingB;
        const setResult = slot === 'A' ? setResultA : setResultB;
        const setText = slot === 'A' ? setResumeTextA : setResumeTextB;
        
        setAnalyzing(true);
        setResult(null);
        
        try {
            const formData = new FormData();
            formData.append("file", fileToAnalyze);
            
            const res = await fetch("/api/resume/analyze", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();
            
            if (json.success) {
                setResult(json.data);
                setText(json.rawText);
                toast.success(`Resume ${slot} analyzed successfully!`);
            } else {
                toast.error(json.message || json.error || `Failed to analyze resume ${slot}`);
            }
        } catch (error) {
            toast.error(`An error occurred during analysis of ${slot}.`);
        } finally {
            setAnalyzing(false);
        }
    };

    const dropHandler = (e: React.DragEvent, slot: 'A' | 'B') => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            if (slot === 'A') {
                setFileA(droppedFile);
                startAnalysis(droppedFile, 'A');
            } else {
                setFileB(droppedFile);
                startAnalysis(droppedFile, 'B');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 selection:bg-blue-500/30">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 mb-2"
                        >
                            ATS Resume Master
                        </motion.h1>
                        <p className="text-slate-400 text-lg max-w-2xl">Optimize your resume for applicant tracking systems with AI-driven insights and A/B versioning.</p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsABTesting(!isABTesting)}
                        className={`h-12 border-slate-800 rounded-2xl px-8 transition-all font-bold ${isABTesting ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'hover:bg-slate-800'}`}
                    >
                        <ArrowRightLeft className="mr-2" size={18} /> {isABTesting ? "Exit A/B Mode" : "Start A/B Comparison"}
                    </Button>
                </header>

                <div className={`grid grid-cols-1 ${isABTesting ? 'lg:grid-cols-2' : 'lg:grid-cols-12'} gap-8`}>
                    {/* Slot A */}
                    <div className={`${isABTesting ? 'space-y-8' : 'lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8'}`}>
                        <div className={`${isABTesting ? '' : 'lg:col-span-4 space-y-8'}`}>
                            {/* Upload Card A */}
                            <motion.div 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => dropHandler(e, 'A')}
                                className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-slate-900/40 backdrop-blur-sm ${fileA ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                                onClick={() => fileInputRefA.current?.click()}
                            >
                                <input type="file" ref={fileInputRefA} onChange={(e) => handleUpload(e, 'A')} className="hidden" accept=".pdf,.docx,.txt" />
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${fileA ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400'}`}>
                                        {analyzingA ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{fileA ? fileA.name : (isABTesting ? "Upload Resume A" : "Upload Your Resume")}</h3>
                                    <p className="text-slate-500 text-sm">Drag & drop or click</p>
                                </div>
                            </motion.div>

                            {/* Score A */}
                            {resultA && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group shadow-xl"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sparkles size={80} className="text-blue-500" />
                                    </div>
                                    <div className="text-center mb-6">
                                        <div className="text-6xl font-black text-blue-500 mb-2">{resultA.score}%</div>
                                        <h4 className="text-xl font-bold uppercase tracking-wider text-slate-400 text-xs">ATS Compatibility Score</h4>
                                        <div className="mt-4 flex justify-center">
                                            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${resultA.atsCompatibility === 'High' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {resultA.atsCompatibility} Match
                                            </div>
                                        </div>
                                    </div>
                                    <Progress value={resultA.score} className="h-2 bg-slate-800 mb-8" />
                                </motion.div>
                            )}
                        </div>

                        {/* Analysis View A */}
                        <div className={`${isABTesting ? '' : 'lg:col-span-8'}`}>
                            {resultA && (
                                <div className="space-y-8">
                                    {/* Heatmap A */}
                                    <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                            Keyword Heatmap {isABTesting && "(A)"}
                                        </h3>
                                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 font-serif leading-relaxed h-[300px] overflow-y-auto whitespace-pre-wrap text-sm scrollbar-hide">
                                            {resumeTextA.split(/(\s+)/).map((word, i) => {
                                                const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                                                const isFound = resultA.foundKeywords.some((k: string) => k.toLowerCase() === cleanWord);
                                                return (
                                                    <span key={i} className={isFound ? 'bg-green-500/20 text-green-400 px-0.5 rounded-sm font-medium border-b border-green-500/30' : ''}>
                                                        {word}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Feedback A */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                                            <h4 className="text-red-500 font-bold mb-2 text-sm flex items-center gap-2"><XCircle size={14} /> Improvements (A)</h4>
                                            <ul className="text-xs text-slate-400 space-y-1">
                                                {resultA.formattingFeedback.slice(0, 3).map((f: string, i: number) => <li key={i}>• {f}</li>)}
                                            </ul>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                                            <h4 className="text-green-500 font-bold mb-2 text-sm flex items-center gap-2"><CheckCircle2 size={14} /> Strengths (A)</h4>
                                            <p className="text-xs text-slate-400">Strong match for: {resultA.foundKeywords.slice(0, 4).join(", ")}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>                    {/* Slot B (Only in AB Mode) */}
                    {isABTesting && (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                            {/* Upload Card B */}
                            <motion.div 
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => dropHandler(e, 'B')}
                                className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-slate-900/40 backdrop-blur-sm ${fileB ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                                onClick={() => fileInputRefB.current?.click()}
                            >
                                <input type="file" ref={fileInputRefB} onChange={(e) => handleUpload(e, 'B')} className="hidden" accept=".pdf,.docx,.txt" />
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${fileB ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}>
                                        {analyzingB ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{fileB ? fileB.name : "Upload Resume B"}</h3>
                                    <p className="text-slate-500 text-sm">Drag & drop or click</p>
                                </div>
                            </motion.div>

                            {/* Score B */}
                            {resultB && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group shadow-xl"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sparkles size={80} className="text-indigo-500" />
                                    </div>
                                    <div className="text-center mb-6">
                                        <div className="text-6xl font-black text-indigo-500 mb-2">{resultB.score}%</div>
                                        <h4 className="text-xl font-bold uppercase tracking-wider text-slate-400 text-xs">ATS Compatibility Score</h4>
                                        <div className="mt-4 flex justify-center">
                                            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${resultB.atsCompatibility === 'High' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {resultB.atsCompatibility} Match
                                            </div>
                                        </div>
                                    </div>
                                    <Progress value={resultB.score} className="h-2 bg-slate-800 mb-8" />
                                </motion.div>
                            )}

                            {/* Heatmap B */}
                            {resultB && (
                                <div className="space-y-8">
                                    <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                            Keyword Heatmap (B)
                                        </h3>
                                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 font-serif leading-relaxed h-[300px] overflow-y-auto whitespace-pre-wrap text-sm scrollbar-hide">
                                            {resumeTextB.split(/(\s+)/).map((word, i) => {
                                                const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                                                const isFound = resultB.foundKeywords.some((k: string) => k.toLowerCase() === cleanWord);
                                                return (
                                                    <span key={i} className={isFound ? 'bg-indigo-500/20 text-indigo-400 px-0.5 rounded-sm font-medium border-b border-indigo-500/30' : ''}>
                                                        {word}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Feedback B */}
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                                            <h4 className="text-red-500 font-bold mb-2 text-sm flex items-center gap-2"><XCircle size={14} /> Improvements (B)</h4>
                                            <ul className="text-xs text-slate-400 space-y-1">
                                                {resultB.formattingFeedback.slice(0, 3).map((f: string, i: number) => <li key={i}>• {f}</li>)}
                                            </ul>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                                            <h4 className="text-green-500 font-bold mb-2 text-sm flex items-center gap-2"><CheckCircle2 size={14} /> Strengths (B)</h4>
                                            <p className="text-xs text-slate-400">Strong match for: {resultB.foundKeywords.slice(0, 4).join(", ")}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Common Feedback & Comparison Banner */}
                {isABTesting && resultA && resultB && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-white/5 text-center"
                    >
                        <h3 className="text-xl font-bold mb-2">Version Comparison Summary</h3>
                        <p className="text-slate-400">
                            {resultA.score > resultB.score 
                                ? `Version A is stronger by ${resultA.score - resultB.score} points.` 
                                : resultB.score > resultA.score 
                                ? `Version B is stronger by ${resultB.score - resultA.score} points.`
                                : "Both versions have identical compatibility scores."}
                        </p>
                    </motion.div>
                )}
            </div>

            <style jsx>{`
                .dot-grid {
                    background-image: radial-gradient(#1e293b 1px, transparent 1px);
                    background-size: 30px 30px;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
