"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/session-provider";
import { useEffect, useState, useRef, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    CheckCircle, Clock, BarChart, Users, Globe, PlayCircle, 
    Lock, FileText, Calendar, Video, ChevronDown, ChevronUp, 
    Briefcase, Sparkles, ShieldCheck, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAccepted, setIsAccepted] = useState(false);
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 0: true });
    const fetchingRef = useRef(false);

    const toggleModule = (index: number) => {
        setExpandedModules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        const fetchInternshipData = async () => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;
            
            try {
                const internshipPromise = fetch(`/api/admin/internships/${id}`).then(r => r.ok ? r.json() : null).catch(() => null);
                const liveClassesPromise = fetch(`/api/internships/${id}/live-classes`).then(r => r.ok ? r.json() : null).catch(() => null);

                const [internshipData, liveClassData] = await Promise.all([
                    internshipPromise,
                    liveClassesPromise
                ]);

                if (!internshipData || !internshipData.internship) throw new Error("Internship not found");

                setInternship(internshipData.internship);
                if (liveClassData) setLiveClasses(liveClassData.liveClasses || []);

            } catch (error) {
                console.error("Failed to fetch internship data", error);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        };

        if (id) fetchInternshipData();
    }, [id]);

    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (authLoading || !user) return;
            
            try {
                const res = await fetch("/api/user/applications");
                if (res.ok) {
                    const data = await res.json();
                    const app = data.applications.find(
                        (a: any) => a.internship?._id?.toString() === id || a.internship?.toString() === id
                    );
                    setIsAccepted(app?.status === 'accepted' || app?.status === 'completed');
                }
            } catch (error) {
                console.error("Failed to fetch application status", error);
            }
        };

        checkApplicationStatus();
    }, [id, user, authLoading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium">Loading Internship Content...</p>
                </div>
            </div>
        );
    }

    if (!internship) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
                Internship not found.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617]">
            <Navbar />

            {/* Premium Header */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-emerald-600/10 via-blue-900/5 to-transparent blur-[120px] -z-10" />
                
                <div className="container mx-auto px-4 relative z-10">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push('/profile')}
                        className="text-slate-400 hover:text-white mb-8"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
                    </Button>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    {internship.type}
                                </span>
                                <span className="text-slate-500 font-bold">•</span>
                                <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                                    <Briefcase size={14} /> {internship.company}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                                {internship.title}
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
                                {internship.tagline || "Master production-ready skills with hands-on internship experience."}
                            </p>
                        </div>

                        {isAccepted ? (
                            <div className="flex flex-col gap-3">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Enrollment Status</p>
                                        <p className="text-white font-bold">Access Granted</p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => router.push(`/internships/${id}/tasks`)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                >
                                    View Assigned Tasks
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                onClick={() => router.push('/internships')}
                                className="bg-white text-black hover:bg-emerald-500 hover:text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-2xl"
                            >
                                Apply Now
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {/* Internship Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                                <Clock className="text-blue-400 mb-2" size={20} />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</p>
                                <p className="text-white font-bold">{internship.duration || "3-6 Months"}</p>
                            </div>
                            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                                <Briefcase className="text-emerald-400 mb-2" size={20} />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stipend</p>
                                <p className="text-white font-bold">{internship.stipend}</p>
                            </div>
                            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                                <Globe className="text-purple-400 mb-2" size={20} />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</p>
                                <p className="text-white font-bold">{internship.location}</p>
                            </div>
                            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl">
                                <Calendar className="text-orange-400 mb-2" size={20} />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline</p>
                                <p className="text-white font-bold">{internship.deadline}</p>
                            </div>
                        </div>

                        {/* Live Classes Section */}
                        {liveClasses.length > 0 && (
                            <div className="bg-slate-900/40 border border-purple-500/20 rounded-[2.5rem] p-8 mb-12 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[80px] -z-10" />
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Video size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Live Sessions & Recordings</h2>
                                </div>

                                <div className="space-y-4">
                                    {liveClasses.map((liveClass) => (
                                        <div key={liveClass._id} className="p-5 rounded-2xl border bg-white/5 border-white/10 hover:bg-white/[0.08] transition-all">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border ${
                                                            new Date(liveClass.date) > new Date()
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                        }`}>
                                                            {new Date(liveClass.date) > new Date() ? 'Upcoming' : 'Recorded'}
                                                        </span>
                                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <Calendar size={12} />
                                                            {new Date(liveClass.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-bold text-lg mb-1">{liveClass.title}</h3>
                                                    <p className="text-slate-400 text-sm font-medium line-clamp-1">{liveClass.description}</p>
                                                </div>
                                                
                                                {isAccepted ? (
                                                    <div className="flex gap-2">
                                                        {new Date(liveClass.date) > new Date() ? (
                                                            <a href={liveClass.meetingUrl} target="_blank" rel="noopener noreferrer">
                                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                                    Join Live
                                                                </Button>
                                                            </a>
                                                        ) : liveClass.recordingUrl ? (
                                                            <a href={liveClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                                                                <Button size="sm" className="bg-white text-black hover:bg-slate-200 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                                    <PlayCircle size={14} /> Watch Recording
                                                                </Button>
                                                            </a>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Recording</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                                        <Lock size={14} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Locked Content</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video Curriculum Section */}
                        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 mb-12">
                            <h2 className="text-2xl font-black text-white tracking-tight mb-8">Video Curriculum</h2>
                            
                            {internship.modules && internship.modules.length > 0 && internship.modules.some((m: any) => m.videos && m.videos.length > 0) ? (
                                <div className="space-y-4">
                                    {internship.modules
                                        .sort((a: any, b: any) => a.order - b.order)
                                        .map((module: any, moduleIndex: number) => {
                                            const startIndex = internship.modules
                                                .slice(0, moduleIndex)
                                                .reduce((acc: number, m: any) => acc + (m.videos?.length || 0), 0);
                                            
                                            const isModuleUnlocked = isAccepted || moduleIndex === 0;

                                            return (
                                                <div key={moduleIndex} className="border border-white/5 rounded-2xl overflow-hidden bg-white/5">
                                                    <div 
                                                        className="p-5 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
                                                        onClick={() => toggleModule(moduleIndex)}
                                                    >
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg">
                                                                {module.title}
                                                            </h3>
                                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                                                                {module.videos?.length || 0} Lessons
                                                                {moduleIndex === 0 && !isAccepted && (
                                                                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] border border-emerald-500/20">
                                                                        Free Preview
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {expandedModules[moduleIndex] ? (
                                                            <ChevronUp className="text-slate-500" size={20} />
                                                        ) : (
                                                            <ChevronDown className="text-slate-500" size={20} />
                                                        )}
                                                    </div>
                                                    
                                                    {expandedModules[moduleIndex] && (
                                                        <div className="p-2 space-y-2 bg-black/20">
                                                        {(module.videos || []).map((video: any, videoIndex: number) => {
                                                            const globalIndex = startIndex + videoIndex;
                                                            return (
                                                                <div key={videoIndex} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group/video">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isModuleUnlocked ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-600"}`}>
                                                                            <PlayCircle size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-white font-medium text-sm block">{video.title}</span>
                                                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{video.duration}</span>
                                                                        </div>
                                                                    </div>
                                                                    {isModuleUnlocked ? (
                                                                        <Link href={`/internships/${id}/video/${globalIndex}`}>
                                                                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 h-8 text-[10px] font-black uppercase tracking-widest">
                                                                                Play
                                                                            </Button>
                                                                        </Link>
                                                                    ) : (
                                                                        <Lock size={14} className="text-slate-700 mr-2" />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            ) : internship.videos && internship.videos.length > 0 ? (
                                <div className="space-y-3">
                                    {internship.videos.map((video: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <PlayCircle className={`text-slate-500 group-hover:text-blue-400 transition-colors`} size={24} />
                                                <div>
                                                    <span className="text-white font-bold block">{video.title}</span>
                                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{video.duration}</span>
                                                </div>
                                            </div>
                                            {isAccepted ? (
                                                <Link href={`/internships/${id}/video/${index}`}>
                                                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 text-[10px] font-black uppercase tracking-widest">
                                                        Watch
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Lock size={16} className="text-slate-700 mr-2" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <Video size={48} className="text-slate-700 mx-auto mb-4 opacity-20" />
                                    <p className="text-slate-500 font-medium">Curriculum being prepared. Check back soon!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Benefits & Info */}
                    <div className="space-y-8">
                         <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-2">
                                <Sparkles className="text-blue-400" size={20} />
                                Internship Perks
                            </h3>
                            <div className="space-y-6">
                                {(internship.benefits && internship.benefits.length > 0 ? internship.benefits : [
                                    { title: "Certified Experience", description: "Get a verified certificate & LOR.", icon: "ShieldCheck" },
                                    { title: "Direct Mentorship", description: "Work with industry experts.", icon: "Sparkles" },
                                    { title: "Career Growth", description: "Exclusive networking & PPO opportunities.", icon: "Briefcase" }
                                ]).map((benefit: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                            {benefit.icon === "ShieldCheck" ? <ShieldCheck size={20} /> : <CheckCircle size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm mb-1">{benefit.title}</h4>
                                            <p className="text-slate-500 text-xs leading-relaxed">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-black text-white tracking-tight mb-4">Need Help?</h3>
                            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                                Our dedicated support team and mentors are here to guide you throughout your internship journey.
                            </p>
                            <Button 
                                onClick={() => router.push('/contact')}
                                className="w-full bg-white text-black hover:bg-slate-200 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
