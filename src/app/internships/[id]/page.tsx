"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/session-provider";
import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { 
    CheckCircle, Clock, Globe, PlayCircle, 
    Lock, FileText, Calendar, Video, ChevronDown, ChevronUp, 
    Briefcase, Sparkles, ShieldCheck, ArrowLeft, GraduationCap, ArrowUpRight,
    Eye, CheckCircle2, Award, HelpCircle, Layers, Check, X, ClipboardList,
    Users, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { SyllabusRenderer } from "@/components/SyllabusRenderer";

export default function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAccepted, setIsAccepted] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [pdfs, setPdfs] = useState<any[]>([]);
    const [activeLiveSession, setActiveLiveSession] = useState<any>(null);
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 0: true });
    const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true, 1: true });
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("overview");
    const fetchingRef = useRef(false);

    const toggleModule = (index: number) => {
        setExpandedModules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleFaq = (index: number) => {
        setOpenFaqs(prev => ({
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
                const assignmentsPromise = fetch(`/api/admin/internships/${id}/assignments`).then(r => r.ok ? r.json() : null).catch(() => null);
                const quizzesPromise = fetch(`/api/admin/internships/${id}/quizzes`).then(r => r.ok ? r.json() : null).catch(() => null);
                const activeLiveSessionPromise = fetch(`/api/live/active?internshipId=${id}`).then(r => r.ok ? r.json() : null).catch(() => null);

                const [internshipData, liveClassData, assignmentData, quizData, activeSessionData] = await Promise.all([
                    internshipPromise,
                    liveClassesPromise,
                    assignmentsPromise,
                    quizzesPromise,
                    activeLiveSessionPromise
                ]);

                if (!internshipData || !internshipData.internship) throw new Error("Internship not found");

                setInternship(internshipData.internship);
                if (internshipData.internship.slug && id !== internshipData.internship.slug) {
                    router.replace(`/internships/${internshipData.internship.slug}`);
                    return;
                }
                
                if (internshipData.internship.pdfResources) {
                    setPdfs(internshipData.internship.pdfResources.sort((a: any, b: any) => {
                        if (a.afterModule !== b.afterModule) return a.afterModule - b.afterModule;
                        return (a.order || 0) - (b.order || 0);
                    }));
                }
                
                if (liveClassData) setLiveClasses(liveClassData.liveClasses || []);
                if (assignmentData) setAssignments(assignmentData.assignments || []);
                if (quizData) setQuizzes(quizData.quizzes || []);
                if (activeSessionData && activeSessionData.session) setActiveLiveSession(activeSessionData.session);

            } catch (error) {
                console.error("Failed to fetch internship data", error);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        };

        if (id) fetchInternshipData();
    }, [id, router]);

    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (authLoading || !user) return;
            
            try {
                const res = await fetch("/api/user/applications");
                if (res.ok) {
                    const data = await res.json();
                    const app = data.applications?.find(
                        (a: any) => a.internship?._id?.toString() === id || a.internship?.toString() === id || a.internship?.slug === id
                    );
                    if (app) {
                        setApplicationStatus(app.status);
                        setIsAccepted(app.status === 'accepted' || app.status === 'completed');
                        setSelectedTier(app.selectedTier || "Basic");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch application status", error);
            }
        };

        checkApplicationStatus();
    }, [id, user, authLoading]);

    const trackPDFAccess = async (pdfId: string, downloaded: boolean = false) => {
        try {
            await fetch(`/api/student/internships/${id}/pdfs/${pdfId}/access`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ downloaded }),
            });
        } catch (error) {
            console.error("Failed to track PDF access", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Loading Fellowship Program...</p>
                </div>
            </div>
        );
    }

    if (!internship) {
        return (
            <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between">
                <Navbar />
                <div className="pt-32 pb-20 px-4 container mx-auto max-w-lg flex-1 flex items-center justify-center">
                    <div className="w-full p-8 rounded-2xl bg-[#0b101b] border border-slate-800 text-center space-y-4 shadow-xl">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
                            <Briefcase size={22} />
                        </div>
                        <h1 className="text-xl font-bold text-white">Internship Program Updating</h1>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Is program ka current batch complete ho gaya hai aur next batch schedule update ho raha hai. Aap baaki active programs ya courses check kar sakte hain.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                            <Link href="/internships" className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors">
                                All Internships
                            </Link>
                            <Link href="/courses" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    const isComingSoon = internship.status === "coming_soon";
    const totalSeats = typeof internship.totalSeats === 'number' ? internship.totalSeats : 30;
    const filledSeats = typeof internship.filledSeats === 'number' ? internship.filledSeats : 0;
    const remainingSeats = Math.max(0, totalSeats - filledSeats);
    const isClosed = internship.status === "closed" || remainingSeats <= 0;
    const isJobFree = Boolean(
        internship.isFree === true ||
        internship.isFree === "true" ||
        internship.price === 0 ||
        Number(internship.price) === 0 ||
        internship.type?.toLowerCase() === "free" ||
        (internship.hasTiers && Array.isArray(internship.tiers) && internship.tiers.length > 0 && Number(internship.tiers[0].price) === 0)
    );
    const originalPrice = internship.originalPrice || 2999;
    const price = internship.price || 0;
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Helper for rendering formatted description
    const renderDescription = (text: string) => {
        if (!text) return null;
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let bullets: string[] = [];

        const flushBullets = (key: number) => {
            if (bullets.length > 0) {
                elements.push(
                    <div key={`bullets-${key}`} className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                        {bullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-slate-200">
                                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{b}</span>
                            </div>
                        ))}
                    </div>
                );
                bullets = [];
            }
        };

        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) {
                flushBullets(idx);
                return;
            }

            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                bullets.push(trimmed.substring(2));
            } else if (
                trimmed.toLowerCase() === 'what you will learn' ||
                trimmed.toLowerCase() === 'about the internship' ||
                trimmed.toLowerCase() === 'internship structure' ||
                trimmed.toLowerCase() === 'final outcome' ||
                trimmed.endsWith(':')
            ) {
                flushBullets(idx);
                elements.push(
                    <h3 key={`h-${idx}`} className="text-sm sm:text-base font-bold text-white mt-4 mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                        {trimmed.replace(':', '')}
                    </h3>
                );
            } else {
                flushBullets(idx);
                elements.push(
                    <p key={`p-${idx}`} className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                        {trimmed}
                    </p>
                );
            }
        });

        flushBullets(lines.length);
        return elements;
    };

    const faqs = [
        {
            q: "Will I receive an official Certificate and Letter of Recommendation (LOR)?",
            a: "Yes! Upon submitting your assigned production tasks and completing evaluations, you will receive an official verifiable dual certificate with a unique QR code and credential ID, along with a personalized Letter of Recommendation (LOR) endorsed by mentors from IIT Mandi."
        },
        {
            q: "Is this internship completely online / remote?",
            a: "Yes, this internship is 100% flexible and remote. You will attend live interactive sessions and doubt-clearing calls online, and all project submissions and code reviews happen right in your Webory dashboard."
        },
        {
            q: "What is the expected weekly time commitment?",
            a: "Most students spend between 6 to 10 hours per week. Because the curriculum and recorded sessions are accessible anytime, you can easily balance it alongside your college coursework or exams."
        },
        {
            q: "What kinds of projects will I build?",
            a: "You will work on production-level, industry-standard capstone projects designed to mirror real startup and enterprise problem statements, making your portfolio stand out to top recruiters."
        },
        {
            q: "Can I mention this credential on LinkedIn and my Resume?",
            a: "Absolutely! The certificate and LOR are verifiable with lifetime validity on the Webory Skills portal, and can be added directly to your LinkedIn Licenses & Certifications and resume with a direct verification URL."
        }
    ];

    return (
        <main className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
            <Navbar />

            {/* Ambient Background Grid & Glows */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />
            <div className="fixed top-0 left-1/3 w-[600px] h-[350px] bg-emerald-500/5 blur-[150px] pointer-events-none -z-10" />
            <div className="fixed top-24 right-5 w-[450px] h-[350px] bg-blue-600/5 blur-[150px] pointer-events-none -z-10" />

            {/* Premium Top Hero */}
            <header className="pt-24 pb-8 md:pt-28 md:pb-10 border-b border-white/[0.06] bg-gradient-to-b from-[#080e1b] via-[#050a14] to-transparent relative">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto no-scrollbar">
                        <Link href="/internships" className="hover:text-emerald-400 transition-colors flex items-center gap-1 shrink-0">
                            <ArrowLeft size={13} />
                            <span>All Internships</span>
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-500 shrink-0">{internship.company || "Webory Skills"}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-300 font-medium truncate">{internship.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-8 space-y-3.5">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                {isComingSoon ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                        <Sparkles size={12} className="animate-pulse" /> Cohort Starting Soon
                                    </span>
                                ) : isClosed ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
                                        <Lock size={12} /> Registration Closed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Industrial Fellowship 2026
                                    </span>
                                )}

                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-medium">
                                    <Briefcase size={12} className="text-emerald-400" /> {internship.company}
                                </span>

                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                                    <GraduationCap size={13} className="text-blue-400" /> IIT Mandi Faculty Mentored
                                </span>
                            </div>

                            {/* Program Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                {internship.title}
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
                                {internship.tagline || "Learn through practical projects, industry assignments, and direct mentorship from experienced professionals and IIT Mandi faculty."}
                            </p>

                            {/* Hero Feature Pills */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Duration</p>
                                        <p className="text-xs font-bold text-white">{internship.duration || "4 Weeks"}</p>
                                    </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Globe size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Mode</p>
                                        <p className="text-xs font-bold text-white">{internship.location || "Hybrid"}</p>
                                    </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                        <Award size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Certificate</p>
                                        <p className="text-xs font-bold text-white">Dual + LOR</p>
                                    </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                                        <Briefcase size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Stipend</p>
                                        <p className="text-xs font-bold text-white">{internship.stipend || "Experience Based"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Trust Summary Box */}
                        <div className="lg:col-span-4 hidden lg:block">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-[#0b101b] to-blue-950/20 border border-emerald-500/20 backdrop-blur-xl space-y-3 shadow-xl">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                    <ShieldCheck size={16} /> Industrial Fellowship Guarantee
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Every candidate works on production-grade deliverables and receives lifetime verifiable credentials recognized by recruitment partners.
                                </p>
                                <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-400 border-t border-white/[0.06]">
                                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                                        <CheckCircle2 size={13} className="text-emerald-400" /> 100% Online
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                                        <CheckCircle2 size={13} className="text-blue-400" /> Code Reviews
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                                        <CheckCircle2 size={13} className="text-purple-400" /> PPO Access
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Nav Pill Bar */}
                    <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.06] overflow-x-auto no-scrollbar">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "benefits", label: "Key Benefits" },
                            { id: "certificate", label: "Certificate & LOR" },
                            { id: "syllabus", label: "Syllabus Roadmap" },
                            { id: "curriculum", label: "Video Modules" },
                            { id: "faqs", label: "FAQs" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    const el = document.getElementById(tab.id);
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    activeTab === tab.id 
                                    ? "bg-emerald-500 text-slate-950 shadow-sm" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Page Layout: 8 Columns Left + 4 Columns Sticky Right */}
            <div className="container mx-auto px-4 max-w-6xl py-8 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Deep Information */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* 1. Overview & Structured Description */}
                        <section id="overview" className="bg-[#0b101b]/90 border border-slate-800/90 rounded-2xl p-5 md:p-6 backdrop-blur-md scroll-mt-24 shadow-lg">
                            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.06]">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                    <FileText size={17} />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">About The Fellowship Program</h2>
                                    <p className="text-[11px] text-slate-400">Objectives, outcomes & learning methodology</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {renderDescription(internship.description)}
                            </div>

                            {/* Tech Stack / Skill Tags */}
                            {internship.tags && internship.tags.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                                        Core Tools & Competencies Covered:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {internship.tags.map((tag: string, i: number) => (
                                            <span 
                                                key={i} 
                                                className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-slate-200 text-xs font-medium flex items-center gap-1.5 hover:border-emerald-500/40 transition-colors"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 2. Key Benefits (Practical, Skills, Career) */}
                        {internship.benefits && internship.benefits.length > 0 && (
                            <section id="benefits" className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 scroll-mt-24">
                                {internship.benefits.map((benefit: any, idx: number) => (
                                    <div 
                                        key={idx}
                                        className="p-4 rounded-xl bg-[#0b101b]/80 border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-2"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            {idx === 0 ? <Briefcase size={16} /> : idx === 1 ? <Users size={16} /> : <TrendingUp size={16} />}
                                        </div>
                                        <h4 className="text-xs font-bold text-white">{benefit.title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">{benefit.description}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* 3. Responsibilities & Requirements */}
                        {((internship.responsibilities && internship.responsibilities.length > 0) || (internship.requirements && internship.requirements.length > 0)) && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {internship.responsibilities && internship.responsibilities.length > 0 && (
                                    <div className="bg-[#0b101b]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                                        <h3 className="text-xs sm:text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={15} className="text-emerald-400" /> Key Responsibilities
                                        </h3>
                                        <ul className="space-y-2 text-xs text-slate-300">
                                            {internship.responsibilities.map((resp: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                    <span className="leading-relaxed">{resp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {internship.requirements && internship.requirements.length > 0 && (
                                    <div className="bg-[#0b101b]/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                                        <h3 className="text-xs sm:text-sm font-bold text-white mb-3 flex items-center gap-2">
                                            <Layers size={15} className="text-blue-400" /> Eligibility & Skills
                                        </h3>
                                        <ul className="space-y-2 text-xs text-slate-300">
                                            {internship.requirements.map((req: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                    <span className="leading-relaxed">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* 4. Official Dual Certification & LOR Section */}
                        <section id="certificate" className="bg-gradient-to-br from-[#0c1524] via-[#09111e] to-[#07101c] border border-emerald-500/25 rounded-2xl p-5 md:p-6 relative overflow-hidden group shadow-xl scroll-mt-24">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[90px] pointer-events-none" />

                            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.08]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Official Dual Certification & LOR</h2>
                                        <p className="text-[11px] text-slate-400">Verifiable credentials endorsed by IIT Mandi mentors</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                                    Lifetime Verifiable
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5 items-center">
                                {/* Certificate Specimen Preview */}
                                <div 
                                    onClick={() => setShowCertificateModal(true)}
                                    className="w-full sm:w-[42%] max-w-[270px] shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/70 p-2 group/cert relative cursor-pointer hover:border-emerald-500/40 transition-all"
                                >
                                    <div className="relative w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center">
                                        <img 
                                            src={internship.certificateImage || "/assets/certificate-clean-format.png"} 
                                            alt="Official Internship Certificate Template" 
                                            className="w-full h-auto max-h-[180px] object-contain group-hover/cert:scale-[1.02] transition-transform duration-500" 
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[2px]">
                                            <Eye size={14} /> Click to Enlarge
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-[8px] font-bold text-slate-400 px-0.5">
                                        <span className="text-emerald-400">Specimen Template</span>
                                        <span>Click to View Full</span>
                                    </div>
                                </div>

                                {/* Credential Perks */}
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-xs sm:text-sm font-bold text-white">What You Will Receive Upon Successful Completion:</h3>
                                    <ul className="space-y-2.5">
                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle size={12} />
                                            </div>
                                            <div>
                                                <strong className="text-white block font-semibold text-xs">Verified Industrial Fellowship Certificate</strong>
                                                <span className="text-slate-400 text-[11px] leading-relaxed">
                                                    Equipped with dynamic QR code & unique ID, instantly verifiable on Webory Skills and shareable on LinkedIn.
                                                </span>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle size={12} />
                                            </div>
                                            <div>
                                                <strong className="text-white block font-semibold text-xs">Personalized IIT Mandi Mentor LOR</strong>
                                                <span className="text-slate-400 text-[11px] leading-relaxed">
                                                    Recommendation letter acknowledging your performance, research capabilities, and project execution.
                                                </span>
                                            </div>
                                        </li>

                                        <li className="flex items-start gap-2.5 text-xs text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle size={12} />
                                            </div>
                                            <div>
                                                <strong className="text-white block font-semibold text-xs">Employer Verification Database</strong>
                                                <span className="text-slate-400 text-[11px] leading-relaxed">
                                                    Permanent record in our public verification ledger for background verification by companies.
                                                </span>
                                            </div>
                                        </li>
                                    </ul>

                                    {/* Signatories Info */}
                                    <div className="pt-2 border-t border-white/[0.06] flex items-center gap-4 text-[10px] text-slate-400">
                                        <div>
                                            <span className="text-slate-200 font-semibold block">Mohit Sinha</span>
                                            <span>Founder & CEO</span>
                                        </div>
                                        <span className="text-slate-600">•</span>
                                        <div>
                                            <span className="text-slate-200 font-semibold block">Vijay Kumar</span>
                                            <span className="text-blue-400 font-medium">IIT Mandi Alumnus</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Syllabus Roadmap */}
                        {internship.syllabus && (
                            <section id="syllabus" className="bg-[#0b101b]/90 border border-slate-800/90 rounded-2xl p-5 md:p-6 backdrop-blur-md scroll-mt-24 shadow-lg">
                                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                            <Layers size={17} />
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Structured Syllabus & Milestones</h2>
                                            <p className="text-[11px] text-slate-400">Step-by-step practical deliverables</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="max-h-[460px] overflow-y-auto pr-2 roadmap-scrollbar">
                                    <SyllabusRenderer content={internship.syllabus} />
                                </div>
                            </section>
                        )}

                        {/* 6. Video Curriculum & Modules */}
                        {internship.modules && internship.modules.length > 0 && internship.modules.some((m: any) => m.videos && m.videos.length > 0) && (
                            <section id="curriculum" className="bg-[#0b101b]/90 border border-slate-800/90 rounded-2xl p-5 md:p-6 backdrop-blur-md scroll-mt-24 shadow-lg">
                                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                            <Video size={17} />
                                        </div>
                                        <div>
                                            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Video Curriculum & Lessons</h2>
                                            <p className="text-[11px] text-slate-400">Step-by-step masterclasses and walkthroughs</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    {internship.modules
                                        .filter((m: any) => {
                                            if (isAccepted && m.tierAccess && m.tierAccess.length > 0) {
                                                return m.tierAccess.includes(selectedTier || "Basic");
                                            }
                                            return true;
                                        })
                                        .sort((a: any, b: any) => a.order - b.order)
                                        .map((module: any, moduleIndex: number) => {
                                            const startIndex = internship.modules
                                                .slice(0, moduleIndex)
                                                .reduce((acc: number, m: any) => acc + (m.videos?.length || 0), 0);
                                            
                                            const isModuleUnlocked = isAccepted;

                                            return (
                                                <div key={moduleIndex} className="border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.02]">
                                                    <div 
                                                        className="p-3.5 cursor-pointer hover:bg-white/[0.04] transition-colors flex items-center justify-between"
                                                        onClick={() => toggleModule(moduleIndex)}
                                                    >
                                                        <div>
                                                            <h3 className="text-white font-semibold text-xs sm:text-sm">
                                                                {module.title}
                                                            </h3>
                                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                                                                {module.videos?.length || 0} Lessons
                                                                {moduleIndex === 0 && !isAccepted && (
                                                                    <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded text-[8px] border border-emerald-500/20">
                                                                        Preview
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {expandedModules[moduleIndex] ? (
                                                            <ChevronUp className="text-slate-400" size={16} />
                                                        ) : (
                                                            <ChevronDown className="text-slate-400" size={16} />
                                                        )}
                                                    </div>

                                                    {expandedModules[moduleIndex] && (
                                                        <div className="p-2 space-y-1.5 bg-black/30 border-t border-white/[0.06]">
                                                            {(module.videos || []).map((video: any, videoIndex: number) => {
                                                                const globalIndex = startIndex + videoIndex;
                                                                return (
                                                                    <div key={videoIndex} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                                                                        <div className="flex items-center gap-2.5">
                                                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isModuleUnlocked ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                                                                                <PlayCircle size={14} />
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-white font-medium text-xs block">{video.title}</span>
                                                                                <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{video.duration}</span>
                                                                            </div>
                                                                        </div>
                                                                        {isModuleUnlocked ? (
                                                                            <Link href={`/internships/${id}/video/${globalIndex}`}>
                                                                                <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 h-6 px-2 text-[9px] font-bold uppercase">
                                                                                    Play
                                                                                </Button>
                                                                            </Link>
                                                                        ) : (
                                                                            <Lock size={12} className="text-slate-600 mr-2" />
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
                            </section>
                        )}

                        {/* 7. Live Sessions (if scheduled) */}
                        {liveClasses.length > 0 && (
                            <section className="bg-[#0b101b]/80 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-md">
                                <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-white/[0.06]">
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                        <Video size={15} />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Live Mentorship & Doubt Sessions</h2>
                                </div>

                                <div className="space-y-2.5">
                                    {liveClasses.map((liveClass) => (
                                        <div key={liveClass._id} className="p-3.5 rounded-xl border bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                                                        new Date(liveClass.date) > new Date()
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                    }`}>
                                                        {new Date(liveClass.date) > new Date() ? 'Upcoming' : 'Recorded'}
                                                    </span>
                                                    <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                                                        <Calendar size={11} /> {new Date(liveClass.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-white font-semibold text-xs sm:text-sm">{liveClass.title}</h3>
                                                <p className="text-slate-400 text-xs line-clamp-1">{liveClass.description}</p>
                                            </div>

                                            {isAccepted ? (
                                                <div className="flex gap-2 shrink-0">
                                                    {new Date(liveClass.date) > new Date() ? (
                                                        <a href={liveClass.meetingUrl} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 px-4 rounded-lg text-xs font-semibold">
                                                                Join Live
                                                            </Button>
                                                        </a>
                                                    ) : liveClass.recordingUrl ? (
                                                        <a href={liveClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="bg-white text-black hover:bg-slate-200 h-8 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                                                                <PlayCircle size={13} /> Watch Recording
                                                            </Button>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-500 uppercase font-semibold">No Recording</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-500 bg-white/5 px-2.5 py-1 rounded-md text-[10px] shrink-0">
                                                    <Lock size={12} /> Locked Content
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 8. Student Tasks & Quizzes (if enrolled) */}
                        {isAccepted && ((assignments && assignments.length > 0) || (quizzes && quizzes.length > 0)) && (
                            <section className="bg-[#0b101b]/80 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-4">
                                <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/[0.06]">
                                    <div className="w-7 h-7 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                                        <ClipboardList size={15} />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Assigned Tasks & Assessments</h2>
                                        <p className="text-[11px] text-slate-400">Complete assignments and quizzes to unlock certificate</p>
                                    </div>
                                </div>

                                {assignments.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignments ({assignments.length}):</p>
                                        {assignments.map((assignment) => (
                                            <div key={assignment._id} className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5">
                                                    <FileText size={16} className="text-emerald-400" />
                                                    <div>
                                                        <h4 className="text-white text-xs font-semibold">{assignment.title}</h4>
                                                        <p className="text-[10px] text-slate-400">Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.totalMarks} marks</p>
                                                    </div>
                                                </div>
                                                <Link href={`/internships/${id}/assignment/${assignment._id}`}>
                                                    <Button size="sm" className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700">Submit</Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* 9. Frequently Asked Questions (FAQ) Accordion */}
                        <section id="faqs" className="bg-[#0b101b]/90 border border-slate-800/90 rounded-2xl p-5 md:p-6 backdrop-blur-md scroll-mt-24 shadow-lg">
                            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.06]">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                    <HelpCircle size={17} />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                                    <p className="text-[11px] text-slate-400">Everything you need to know about the fellowship</p>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01]">
                                        <button 
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full p-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                                        >
                                            <span>{faq.q}</span>
                                            {openFaqs[idx] ? (
                                                <ChevronUp size={16} className="text-slate-400 shrink-0 ml-2" />
                                            ) : (
                                                <ChevronDown size={16} className="text-slate-400 shrink-0 ml-2" />
                                            )}
                                        </button>
                                        {openFaqs[idx] && (
                                            <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-2.5">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: Sticky Enrollment & Summary Card */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
                        
                        {/* Main Enrollment / Pricing Box */}
                        <div className="bg-[#0b101b] border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none" />

                            {/* Program Cover / Thumbnail Banner */}
                            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-slate-900 mb-4 group">
                                {internship.thumbnail ? (
                                    <>
                                        <img 
                                            src={internship.thumbnail} 
                                            alt={internship.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[9px] font-bold text-emerald-400 border border-white/10">
                                            Official Fellowship
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#071324] via-[#091a1e] to-[#040810] p-4 flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[45px] pointer-events-none" />
                                        
                                        {/* Top Meta Line */}
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                                                Cohort 2026
                                            </span>
                                            <span className="text-[10px] text-slate-300 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                {internship.duration || "4 Weeks"}
                                            </span>
                                        </div>

                                        {/* Middle Info Line */}
                                        <div className="relative z-10 py-1">
                                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                <GraduationCap size={13} /> Industrial Fellowship
                                            </p>
                                            <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                                                {internship.title}
                                            </h4>
                                        </div>

                                        {/* Bottom Footer Line */}
                                        <div className="text-[10px] text-slate-400 font-medium border-t border-white/10 pt-2 flex items-center justify-between relative z-10">
                                            <span className="truncate pr-2">{internship.company}</span>
                                            <span className="text-emerald-400 shrink-0 font-semibold flex items-center gap-1">
                                                <ShieldCheck size={12} /> Verified LOR
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pricing & Scholarship Section */}
                            <div className="mb-4 pb-3 border-b border-white/[0.08]">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                    {applicationStatus ? "Your Enrollment Status" : isJobFree ? "Fellowship Program Access" : "Training Program Fee"}
                                </p>
                                <div className="flex items-center gap-2.5">
                                    {applicationStatus ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
                                                <ShieldCheck size={18} />
                                                {isAccepted ? 'Enrolled' : 'Application Active'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium capitalize">
                                                ({applicationStatus.replace('_', ' ')})
                                            </span>
                                        </div>
                                    ) : isJobFree ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
                                                FREE
                                            </span>
                                            {originalPrice > 0 && (
                                                <span className="text-xs text-slate-500 line-through">₹{originalPrice}</span>
                                            )}
                                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                100% SCHOLARSHIP
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-extrabold text-white">₹{price}</span>
                                            {originalPrice > price && (
                                                <span className="text-xs text-slate-500 line-through">₹{originalPrice}</span>
                                            )}
                                            {discountPercent > 0 && (
                                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    {discountPercent}% OFF
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    {applicationStatus 
                                        ? "Your application is active on record. Verified certificate & IIT Mandi mentor LOR included upon completion."
                                        : isJobFree 
                                            ? "Zero tuition fee. Includes verifiable certificate & IIT Mandi mentor LOR." 
                                            : "Verified certificate & IIT Mandi mentor LOR included."}
                                </p>
                            </div>

                            {/* Urgency Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5">
                                    <span className="text-slate-400">Cohort Seats</span>
                                    <span className={remainingSeats > 0 ? "text-emerald-400" : "text-rose-400"}>
                                        {remainingSeats > 0 ? `Only ${remainingSeats} Seats Available!` : "Batch Full"}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${remainingSeats > 0 ? 'bg-emerald-500' : 'bg-rose-500'} transition-all`} 
                                        style={{ width: `${Math.min(100, (filledSeats / Math.max(1, totalSeats)) * 100)}%` }} 
                                    />
                                </div>
                            </div>

                            {/* Primary Action Button */}
                            {isAccepted ? (
                                <div className="space-y-2">
                                    {activeLiveSession && (
                                        <button 
                                            onClick={() => window.location.href = `/live/${activeLiveSession.roomId}`}
                                            className="w-full flex items-center justify-center h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md animate-pulse hover:animate-none transition-all cursor-pointer border-none"
                                        >
                                            <Video className="mr-1.5" size={15} /> Join Live Class Now
                                        </button>
                                    )}
                                    <Button 
                                        onClick={() => router.push(`/internships/${id}/tasks`)}
                                        className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider border-none"
                                    >
                                        <FileText size={14} className="mr-1.5" /> Go to Classroom / Tasks
                                    </Button>
                                </div>
                            ) : applicationStatus === 'interview_pending' || applicationStatus === 'interview_scheduled' ? (
                                <div className="space-y-2">
                                    {activeLiveSession && (
                                        <button 
                                            onClick={() => window.location.href = `/live/${activeLiveSession.roomId}`}
                                            className="w-full flex items-center justify-center h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md animate-pulse hover:animate-none transition-all cursor-pointer border-none"
                                        >
                                            <Video className="mr-1.5" size={15} /> Join Interview
                                        </button>
                                    )}
                                    <Button disabled className="w-full h-10 bg-slate-800 text-slate-400 cursor-not-allowed rounded-xl font-bold uppercase tracking-wider text-xs border-none">
                                        <Clock size={14} className="mr-1.5 text-yellow-400" /> Interview Phase
                                    </Button>
                                </div>
                            ) : applicationStatus === 'pending' ? (
                                <Button disabled className="w-full h-10 bg-slate-800 text-slate-400 cursor-not-allowed rounded-xl font-bold uppercase tracking-wider text-xs border-none">
                                    <Clock size={14} className="mr-1.5 text-blue-400" /> Application Under Review
                                </Button>
                            ) : isComingSoon ? (
                                <Button 
                                    disabled
                                    className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 cursor-not-allowed shadow-none"
                                >
                                    <Sparkles size={14} className="mr-1.5 text-amber-400" /> Coming Soon
                                </Button>
                            ) : isClosed ? (
                                <Button 
                                    disabled
                                    className="w-full h-10 rounded-xl font-bold uppercase tracking-wider text-xs bg-rose-500/15 text-rose-300 border border-rose-500/30 cursor-not-allowed shadow-none"
                                >
                                    <Lock size={14} className="mr-1.5 text-rose-400" /> Registration Closed
                                </Button>
                            ) : (
                                <Button 
                                    onClick={() => router.push(`/internships?apply=${internship._id}`)}
                                    className="relative overflow-hidden group w-full h-10 rounded-xl font-bold uppercase tracking-wider text-xs text-white border-none shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_30px_-5px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.01]"
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                                        {isJobFree ? "Apply For Scholarship (Free)" : "Enroll In Fellowship"} <ArrowUpRight size={14} />
                                    </span>
                                </Button>
                            )}

                            {/* Inclusions Checklist */}
                            <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-2 text-slate-300 text-xs">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                                    Program Inclusions:
                                </p>
                                <div className="flex items-center gap-2">
                                    <Check size={13} className="text-emerald-400 shrink-0" />
                                    <span>Verified Certificate with QR & Credential ID</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={13} className="text-emerald-400 shrink-0" />
                                    <span>IIT Mandi Faculty Recommendation (LOR)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={13} className="text-emerald-400 shrink-0" />
                                    <span>Production Capstone Projects for Resume</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={13} className="text-emerald-400 shrink-0" />
                                    <span>Direct 1-on-1 Mentor Guidance & Code Review</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={13} className="text-emerald-400 shrink-0" />
                                    <span>Recruitment Partner Network & PPO Access</span>
                                </div>
                            </div>

                            {/* Trust Seal Footer */}
                            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium text-center">
                                <ShieldCheck size={13} className="text-emerald-400" />
                                <span>100% Verifiable Industrial Fellowship</span>
                            </div>
                        </div>

                        {/* Direct Support Card */}
                        <div className="bg-[#0b101b] border border-slate-800/80 rounded-2xl p-4 text-center space-y-2 backdrop-blur-md">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Have Questions Before Applying?</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Our student counselors and mentors are available to guide you on syllabus, prerequisites and batch timing.
                            </p>
                            <Link href="/support" className="inline-block w-full">
                                <Button variant="outline" className="w-full h-8 rounded-lg text-xs font-semibold border-slate-700 text-slate-200 hover:bg-slate-800">
                                    Open Support Desk
                                </Button>
                            </Link>
                        </div>

                    </div>

                </div>
            </div>

            {/* Certificate Template Preview Modal */}
            {showCertificateModal && (
                <div 
                    onClick={() => setShowCertificateModal(false)}
                    className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="bg-[#0b101b] border border-slate-700/80 rounded-2xl p-4 sm:p-5 max-w-3xl w-full shadow-2xl relative my-auto max-h-[92vh] flex flex-col"
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-400" /> Official Certificate Specimen
                                </h3>
                                <p className="text-[11px] text-slate-400">Verifiable by prospective employers on Webory Skills credential portal</p>
                            </div>
                            <button 
                                onClick={() => setShowCertificateModal(false)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="rounded-xl overflow-auto border border-white/10 bg-black/60 p-2 sm:p-4 flex-1 my-3 flex items-center justify-center">
                            <img 
                                src={internship.certificateImage || "/assets/certificate-clean-format.png"} 
                                alt="Official Internship Certificate Specimen" 
                                className="max-w-full max-h-[66vh] w-auto h-auto object-contain rounded-md shadow-2xl" 
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 text-center shrink-0">
                            Note: Actual issued certificate will include your full name, unique student credential ID, issue date, and QR code verification link.
                        </p>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
