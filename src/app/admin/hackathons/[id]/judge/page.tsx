"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
    Trophy, 
    Github, 
    Globe, 
    ArrowLeft, 
    Loader2, 
    Award, 
    Search,
    CheckCircle2,
    Calendar,
    Users,
    Zap,
    ExternalLink,
    Code,
    GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function HackathonJudgingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [hackathon, setHackathon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // Judging States
    const [results, setResults] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSubmissions();
        fetchHackathonInfo();
    }, [id]);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`/api/admin/hackathons/${id}/submissions`);
            const data = await res.json();
            if (res.ok) {
                const dataArray = Array.isArray(data.data) ? data.data : [];
                setSubmissions(dataArray);
                
                // Pre-fill visual state for previously finalized ranks
                const existingRanks = dataArray
                    .filter((sub: any) => sub?.userId && sub.rank && sub.rank > 0)
                    .map((sub: any) => ({
                        userId: sub.userId._id,
                        rank: sub.rank,
                        points: sub.rank === 1 ? 500 : sub.rank === 2 ? 300 : 100
                    }));
                
                if (existingRanks.length > 0) {
                    setResults(existingRanks);
                }
            }
        } catch (error) {
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const fetchHackathonInfo = async () => {
        try {
            const res = await fetch(`/api/hackathons/${id}`);
            const data = await res.json();
            if (res.ok) setHackathon(data.data);
        } catch (error) {}
    };

    const handleFinalize = async () => {
        if (!confirm("Are you sure you want to finalize results? This will issue certificates to ALL participants.")) return;
        
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/hackathons/status/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hackathonId: id,
                    winners: results // [{ userId, rank, points }]
                })
            });

            if (res.ok) {
                toast.success("Hackathon finalized! Certificates are now live. 🚀");
                router.push("/admin/hackathons");
            } else {
                toast.error("Failed to finalize results");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleWinner = (userId: string, rank: number) => {
        setResults(prev => {
            const exists = prev.find(r => r.userId === userId && r.rank === rank);
            if (exists) {
                return prev.filter(r => r.userId !== userId);
            }
            // Overwrite existing rank for this user if they had one
            const filtered = prev.filter(r => r.userId !== userId);
            return [...filtered, { userId, rank, points: rank === 1 ? 500 : rank === 2 ? 300 : 100 }];
        });
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                    <Loader2 className="animate-spin text-blue-500 relative z-10" size={40} />
                </div>
            </div>
        );
    }

    const filteredSubmissions = submissions.filter(s => 
        (s.projectName || "").toLowerCase().includes(search.toLowerCase()) || 
        `${s.userId?.firstName || ""} ${s.userId?.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-[#020202] min-h-screen text-white font-sans relative overflow-x-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 sticky top-0 z-50 py-4 bg-[#020202]/80 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/5">
                <div className="space-y-4 w-full lg:w-auto">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Control Center</span>
                    </button>
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">
                            Judge <span className="text-blue-500">Arena</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">{hackathon?.title}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Find participants or projects..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 h-14 outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
                        />
                    </div>
                    <Button 
                        onClick={handleFinalize}
                        disabled={submitting || results.length === 0}
                        className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-gray-200 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-500/10 active:scale-95 transition-all"
                    >
                        {submitting ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" size={18} />}
                        Finalize Results
                    </Button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Submissions", value: submissions.length, icon: Code, color: "text-blue-500" },
                    { label: "Ranked", value: results.length, icon: Trophy, color: "text-yellow-500" },
                    { label: "Participants", value: hackathon?.registeredUsers?.length || 0, icon: Users, color: "text-purple-500" },
                    { label: "Total XP", value: (results.reduce((acc, r) => acc + r.points, 0)) + ((submissions.length - results.length) * 50), icon: Zap, color: "text-orange-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-1">
                            <stat.icon size={14} className={stat.color} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-black">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Submissions Feed */}
            <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                    {filteredSubmissions.map((sub, i) => {
                        const winResult = results.find(r => r.userId === sub.userId?._id);
                        return (
                            <motion.div 
                                key={sub._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className={`group relative p-[1px] rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
                                    winResult ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' : 'bg-white/10 hover:bg-white/20'
                                }`}
                            >
                                <div className="bg-[#0A0A0A] rounded-[1.45rem] p-4 lg:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                                    
                                    {/* Project Identity */}
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3 opacity-60">
                                            <div className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[8px] font-black uppercase tracking-widest border border-white/10">
                                                {sub.userId?.firstName || "Unknown"} {sub.userId?.lastName || "User"}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none">
                                                <Calendar size={10} /> {new Date(sub.createdAt).toLocaleDateString()}
                                            </div>
                                            {/* Participation Type Badge */}
                                            <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                                sub.participationType === 'team' 
                                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}>
                                                {sub.participationType === 'team' ? `👥 Team: ${sub.teamName}` : '👤 Individual'}
                                            </div>
                                        </div>

                                        {/* Team Members Details (if team) */}
                                        {sub.participationType === 'team' && sub.teamMemberDetails && sub.teamMemberDetails.length > 0 && (
                                            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Users size={12} className="text-purple-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">
                                                        Team Members ({sub.teamMemberDetails.length})
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {sub.teamMemberDetails.map((m: any, mIdx: number) => (
                                                        <div key={mIdx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black shrink-0">
                                                                {mIdx + 1}
                                                            </div>
                                                            <div className="min-w-0 space-y-0.5">
                                                                <div className="text-xs font-bold text-white truncate">{m.name}</div>
                                                                <div className="text-[10px] text-gray-500 truncate">{m.email}</div>
                                                                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 opacity-60">
                                                                    {m.phone && <div className="text-[9px] text-gray-400">📞 {m.phone}</div>}
                                                                    {m.role && <div className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-0.5">💼 {m.role}</div>}
                                                                </div>
                                                                <div className="pt-2 space-y-0.5 border-t border-white/5 mt-2">
                                                                    {m.college && (
                                                                        <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                                                            <GraduationCap size={10} className="text-gray-600" />
                                                                            <span className="truncate">{m.college}</span>
                                                                        </div>
                                                                    )}
                                                                    {(m.course || m.branch || m.year) && (
                                                                        <div className="text-[9px] text-gray-500 font-medium px-2 py-1 bg-white/[0.02] rounded-md border border-white/5 mt-1">
                                                                            {[m.course, m.branch, m.year].filter(Boolean).join(" · ")}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="group/title relative">
                                            <h3 className="text-sm font-mono text-blue-400/90 leading-relaxed break-all bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                                                <span className="text-blue-500/30 mr-2">$</span>
                                                {sub.projectName || "Untitled Project"}
                                            </h3>
                                            <p className="text-gray-600 text-[10px] font-medium line-clamp-2 hover:line-clamp-none transition-all duration-300 leading-relaxed mt-2 max-w-4xl break-all">
                                                {sub.projectDescription || "No detailed project description provided."}
                                            </p>
                                        </div>

                                        {/* Links */}
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            <a href={sub.githubUrl} target="_blank" className="h-8 px-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-white">
                                                <Github size={12} /> Repo
                                            </a>
                                            {sub.demoUrl && (
                                                <a href={sub.demoUrl} target="_blank" className="h-8 px-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center gap-2 text-blue-400 text-[8px] font-black uppercase tracking-widest">
                                                    <Globe size={12} /> Preview
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Judging Actions */}
                                    <div className="w-full md:w-auto p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 shrink-0">
                                        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-700 text-center">Assign Rank</div>
                                        <div className="flex md:flex-col lg:flex-row gap-1.5">
                                            {[
                                                { rank: 1, label: "1st", color: "bg-yellow-500", glow: "shadow-yellow-500/20" },
                                                { rank: 2, label: "2nd", color: "bg-slate-300", glow: "shadow-slate-300/20" },
                                                { rank: 3, label: "3rd", color: "bg-orange-400", glow: "shadow-orange-400/20" }
                                            ].map(r => (
                                                <button 
                                                    key={r.rank}
                                                    onClick={() => sub.userId?._id && toggleWinner(sub.userId._id, r.rank)}
                                                    className={`w-14 h-10 rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                                                        winResult?.rank === r.rank 
                                                            ? `${r.color} text-black shadow-xl ${r.glow} scale-105` 
                                                            : 'bg-white/5 border border-white/10 text-gray-600 hover:text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    {r.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {filteredSubmissions.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]"
                    >
                        {loading ? (
                            <Loader2 className="w-16 h-16 text-blue-500/20 mb-6 animate-spin" />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                <Search className="w-8 h-8 text-gray-700" />
                            </div>
                        )}
                        <h3 className="text-xl font-black uppercase italic text-gray-700">
                            {loading ? "Scanning Frequency..." : "Awaiting Shipments"}
                        </h3>
                        <p className="text-gray-800 font-medium">
                            {loading ? "Establishing connection to neural network..." : "No projects match your search criteria yet."}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
