"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";
import { 
    User, Mail, Award, Briefcase, LogOut, ExternalLink, Trophy, 
    Calendar, Video, FileText, Clock, Upload, ChevronRight, Zap 
} from "lucide-react";
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ActivityDashboard = dynamic(() => import('@/components/dashboard/activity-dashboard').then(mod => mod.ActivityDashboard), { ssr: false });
const GradesDashboard = dynamic(() => import('@/components/dashboard/grades-dashboard').then(mod => mod.GradesDashboard), { ssr: false });
const PhoneCollectionModal = dynamic(() => import('@/components/profile/phone-collection-modal').then(mod => mod.PhoneCollectionModal), { ssr: false });

export function ProfileClientContent({ 
    initialUser, 
    initialEnrollments, 
    initialApplications, 
    initialHackathons 
}: { 
    initialUser: any, 
    initialEnrollments: any[], 
    initialApplications: any[], 
    initialHackathons: any[] 
}) {
    const [user, setUser] = useState(initialUser);
    const [enrollments, setEnrollments] = useState(initialEnrollments);
    const [applications, setApplications] = useState(initialApplications);
    const [hackathons, setHackathons] = useState(initialHackathons);
    const [activeTab, setActiveTab] = useState<'courses' | 'internships' | 'grades' | 'hackathons'>('courses');
    const [uploadingAppId, setUploadingAppId] = useState<string | null>(null);
    const [showPhoneModal, setShowPhoneModal] = useState(!initialUser.phone);
    const router = useRouter();
    const { refreshAuth } = useAuth();

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

    const handlePhoneUpdated = (phone: string) => {
        setUser({ ...user, phone });
        setShowPhoneModal(false);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, appId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploadingAppId(appId);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload/resume", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Upload failed");
            const uploadData = await uploadRes.json();
            const updateRes = await fetch(`/api/student/applications/${appId}/resume`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume: uploadData.url }),
            });
            if (updateRes.ok) {
                setApplications(apps => apps.map(app => app._id === appId ? { ...app, resume: uploadData.url } : app));
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Failed to upload resume");
        } finally {
            setUploadingAppId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Modern Profile Header */}
            <div className="relative group mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent blur-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="glass-card p-5 md:p-10 rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
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
                            <button onClick={() => router.push(`/portfolio/${user._id}`)} className="h-11 px-6 rounded-xl bg-white text-black hover:bg-blue-500 hover:text-white font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5">
                                <ExternalLink size={14} /> View Portfolio
                            </button>
                            <button onClick={() => router.push('/resume')} className="h-11 px-6 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-white border border-white/5 font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center gap-2">
                                <Briefcase size={14} /> My Resume
                            </button>
                        </div>
                    </div>

                    <div className="md:ml-auto w-full md:w-auto relative z-10">
                        <button onClick={handleLogout} className="w-full md:w-auto h-11 px-6 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 font-black uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2 group/out">
                            <LogOut size={14} className="group-hover/out:-translate-x-1 transition-transform" /> Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Hub Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <div className="w-1 h-6 bg-blue-500 rounded-full" /> Student Hub
                    </h2>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Clock size={12} /> Live Updates
                    </div>
                </div>

                <div className="p-1.5 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[1.5rem] flex gap-1 mb-10 overflow-x-auto no-scrollbar">
                    {(['courses', 'internships', 'grades', 'hackathons'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500 flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab === 'courses' && <Award size={14} />}
                            {tab === 'internships' && <Briefcase size={14} />}
                            {tab === 'grades' && <Trophy size={14} />}
                            {tab === 'hackathons' && <Zap size={14} />}
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className={activeTab === 'courses' ? 'block' : 'hidden'}><ActivityDashboard category="course" title="Courses" /></div>
                    <div className={activeTab === 'internships' ? 'block' : 'hidden'}><ActivityDashboard category="internship" title="Internships" /></div>
                    <div className={activeTab === 'grades' ? 'block' : 'hidden'}><GradesDashboard /></div>
                    <div className={activeTab === 'hackathons' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hackathons.map((h, i) => (
                                <div key={i} className={`relative group p-[1px] rounded-[2.5rem] transition-all duration-500 overflow-hidden ${h.status === 'winner' ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-700 shadow-xl shadow-orange-500/10' : 'bg-white/10 hover:bg-white/20'}`}>
                                    <div className="bg-[#0A0A15]/90 backdrop-blur-3xl rounded-[2.45rem] p-6 lg:p-8 h-full flex flex-col justify-between relative z-10">
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-3 rounded-2xl ${h.status === 'winner' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}><Trophy size={20} className={h.status === 'winner' ? 'animate-bounce' : ''} /></div>
                                                <Badge className={`border-none capitalize font-black text-[9px] tracking-widest ${h.status === 'winner' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}>{h.status}</Badge>
                                            </div>
                                            <h3 className="text-white font-black tracking-tight mb-2 text-lg lg:text-xl leading-tight">{h.hackathonId.title}</h3>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Project Title</div>
                                            <p className="text-gray-300 font-medium text-xs break-all leading-relaxed line-clamp-3">{h.projectName}</p>
                                        </div>
                                        <div className="pt-6 mt-6 border-t border-white/5">
                                            {h.certificateId ? (
                                                <button onClick={() => router.push(`/certificates/${h.certificateId.certificateId}`)} className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${h.status === 'winner' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-400' : 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/5'}`}><Award size={14} /> Get Certificate</button>
                                            ) : <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest py-2 text-center">Result Pending</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Courses */}
                <div className="relative group">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2"><Award className="text-blue-500" size={20} /> Enrolled Courses</h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{enrollments.length} Active</span>
                    </div>
                    {enrollments.length > 0 ? (
                        <div className="space-y-4">
                            {enrollments.map((enrollment, index) => (
                                <div key={index} className="group/course relative bg-slate-900/40 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-col gap-4 overflow-hidden">
                                     <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-black tracking-tight group-hover/course:text-blue-400 transition-colors">{enrollment.course?.title || "Unknown Course"}</h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{enrollment.course?.level || "Professional"}</p>
                                        </div>
                                        <button onClick={() => router.push(`/courses/${enrollment.course._id}`)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white hover:text-black transition-all duration-300 text-blue-400"><ChevronRight size={18} /></button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                            <span className="text-slate-500">Curriculum Progress</span>
                                            <span className="text-blue-400">{Math.min(enrollment.progress || 0, 100)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.5)]" style={{ width: `${Math.min(enrollment.progress || 0, 100)}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600"><Award size={32} /></div>
                            <p className="text-slate-400 font-bold mb-6">No active courses found.</p>
                            <Button onClick={() => router.push('/courses')} className="bg-white text-black hover:bg-blue-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6">Explore Skills</Button>
                        </div>
                    )}
                </div>

                {/* Internships */}
                <div className="relative group">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2"><Briefcase className="text-purple-500" size={20} /> Internship Desk</h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{applications.length} Decided</span>
                    </div>
                    {applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map((app, index) => (
                                <div key={index} className="group/app relative bg-slate-900/40 backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h3 className="text-white font-black tracking-tight mb-1 group-hover/app:text-purple-400 transition-colors">{app.internship?.title || "Unknown Career"}</h3>
                                            <div className="flex items-center gap-2"><Calendar size={12} className="text-slate-500" /><p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Applied {new Date(app.appliedAt).toLocaleDateString()}</p></div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{app.status.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {app.resume && app.resume !== "Pending Upload" ? (
                                            <>
                                                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="h-8 px-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all border border-white/5 shadow-sm"><FileText size={12} className="text-blue-400" /> Resume</a>
                                                <input type="file" id={`resume-reupload-${app._id}`} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, app._id)} />
                                                <label htmlFor={`resume-reupload-${app._id}`} className="h-8 px-4 flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-orange-400 transition-all border border-orange-500/20 cursor-pointer">{uploadingAppId === app._id ? <Clock size={12} className="animate-spin" /> : <Upload size={12} />}{uploadingAppId === app._id ? "Uploading..." : "Re-upload"}</label>
                                            </>
                                        ) : (
                                            <>
                                                <input type="file" id={`resume-upload-${app._id}`} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, app._id)} />
                                                <label htmlFor={`resume-upload-${app._id}`} className="h-8 px-4 flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 transition-all border border-blue-500/20 cursor-pointer">{uploadingAppId === app._id ? <Clock size={12} className="animate-spin" /> : <Upload size={12} />}{uploadingAppId === app._id ? "Uploading..." : "Upload CV"}</label>
                                            </>
                                        )}
                                        {app.status === 'interview_scheduled' && <button onClick={() => app.interviewLink && window.open(app.interviewLink, '_blank')} className="h-8 px-4 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20"><Video size={12} /> Join Call</button>}
                                        {(app.status === 'accepted' || app.status === 'completed') && (
                                            <>
                                                <button onClick={() => router.push(`/internships/${app.internship._id}/tasks`)} className="h-8 px-4 bg-purple-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-purple-500/20"><FileText size={12} /> Tasks</button>
                                                <button onClick={() => router.push(`/internships/applications/${app._id}/offer-letter`)} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/5 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">📄 Offer</button>
                                                {app.status === 'completed' && <button onClick={() => router.push(`/internships/applications/${app._id}/certificate`)} className="h-8 px-4 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-500/20">🎓 Cert</button>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600"><Briefcase size={32} /></div>
                            <p className="text-slate-400 font-bold mb-6">No applications yet.</p>
                            <Button onClick={() => router.push('/internships')} className="bg-white text-black hover:bg-purple-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6">Browse Careers</Button>
                        </div>
                    )}
                </div>
            </div>
            {showPhoneModal && <PhoneCollectionModal isOpen={showPhoneModal} onPhoneUpdated={handlePhoneUpdated} />}
        </div>
    );
}
