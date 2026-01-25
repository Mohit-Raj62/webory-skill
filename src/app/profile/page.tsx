"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";
import { User, Mail, Award, Briefcase, LogOut, ExternalLink, Trophy, Calendar, Video, FileText, Clock, Upload, ChevronRight, Zap } from "lucide-react";
import { ActivityDashboard } from "@/components/dashboard/activity-dashboard";
import { GradesDashboard } from "@/components/dashboard/grades-dashboard";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    _id: string;
    xp?: number;
}

export default function ProfilePage() {
    const [user, setUser] = useState < UserProfile | null > (null);
    const [enrollments, setEnrollments] = useState < any[] > ([]);
    const [applications, setApplications] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState < 'courses' | 'internships' | 'grades' > ('courses');
    const [uploadingAppId, setUploadingAppId] = useState<string | null>(null);
    const router = useRouter();
    const { refreshAuth } = useAuth();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, appId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingAppId(appId);

        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload/resume", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const uploadData = await uploadRes.json();

            // 2. Update Application with Resume URL
            const updateRes = await fetch(`/api/student/applications/${appId}/resume`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume: uploadData.url }),
            });

            if (updateRes.ok) {
                // Update local state
                setApplications(apps => apps.map(app => 
                    app._id === appId ? { ...app, resume: uploadData.url } : app
                ));
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Failed to upload resume");
        } finally {
            setUploadingAppId(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch auth and dashboard data in parallel
                const [resAuth, resDash] = await Promise.all([
                    fetch("/api/auth/me"),
                    fetch("/api/user/dashboard")
                ]);

                if (!resAuth.ok) throw new Error("Not authenticated");
                const userData = await resAuth.json();
                setUser(userData.user);

                if (resDash.ok) {
                    const dashData = await resDash.json();
                    setEnrollments(dashData.enrollments);
                    setApplications(dashData.applications);
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            await refreshAuth();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#020617] relative overflow-hidden">
             {/* Subtle Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-600/10 via-purple-900/5 to-transparent blur-[120px] -z-10" />
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    {/* Modern Profile Header */}
                    <div className="relative group mb-12">
                         {/* Glow Backplate */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="glass-card p-8 md:p-10 rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                            {/* Decorative Line Accent */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                            
                            {/* Avatar with Ring & Glow */}
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative z-10 shadow-2xl">
                                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl md:text-4xl font-black text-white tracking-tighter">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center z-20 shadow-lg">
                                    <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <span className="hidden md:block text-slate-700 font-light text-xl">|</span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest self-center">
                                        {user.role}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                                    <p className="text-slate-400 text-base flex items-center gap-2 font-medium opacity-80">
                                        <Mail size={16} className="text-blue-500/70" /> {user.email}
                                    </p>
                                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-2xl group/xp hover:bg-orange-500/20 transition-all duration-300">
                                        <Zap size={16} className="text-orange-500 animate-pulse" />
                                        <span className="text-xl font-black text-white tracking-tighter">{user.xp || 0}</span>
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">XP Points</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <button 
                                        onClick={() => router.push(`/portfolio/${user._id}`)} 
                                        className="h-11 px-6 rounded-xl bg-white text-black hover:bg-blue-500 hover:text-white font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                                    >
                                        <ExternalLink size={14} /> View Portfolio
                                    </button>
                                    <button 
                                        onClick={() => router.push('/resume')}
                                        className="h-11 px-6 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-white border border-white/5 font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Briefcase size={14} /> My Resume
                                    </button>
                                </div>
                            </div>

                            {/* Logout Action */}
                            <div className="md:ml-auto w-full md:w-auto relative z-10">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full md:w-auto h-11 px-6 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2 group/out"
                                >
                                    <LogOut size={14} className="group-hover/out:-translate-x-1 transition-transform" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modern Dashboard Tabs */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                                Student Hub
                            </h2>
                            <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                <Clock size={12} /> Live Updates
                            </div>
                        </div>

                        {/* Premium Tab Navigation */}
                        <div className="p-1.5 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[1.5rem] flex gap-1 mb-10 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'courses'
                                    ? 'bg-white text-black shadow-xl'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Award size={14} className={activeTab === 'courses' ? 'text-blue-500' : ''} />
                                Courses
                            </button>
                            <button
                                onClick={() => setActiveTab('internships')}
                                className={`flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'internships'
                                    ? 'bg-white text-black shadow-xl'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Briefcase size={14} className={activeTab === 'internships' ? 'text-purple-500' : ''} />
                                Internships
                            </button>
                            <button
                                onClick={() => setActiveTab('grades')}
                                className={`flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === 'grades'
                                    ? 'bg-white text-black shadow-xl'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Trophy size={14} className={activeTab === 'grades' ? 'text-emerald-500' : ''} />
                                Grades
                            </button>
                        </div>

                        {/* Dynamic Tab Content with Animation */}
                        <div className="relative">
                            {activeTab === 'courses' && (
                                <ActivityDashboard category="course" title="Courses" />
                            )}
                            {activeTab === 'internships' && (
                                <ActivityDashboard category="internship" title="Internships" />
                            )}
                            {activeTab === 'grades' && (
                                <GradesDashboard />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Enrolled Courses */}
                        <div className="relative group">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                    <Award className="text-blue-500" size={20} /> Enrolled Courses
                                </h2>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{enrollments.length} Active</span>
                            </div>

                            {enrollments.length > 0 ? (
                                <div className="space-y-4">
                                    {enrollments
                                        .filter((enrollment: any) => enrollment.course)
                                        .map((enrollment, index) => (
                                            <div key={index} className="group/course relative bg-slate-900/40 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-col gap-4 overflow-hidden">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-white font-black tracking-tight group-hover/course:text-blue-400 transition-colors">{enrollment.course?.title || "Unknown Course"}</h3>
                                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{enrollment.course?.level || "Professional"}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push(`/courses/${enrollment.course._id}`)}
                                                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black transition-all duration-300 text-blue-400"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                                        <span className="text-slate-500">Curriculum Progress</span>
                                                        <span className="text-blue-400">{Math.min(enrollment.progress || 0, 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.5)]" 
                                                            style={{ width: `${Math.min(enrollment.progress || 0, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-12 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <Award size={32} />
                                    </div>
                                    <p className="text-slate-400 font-bold mb-6">No active courses found.</p>
                                    <Button onClick={() => router.push('/courses')} className="bg-white text-black hover:bg-blue-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6">
                                        Explore Skills
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Applied Internships */}
                        <div className="relative group">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                    <Briefcase className="text-purple-500" size={20} /> Internship Desk
                                </h2>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{applications.length} Decided</span>
                            </div>

                            {applications.length > 0 ? (
                                <div className="space-y-4">
                                    {applications
                                        .filter((app: any) => app.internship)
                                        .map((app, index) => (
                                            <div key={index} className="group/app relative bg-slate-900/40 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-black tracking-tight mb-1 group-hover/app:text-purple-400 transition-colors">
                                                            {app.internship?.title || "Unknown Career Path"}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={12} className="text-slate-500" />
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                                                        app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                        app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        app.status === 'interview_scheduled' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                        {app.status.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 items-center">
                                                    {app.resume && app.resume !== "Pending Upload" ? (
                                                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="h-8 px-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all border border-white/5 shadow-sm">
                                                            <FileText size={12} className="text-blue-400" /> Resume
                                                        </a>
                                                    ) : (
                                                        <label htmlFor={`resume-upload-${app._id}`} className="h-8 px-4 flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all border border-blue-500/20 cursor-pointer">
                                                            {uploadingAppId === app._id ? <Clock size={12} className="animate-spin" /> : <Upload size={12} />} 
                                                            {uploadingAppId === app._id ? "Uploading..." : "Upload CV"}
                                                        </label>
                                                    )}

                                                    {(app.status === 'accepted' || app.status === 'completed' || app.status === 'interview_scheduled') && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {app.status === 'interview_scheduled' && (
                                                                <button onClick={() => app.interviewLink && window.open(app.interviewLink, '_blank')} className="h-8 px-4 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                                                                    <Video size={12} /> Join Call
                                                                </button>
                                                            )}
                                                            {(app.status === 'accepted' || app.status === 'completed') && (
                                                                <>
                                                                    <button onClick={() => router.push(`/internships/${app.internship._id}/tasks`)} className="h-8 px-4 bg-purple-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-purple-500/20">
                                                                        <FileText size={12} /> Tasks
                                                                    </button>
                                                                    <button onClick={() => router.push(`/internships/applications/${app._id}/offer-letter`)} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                                        📄 Offer
                                                                    </button>
                                                                    {app.status === 'completed' && (
                                                                        <button onClick={() => router.push(`/internships/applications/${app._id}/certificate`)} className="h-8 px-4 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20">
                                                                            🎓 Certificate
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-12 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <Briefcase size={32} />
                                    </div>
                                    <p className="text-slate-400 font-bold mb-6">No applications yet.</p>
                                    <Button onClick={() => router.push('/internships')} className="bg-white text-black hover:bg-purple-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6">
                                        Browse Career Paths
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
