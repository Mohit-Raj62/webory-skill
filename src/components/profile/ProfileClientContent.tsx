"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";
import { 
    Mail, Award, Briefcase, LogOut, ExternalLink, Trophy, 
    Calendar, Video, FileText, Clock, Upload, ChevronRight, Zap, Sparkles, Download, PlayCircle, Lock, CreditCard,
    BookOpen, Building2
} from "lucide-react";
import dynamic from 'next/dynamic';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrivacyConsentDashboard } from "./PrivacyConsentDashboard";

const ActivityDashboard = dynamic(() => import('@/components/dashboard/activity-dashboard').then(mod => mod.ActivityDashboard), { ssr: false });
const GradesDashboard = dynamic(() => import('@/components/dashboard/grades-dashboard').then(mod => mod.GradesDashboard), { ssr: false });
const PhoneCollectionModal = dynamic(() => import('@/components/profile/phone-collection-modal').then(mod => mod.PhoneCollectionModal), { ssr: false });
const Invoice = dynamic(() => import('@/components/courses/invoice').then(mod => mod.Invoice), { ssr: false });
const PaymentModal = dynamic(() => import('@/components/courses/payment-modal').then(mod => mod.PaymentModal), { ssr: false });

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
    const [enrollments] = useState(initialEnrollments);
    const [applications, setApplications] = useState(initialApplications);
    const [hackathons] = useState(initialHackathons);
    const [activeTab, setActiveTab] = useState<'courses' | 'internships' | 'grades' | 'hackathons' | 'privacy'>('courses');
    const [uploadingAppId, setUploadingAppId] = useState<string | null>(null);
    const [showPhoneModal, setShowPhoneModal] = useState(!initialUser.phone);
    const [mounted, setMounted] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [transactionData, setTransactionData] = useState<any>(null);
    const [paymentModalData, setPaymentModalData] = useState<any>(null);
    const router = useRouter();
    const { refreshAuth } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const handleDownloadInvoice = (data: any, type: 'course' | 'internship') => {
        const item = type === 'course' ? data.course : data.internship;
        const amount = data.amountPaid || (type === 'course' ? item.price : 999);
        const originalPrice = item.originalPrice || item.price || (type === 'internship' ? 2999 : amount);
        const gstPercent = item.gstPercentage || 0;
        
        const invoiceData = {
            transactionId: data.transactionId || `TXN${(data._id || data.id || Date.now()).toString().substring(0, 12)}`,
            courseTitle: item.title || "Unknown Course",
            amount: amount,
            originalAmount: originalPrice,
            discountAmount: originalPrice - amount,
            gstPercentage: gstPercent,
            date: new Date(data.enrolledAt || data.appliedAt || Date.now()).toLocaleDateString(),
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`,
            userPhone: user.phone || '',
        };
        setTransactionData(invoiceData);
        setShowInvoice(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* ── PROFILE HEADER CARD ── */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-purple-600/10 to-indigo-600/10 blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F1426]/90 via-[#0C1020]/80 to-[#0A0D1B]/90 backdrop-blur-2xl p-4 sm:p-6 md:p-7 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    
                    {/* Top Row: Role badge on left, Prominent Sign Out Button on right */}
                    <div className="flex items-center justify-between gap-3 mb-3.5 sm:mb-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                {user.role}
                            </span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Active</span>
                            </div>
                        </div>

                        {/* Sign Out Button (at the top on both mobile & desktop) */}
                        <button 
                            onClick={handleLogout} 
                            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/30 active:scale-95 shrink-0 cursor-pointer"
                            title="Sign Out"
                        >
                            <LogOut size={15} />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* User Identity: Avatar + Name + Email */}
                    <div className="flex items-center gap-3.5 sm:gap-5 mb-4 sm:mb-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl p-1 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-blue-500/10">
                                <div className="w-full h-full rounded-[13px] bg-[#0A0D1B] flex items-center justify-center text-lg sm:text-2xl font-black text-white tracking-tight">
                                    {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                                </div>
                            </div>
                        </div>

                        {/* Name & Email */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
                                {user?.firstName || 'User'} {user?.lastName || ''}
                            </h1>
                            <p className="text-slate-400 text-xs sm:text-sm flex items-center gap-1.5 font-medium mt-1 truncate">
                                <Mail size={12} className="text-blue-400 shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </p>
                        </div>
                    </div>

                    {/* Mini Stat Capsules */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-3.5 sm:mb-5">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                <BookOpen size={12} className="text-blue-400 shrink-0" />
                                <span>Courses</span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-white mt-0.5">{enrollments.length}</div>
                        </div>

                        <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                <Briefcase size={12} className="text-purple-400 shrink-0" />
                                <span>Internships</span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-white mt-0.5">{applications.length}</div>
                        </div>

                        <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                <Trophy size={12} className="text-amber-400 shrink-0" />
                                <span>Hackathons</span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-white mt-0.5">{hackathons.length}</div>
                        </div>

                        <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/30 transition-colors">
                            <div className="flex items-center gap-1.5 text-orange-400 text-[11px] font-medium">
                                <Zap size={12} className="text-orange-400 shrink-0 animate-pulse" />
                                <span>Total XP</span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-white mt-0.5">{user.xp || 0}</div>
                        </div>
                    </div>

                    {/* Action Buttons: 2x2 grid on mobile, flex on desktop */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-3 border-t border-white/5">
                        <button 
                            onClick={() => router.push(`/portfolio/${user._id}`)} 
                            className="w-full sm:w-auto h-10 px-3 sm:px-5 rounded-xl bg-white text-slate-900 hover:bg-blue-600 hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-white/5 hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
                        >
                            <ExternalLink size={14} />
                            <span>Portfolio</span>
                        </button>
                        <button 
                            onClick={() => router.push('/resume')} 
                            className="w-full sm:w-auto h-10 px-3 sm:px-5 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 active:scale-95 cursor-pointer"
                        >
                            <Briefcase size={14} className="text-purple-400" />
                            <span>My Resume</span>
                        </button>
                        <button 
                            onClick={() => router.push('/profile/edit')} 
                            className="w-full sm:w-auto h-10 px-3 sm:px-5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-95 cursor-pointer"
                        >
                            <Sparkles size={14} className="text-yellow-400" />
                            <span>Edit Info</span>
                        </button>
                        <button 
                            onClick={() => router.push('/profile/security')} 
                            className="w-full sm:w-auto h-10 px-3 sm:px-5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-black/20 active:scale-95 cursor-pointer"
                        >
                            <Lock size={14} className="text-slate-400" />
                            <span>Security</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── STUDENT HUB SECTION ── */}
            <div>
                <div className="flex items-center justify-between mb-2.5">
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-500 rounded-full" /> Student Hub
                    </h2>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock size={11} /> Live Updates
                    </div>
                </div>

                {/* Pill Tabs with Count Badges */}
                <div className="p-1 bg-[#0C1020]/90 backdrop-blur-xl border border-white/10 rounded-xl flex gap-1 mb-4 overflow-x-auto no-scrollbar shadow-inner">
                    {(['courses', 'internships', 'grades', 'hackathons', 'privacy'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`shrink-0 sm:flex-1 min-w-[85px] sm:min-w-0 px-2.5 py-1.5 rounded-lg font-medium text-xs capitalize transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                                activeTab === tab 
                                    ? 'bg-white text-black shadow-md font-semibold' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab === 'courses' && <BookOpen size={13} className={activeTab === tab ? 'text-blue-600' : 'text-blue-400'} />}
                            {tab === 'internships' && <Briefcase size={13} className={activeTab === tab ? 'text-purple-600' : 'text-purple-400'} />}
                            {tab === 'grades' && <Trophy size={13} className={activeTab === tab ? 'text-amber-600' : 'text-amber-400'} />}
                            {tab === 'hackathons' && <Zap size={13} className={activeTab === tab ? 'text-orange-600' : 'text-orange-400'} />}
                            {tab === 'privacy' && <Lock size={13} className={activeTab === tab ? 'text-slate-800' : 'text-slate-400'} />}
                            <span>{tab}</span>
                            {tab === 'courses' && enrollments.length > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${activeTab === tab ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-300'}`}>
                                    {enrollments.length}
                                </span>
                            )}
                            {tab === 'internships' && applications.length > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${activeTab === tab ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-300'}`}>
                                    {applications.length}
                                </span>
                            )}
                            {tab === 'hackathons' && hackathons.length > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${activeTab === tab ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-300'}`}>
                                    {hackathons.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className={activeTab === 'courses' ? 'block' : 'hidden'}><ActivityDashboard category="course" title="Courses" /></div>
                    <div className={activeTab === 'internships' ? 'block' : 'hidden'}><ActivityDashboard category="internship" title="Internships" /></div>
                    <div className={activeTab === 'grades' ? 'block' : 'hidden'}><GradesDashboard /></div>
                    
                    {/* Compact Hackathon Cards */}
                    <div className={activeTab === 'hackathons' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {hackathons.map((h, i) => (
                                <div key={i} className={`relative group p-[1px] rounded-xl transition-all duration-300 overflow-hidden ${h.status === 'winner' ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-700 shadow-md shadow-orange-500/10' : 'bg-white/10 hover:bg-white/20'}`}>
                                    <div className="bg-[#0A0A15]/95 backdrop-blur-2xl rounded-[calc(0.75rem-1px)] p-3 sm:p-3.5 h-full flex flex-col justify-between relative z-10">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className={`p-1.5 rounded-lg ${h.status === 'winner' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    <Trophy size={14} className={h.status === 'winner' ? 'animate-bounce' : ''} />
                                                </div>
                                                <Badge className={`border-none capitalize font-semibold text-[9px] px-1.5 py-0.2 tracking-wide ${h.status === 'winner' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}>{h.status}</Badge>
                                            </div>
                                            <h3 className="text-white font-bold tracking-tight mb-1 text-xs sm:text-sm leading-tight truncate">{h.hackathonId?.title || "Unknown Hackathon"}</h3>
                                            <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Project</div>
                                            <p className="text-gray-300 font-medium text-[11px] break-all leading-snug line-clamp-1">{h.projectName}</p>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-white/5">
                                            {h.certificateId ? (
                                                <button onClick={() => router.push(`/certificates/${h.certificateId.certificateId}`)} className={`w-full h-7 rounded-lg text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${h.status === 'winner' ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20 hover:bg-yellow-400' : 'bg-white text-black hover:bg-gray-200'}`}>
                                                    <Award size={11} /> Certificate
                                                </button>
                                            ) : (
                                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-0.5 text-center">Result Pending</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={activeTab === 'privacy' ? 'block' : 'hidden'}>
                        <PrivacyConsentDashboard user={user} />
                    </div>
                </div>
            </div>

            {/* ── COURSES & INTERNSHIPS GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Courses Desk */}
                <div className="relative group">
                    <div className="flex items-center justify-between mb-2.5">
                        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                            <BookOpen className="text-blue-400" size={15} /> Enrolled Courses
                        </h2>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {enrollments.length} Active
                        </span>
                    </div>

                    {enrollments.length > 0 ? (
                        <div className="space-y-2.5">
                            {enrollments.map((enrollment, index) => (
                                <div key={index} className="group/course relative bg-[#0C1020]/80 backdrop-blur-xl p-3 rounded-xl border border-white/8 hover:border-blue-500/40 transition-all duration-300 flex flex-col gap-2.5 shadow-md hover:shadow-blue-500/5">
                                    <div className="flex items-start gap-2.5">
                                        {/* Compact Thumbnail */}
                                        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                                            {enrollment.course?.thumbnail ? (
                                                <img 
                                                    src={enrollment.course.thumbnail} 
                                                    alt={enrollment.course?.title || "Course"} 
                                                    className="w-full h-full object-cover group-hover/course:scale-105 transition-transform duration-300" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-indigo-600/30 text-blue-400">
                                                    <BookOpen size={16} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Course Info */}
                                        <div className="flex-1 min-w-0 pr-1">
                                            <h3 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight group-hover/course:text-blue-400 transition-colors truncate">
                                                {enrollment.course?.title || "Unknown Course"}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/5 border border-white/5">
                                                    {enrollment.course?.level || "Beginner"}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {enrollment.course?.videos?.length || 0} Videos
                                                </span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => enrollment.course?._id && router.push(`/courses/${enrollment.course.slug || enrollment.course._id}`)} 
                                            className="p-1 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white transition-all text-slate-400 shrink-0 cursor-pointer"
                                            title="View course"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    {/* Compact Progress Bar */}
                                    <div className="space-y-1 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-center text-[10px] font-semibold">
                                            <span className="text-slate-400">Progress</span>
                                            <span className="text-blue-400 font-bold">{Math.min(enrollment.progress || 0, 100)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                                                style={{ width: `${Math.min(enrollment.progress || 0, 100)}%` }} 
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 w-full pt-0.5">
                                        <button 
                                            onClick={() => handleDownloadInvoice(enrollment, 'course')}
                                            className="flex-1 h-8 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
                                        >
                                            <Download size={11} className="text-slate-400" /> Invoice
                                        </button>
                                        <button 
                                            onClick={() => enrollment.course?._id && router.push(`/courses/${enrollment.course.slug || enrollment.course._id}`)}
                                            className="flex-[1.4] h-8 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 active:scale-95 cursor-pointer"
                                        >
                                            Continue Course <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#0C1020]/60 backdrop-blur-xl border border-white/8 rounded-xl p-6 text-center">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2.5 text-slate-500">
                                <BookOpen size={18} />
                            </div>
                            <p className="text-slate-400 font-medium text-xs mb-3">No enrolled courses yet.</p>
                            <Button onClick={() => router.push('/courses')} className="bg-white text-black hover:bg-blue-500 hover:text-white rounded-lg font-semibold text-xs h-8 px-4 cursor-pointer">
                                Browse Courses
                            </Button>
                        </div>
                    )}
                </div>

                {/* Internships Desk */}
                <div className="relative group">
                    <div className="flex items-center justify-between mb-2.5">
                        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                            <Briefcase className="text-purple-400" size={15} /> Internship Desk
                        </h2>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {applications.length} Applications
                        </span>
                    </div>

                    {applications.length > 0 ? (
                        <div className="space-y-2.5">
                            {applications.map((app, index) => (
                                <div key={index} className="group/app relative bg-[#0C1020]/80 backdrop-blur-xl p-3 rounded-xl border border-white/8 hover:border-purple-500/40 transition-all duration-300 shadow-md hover:shadow-purple-500/5">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <div className="flex-1 min-w-0 pr-1">
                                            <h3 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight mb-0.5 group-hover/app:text-purple-400 transition-colors truncate">
                                                {app.internship?.title || "Unknown Career"}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                {app.internship?.company && (
                                                    <span className="flex items-center gap-1 text-slate-300">
                                                        <Building2 size={10} className="text-purple-400" />
                                                        {app.internship.company}
                                                    </span>
                                                )}
                                                {app.internship?.type && (
                                                    <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-[9px] text-slate-400 uppercase">
                                                        {app.internship.type}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-slate-500">
                                                    <Calendar size={10} />
                                                    {mounted ? new Date(app.appliedAt).toLocaleDateString() : "Loading..."}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Tag */}
                                        <div className="shrink-0">
                                            {app.status === 'pending' && (app.internship?.price || 0) > 0 && !(app.transactionId && !app.transactionId.startsWith('PENDING_') && (app.amountPaid || 0) > 0) ? (
                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase tracking-tight bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                    PAYMENT PENDING
                                                </span>
                                            ) : app.status === 'pending' && (app.transactionId && !app.transactionId.startsWith('PENDING_') && (app.amountPaid || 0) > 0) ? (
                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase tracking-tight bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                    UNDER REVIEW
                                                </span>
                                            ) : (
                                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase tracking-tight ${app.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                    {app.status.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-white/5">
                                        {app.status === 'pending' && (app.internship?.price || 0) > 0 && !(app.transactionId && !app.transactionId.startsWith('PENDING_') && (app.amountPaid || 0) > 0) && (
                                            <button onClick={() => setPaymentModalData(app)} className="h-7.5 px-2.5 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-white transition-all shadow-sm shadow-orange-500/20 cursor-pointer">
                                                <CreditCard size={10} /> Pay Now
                                            </button>
                                        )}
                                        {app.resume && app.resume !== "Pending Upload" ? (
                                            <>
                                                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="h-7.5 px-2.5 flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-medium text-slate-300 transition-all border border-white/8 shadow-sm">
                                                    <FileText size={10} className="text-blue-400" /> Resume
                                                </a>
                                                <input type="file" id={`resume-reupload-${app._id}`} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, app._id)} />
                                                <label htmlFor={`resume-reupload-${app._id}`} className="h-7.5 px-2.5 flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg text-[10px] font-medium text-orange-400 transition-all border border-orange-500/20 cursor-pointer">
                                                    {uploadingAppId === app._id ? <Clock size={10} className="animate-spin" /> : <Upload size={10} />}
                                                    {uploadingAppId === app._id ? "Uploading..." : "Re-upload"}
                                                </label>
                                            </>
                                        ) : (
                                            <>
                                                <input type="file" id={`resume-upload-${app._id}`} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, app._id)} />
                                                <label htmlFor={`resume-upload-${app._id}`} className="h-7.5 px-2.5 flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-[10px] font-medium text-blue-400 transition-all border border-blue-500/20 cursor-pointer">
                                                    {uploadingAppId === app._id ? <Clock size={10} className="animate-spin" /> : <Upload size={10} />}
                                                    {uploadingAppId === app._id ? "Uploading..." : "Upload CV"}
                                                </label>
                                            </>
                                        )}
                                        {app.status === 'interview_scheduled' && (
                                            <button onClick={() => window.location.href = `/api/live/join-interview?applicationId=${app._id}`} className="h-7.5 px-2.5 bg-emerald-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer">
                                                <Video size={10} /> Join Call
                                            </button>
                                        )}
                                        {(app.status !== 'pending' && app.status !== 'rejected') && (
                                            <>
                                                <button onClick={() => app.internship?._id && router.push(`/internships/${app.internship.slug || app.internship._id}`)} className="h-7.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-blue-600/20 cursor-pointer">
                                                    <PlayCircle size={10} /> Content
                                                </button>
                                                <button onClick={() => app.internship?._id && router.push(`/internships/${app.internship.slug || app.internship._id}/tasks`)} className="h-7.5 px-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-purple-500/20 cursor-pointer">
                                                    <FileText size={10} /> Tasks
                                                </button>
                                                {(app.amountPaid > 0) && (
                                                    <button 
                                                        onClick={() => handleDownloadInvoice(app, 'internship')}
                                                        className="h-7.5 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                                                    >
                                                        <Download size={10} /> Invoice
                                                    </button>
                                                )}
                                                {(app.status === 'accepted' || app.status === 'completed') && (
                                                    <button onClick={() => router.push(`/internships/${app.internship?.slug || app.internship?._id}/offer-letter`)} className="h-7.5 px-2.5 bg-white/5 hover:bg-white/10 border border-white/8 text-emerald-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 cursor-pointer">
                                                        📄 Offer
                                                    </button>
                                                )}
                                                {app.status === 'completed' && (
                                                    <button onClick={() => router.push(`/internships/${app.internship?.slug || app.internship?._id}/certificate`)} className="h-7.5 px-2.5 bg-blue-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer">
                                                        🎓 Cert
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#0C1020]/60 backdrop-blur-xl border border-white/8 rounded-xl p-6 text-center">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2.5 text-slate-500">
                                <Briefcase size={18} />
                            </div>
                            <p className="text-slate-400 font-medium text-xs mb-3">No applications yet.</p>
                            <Button onClick={() => router.push('/internships')} className="bg-white text-black hover:bg-purple-500 hover:text-white rounded-lg font-semibold text-xs h-8 px-4 cursor-pointer">
                                Browse Internships
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            
            {showPhoneModal && <PhoneCollectionModal isOpen={showPhoneModal} onPhoneUpdated={handlePhoneUpdated} />}
            
            {showInvoice && transactionData && (
                <Invoice
                    {...transactionData}
                    onClose={() => setShowInvoice(false)}
                />
            )}

            {paymentModalData && (
                <PaymentModal
                    isOpen={!!paymentModalData}
                    onClose={() => setPaymentModalData(null)}
                    courseTitle={paymentModalData.internship?.title || "Unknown Career"}
                    price={paymentModalData.internship?.price || 0}
                    originalPrice={paymentModalData.internship?.price || 0}
                    discountPercentage={0}
                    gstPercentage={paymentModalData.internship?.gstPercentage || 0}
                    internshipId={paymentModalData.internship?._id || paymentModalData.internship}
                    userId={user?._id || user?.id}
                    userName={`${user?.firstName} ${user?.lastName}`}
                    userEmail={user?.email}
                    mobileNumber={user?.phone}
                    resourceType="internship"
                />
            )}
        </div>
    );
}
