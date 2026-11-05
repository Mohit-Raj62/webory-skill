"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import nextDynamic from "next/dynamic";

const PaymentModal = nextDynamic(() => import("@/components/courses/payment-modal").then(mod => mod.PaymentModal), { ssr: false });
const Invoice = nextDynamic(() => import("@/components/courses/invoice").then(mod => mod.Invoice), { ssr: false });
import { LeadCaptureModal } from "@/components/lead-capture-modal";
import { useAuth } from "@/components/auth/session-provider";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    CheckCircle, Clock, Globe, PlayCircle, Lock,
    ClipboardList, FileText, Video, ChevronDown, ChevronUp,
    Star, Shield, Trophy, Zap, Play, X, ArrowRight,
    BookOpen, Award, Download
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { SyllabusRenderer } from "@/components/SyllabusRenderer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const safeDate = (date: any): string => {
    try {
        if (!date) return new Date().toLocaleDateString("en-IN");
        const d = new Date(date);
        if (isNaN(d.getTime())) return new Date().toLocaleDateString("en-IN");
        return d.toLocaleDateString("en-IN");
    } catch {
        return new Date().toLocaleDateString("en-IN");
    }
};

export default function CourseDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [transactionData, setTransactionData] = useState<any>(null);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [activeLiveSession, setActiveLiveSession] = useState<any>(null);
    const [certificateData, setCertificateData] = useState<any>(null);
    const [pdfs, setPdfs] = useState<any[]>([]);
    const [enrollmentData, setEnrollmentData] = useState<any>(null);
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 0: true });
    const [showPromo, setShowPromo] = useState(false);
    const [stickyVisible, setStickyVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "resources">("overview");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const fetchingRef = useRef(false);

    const FAQS = [
        {
            q: "Do I get lifetime access to the course content?",
            a: "Yes! Once enrolled, you have lifetime access to all videos, assignments, downloadable resources, and all future updates at no extra charge."
        },
        {
            q: "Will I receive a verified certificate upon completion?",
            a: "Yes. Once you complete the course videos and score 90% or above on the course assessments, you will receive an official Webory Skills verified certificate with a unique credential ID and QR code shareable on LinkedIn and your resume."
        },
        {
            q: "How does doubt support and mentor guidance work?",
            a: "You have access to 1-on-1 doubt resolution through our student portal, weekly live mentor sessions, and direct guidance from IIT Mandi alumni and tech leads."
        },
        {
            q: "Are there practical hands-on projects included?",
            a: "Absolutely. You will build production-grade, portfolio-ready projects from scratch rather than simple demo apps, giving you real practical engineering experience."
        },
        {
            q: "Is there a money-back guarantee?",
            a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the learning experience, you can request a full refund."
        }
    ];

    const toggleModule = (index: number) => {
        setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        let embedUrl = url;
        if (url.includes("youtube.com/watch?v=")) embedUrl = url.replace("watch?v=", "embed/");
        else if (url.includes("youtu.be/")) embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
        const ampIdx = embedUrl.indexOf("&");
        if (ampIdx !== -1 && embedUrl.includes("youtube.com/embed/")) embedUrl = embedUrl.substring(0, ampIdx);
        return embedUrl;
    };

    // Sticky bar on scroll
    useEffect(() => {
        const onScroll = () => {
            if (heroRef.current) {
                const bottom = heroRef.current.getBoundingClientRect().bottom;
                setStickyVisible(bottom < 0);
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('buy') === 'true' && user && !isEnrolled) {
            setShowPayment(true);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [user, isEnrolled]);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;
            try {
                const courseRes = await fetch(`/api/courses/${id}`).then(r => r.ok ? r.json() : null).catch(() => null);
                if (!courseRes?.course) throw new Error("Course not found");
                
                const courseObj = courseRes.course;
                setCourse(courseObj);
                const actualId = courseObj._id;

                if (courseObj.slug && id !== courseObj.slug) {
                    router.replace(`/courses/${courseObj.slug}`);
                    return;
                }
                if (courseObj.pdfResources) {
                    setPdfs(courseObj.pdfResources.sort((a: any, b: any) => {
                        if (a.afterModule !== b.afterModule) return a.afterModule - b.afterModule;
                        return (a.order || 0) - (b.order || 0);
                    }));
                }

                const [quizData, assignmentData, liveClassData] = await Promise.all([
                    fetch(`/api/admin/courses/${actualId}/quizzes`).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch(`/api/admin/courses/${actualId}/assignments`).then(r => r.ok ? r.json() : null).catch(() => null),
                    fetch(`/api/courses/${actualId}/live-classes`).then(r => r.ok ? r.json() : null).catch(() => null),
                ]);

                if (quizData) setQuizzes(quizData.quizzes || []);
                if (assignmentData) setAssignments(assignmentData.assignments || []);
                if (liveClassData) setLiveClasses(liveClassData.liveClasses || []);
            } catch (error) {
                console.error("Failed to fetch course data", error);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        };
        if (id) fetchCourseData();
    }, [id]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (authLoading || !user) return;
            try {
                const resEnroll = await fetch("/api/user/enrollments");
                if (resEnroll.ok) {
                    const enrollData = await resEnroll.json();
                    const currentEnrollment = enrollData.enrollments.find(
                        (e: any) => e.course?._id?.toString() === id || e.course?.slug === id || (course && e.course?._id?.toString() === course._id)
                    );
                    const enrolled = !!currentEnrollment;
                    setIsEnrolled(enrolled);
                    setEnrollmentData(currentEnrollment);
                    if (enrolled) {
                        const targetId = course?._id || id;
                        try {
                            const resCert = await fetch(`/api/courses/${targetId}/certificate-eligibility`);
                            if (resCert.ok) setCertificateData(await resCert.json());
                            const resActive = await fetch(`/api/live/active?courseId=${targetId}`);
                            if (resActive.ok) setActiveLiveSession(await resActive.json());
                        } catch { /* silent */ }
                    }
                }
            } catch { /* silent */ }
        };
        fetchUserData();
    }, [id, user, authLoading, course]);

    useEffect(() => {
        if (user && course) {
            fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ relatedId: course._id, category: "course", metadata: { courseName: course.title } }),
            }).catch(() => {});
        }
    }, [user, course]);

    const handleBuyClick = () => {
        if (isEnrolled) {
            router.push(`/courses/${course?.slug || id}/video/0`);
            return;
        }
        if (!user) { router.push(`/login?redirect=/courses/${id}`); return; }
        if (course.isFree) { handlePaymentSuccess("FREE"); return; }
        setShowPayment(true);
    };

    const handlePaymentSuccess = async (transactionId: string, promoCode?: string) => {
        try {
            const res = await fetch("/api/courses/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: id, transactionId, promoCode }),
            });
            if (res.ok) {
                setIsEnrolled(true);
                setShowPayment(false);
                const resCert = await fetch(`/api/courses/${id}/certificate-eligibility`);
                if (resCert.ok) setCertificateData(await resCert.json());
            }
        } catch { /* silent */ }
    };

    const curriculumPdf = pdfs.find(p => 
        p.title?.toLowerCase().includes("curriculum") || 
        p.title?.toLowerCase().includes("syllabus")
    ) || pdfs[0];

    const trackPDFAccess = async (pdfId: string, downloaded = false) => {
        try {
            await fetch(`/api/student/courses/${course?._id || id}/pdfs/${pdfId}/access`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ downloaded }),
            });
        } catch { /* silent */ }
    };

    const handleDownloadCurriculumPdf = () => {
        if (!curriculumPdf?.fileUrl) {
            if (user && (user.role === "admin" || user.role === "superadmin" || user.role === "teacher")) {
                toast.info("Curriculum PDF has not been uploaded yet.", {
                    action: {
                        label: "Upload PDF",
                        onClick: () => {
                            const editPath = (user.role === "admin" || user.role === "superadmin")
                                ? `/admin/courses/${course?.slug || course?._id || id}/edit` 
                                : `/teacher/courses/${course?.slug || course?._id || id}/edit`;
                            router.push(editPath);
                        }
                    }
                });
            } else {
                toast.info("Curriculum PDF will be available soon!");
            }
            return;
        }

        trackPDFAccess(curriculumPdf._id, true);
        const fileName = curriculumPdf.fileName || `${(course?.title || 'Course').replace(/[^a-zA-Z0-9]/g, '_')}_Curriculum.pdf`;
        const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(curriculumPdf.fileUrl)}&download=true&filename=${encodeURIComponent(fileName)}`;

        const link = document.createElement("a");
        link.href = proxyUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading Curriculum PDF: ${curriculumPdf.title}`);
    };

    const handleDownloadInvoice = () => {
        const enrollmentDate = enrollmentData?.enrolledAt ? safeDate(enrollmentData.enrolledAt) : new Date().toLocaleDateString("en-IN");
        const transactionId = enrollmentData?._id ? `TXN${enrollmentData._id.toString().substring(0, 12)}` : `TXN${Date.now()}`;
        const originalPrice = course.originalPrice || course.price;
        const basePrice = course.discountPercentage > 0 && course.originalPrice > 0
            ? Math.round(course.originalPrice * (1 - course.discountPercentage / 100))
            : course.price;
        const gstPercent = course.gstPercentage || 0;
        const totalAmount = Math.round(basePrice * (1 + gstPercent / 100));
        const originalTotal = Math.round(originalPrice * (1 + gstPercent / 100));
        setTransactionData({
            transactionId, courseTitle: course.title,
            amount: totalAmount, originalAmount: originalTotal,
            discountAmount: originalTotal - totalAmount,
            gstPercentage: gstPercent, date: enrollmentDate,
            userEmail: user?.email || '', userName: user ? `${user.firstName} ${user.lastName}` : '',
            userPhone: user?.phone || '',
        });
        setShowInvoice(true);
    };

    // ── LOADING ──
    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-400 text-sm">Loading course...</span>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <p className="text-white font-semibold text-lg">Course not found</p>
                    <Link href="/courses" className="text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center gap-1">
                        ← Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    const displayPrice = course.discountPercentage > 0 && course.originalPrice > 0
        ? Math.round(course.originalPrice * (1 - course.discountPercentage / 100))
        : course.price;
    const videoProgress = certificateData?.videoProgress || 0;
    const quizzesUnlocked = videoProgress >= 25;
    const totalVideos = course.modules?.reduce((acc: number, m: any) => acc + (m.videos?.length || 0), 0) || 0;

    return (
        <main className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-600/30">
            {/* Subtle grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808009_1px,transparent_1px),linear-gradient(to_bottom,#80808009_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <Navbar />
            <LeadCaptureModal courseId={id as string} courseName={course?.title} />

            {/* ── STICKY TOP BAR (shows after scrolling past hero) ── */}
            <AnimatePresence>
                {stickyVisible && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0A0D1A]/95 backdrop-blur-xl shadow-xl"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                            <p className="text-white font-semibold text-sm truncate max-w-[50%]">{course.title}</p>
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="hidden sm:flex items-center gap-1 text-amber-400">
                                    <Star size={13} fill="currentColor" />
                                    <span className="text-xs font-semibold">4.9</span>
                                </div>
                                {isEnrolled ? (
                                    <Link href={`/courses/${id}/video/0`}>
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white h-8 text-xs font-semibold flex items-center gap-1.5">
                                            <PlayCircle size={14} /> Continue
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button onClick={handleBuyClick} size="sm" className={`h-8 text-xs font-semibold ${course.isFree ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}>
                                        {course.isFree ? "Enroll Free" : `Buy ₹${displayPrice}`}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO SECTION ── */}
            <div ref={heroRef} className="relative pt-20 pb-10 sm:pt-24 overflow-hidden">
                {/* Gradient backdrop */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#060B1A] to-[#020617] pointer-events-none" />
                <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-blue-600/6 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                        <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/courses" className="hover:text-gray-400 transition-colors">Courses</Link>
                        <span>/</span>
                        <span className="text-gray-400 truncate max-w-[200px]">{course.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                        {/* LEFT */}
                        <div className="lg:col-span-3 space-y-5">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {course.isPopular && (
                                    <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-semibold tracking-wide">🔥 Bestseller</span>
                                )}
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                                    {course.category || "Skill Path"}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium">
                                    {course.level || "Beginner"}
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl font-bold text-white tracking-tight leading-[1.2]">
                                {course.title}
                            </h1>

                            <p className="text-gray-300 text-[15px] leading-relaxed max-w-2xl">
                                {course.description}
                            </p>

                            {/* Rating row */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-amber-400 font-bold text-xs">4.9</span>
                                    <span className="text-gray-500 text-xs">(2.4k ratings)</span>
                                </div>
                                <span className="text-gray-600">·</span>
                                <span className="text-gray-400 text-xs">{course.studentsCount || "0"} students</span>
                                <span className="text-gray-600">·</span>
                                <span className="text-gray-400 text-xs">Updated {course.lastUpdatedDate || safeDate(course.createdAt)}</span>
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-1">
                                <span className="flex items-center gap-1.5"><Globe size={13} className="text-emerald-400" />{course.language || "English / Hindi"}</span>
                                <span className="flex items-center gap-1.5"><Clock size={13} className="text-orange-400" />{course.duration || "Self-Paced"}</span>
                                <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-blue-400" />{course.modules?.length || 0} modules · {totalVideos} videos</span>
                                <span className="flex items-center gap-1.5"><Award size={13} className="text-amber-400" />Certificate included</span>
                            </div>

                            {/* Curriculum PDF CTA */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={handleDownloadCurriculumPdf}
                                    variant="outline"
                                    className="bg-white/5 hover:bg-blue-600/20 border-white/15 hover:border-blue-500/40 text-white hover:text-blue-200 text-xs font-semibold h-9 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                                >
                                    <Download size={14} className="text-blue-400" />
                                    <span>Curriculum PDF</span>
                                    {curriculumPdf && (
                                        <span className="text-[10px] text-gray-400 font-normal">
                                            ({curriculumPdf.fileSize ? `${(curriculumPdf.fileSize / (1024 * 1024)).toFixed(1)} MB` : "PDF"})
                                        </span>
                                    )}
                                </Button>

                                {(user?.role === "admin" || user?.role === "superadmin" || user?.role === "teacher") && (
                                    <Link
                                        href={(user.role === "admin" || user.role === "superadmin") ? `/admin/courses/${course.slug || course._id || id}/edit` : `/teacher/courses/${course.slug || course._id || id}/edit`}
                                        className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4"
                                    >
                                        + Manage / Upload PDF
                                    </Link>
                                )}
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-3 pt-1">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">V</div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Mentored by</p>
                                    <p className="text-sm text-white font-semibold">Vijay Kumar <span className="text-gray-400 font-normal">(IIT Mandi Alumnus)</span> & Webory Team</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Thumbnail */}
                        <div className="lg:col-span-2 lg:sticky lg:top-20">
                            <div
                                className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group cursor-pointer bg-slate-900"
                                onClick={() => { if (course.promoVideoUrl) setShowPromo(true); }}
                            >
                                {course.thumbnail && (
                                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                                )}
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <Play fill="black" size={24} className="ml-1 text-black" />
                                    </div>
                                </div>
                                {course.promoVideoUrl && (
                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                                        <span className="px-3 py-1 bg-black/70 backdrop-blur rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                                            <Zap size={11} className="text-yellow-400" />
                                            Watch free preview
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Mobile CTA (shown below thumb on mobile, sidebar on desktop) */}
                            <div className="lg:hidden mt-4 p-4 rounded-xl border border-white/10 bg-[#0B0F19]/80">
                                {isEnrolled ? (
                                    <div className="space-y-2.5">
                                        <Button onClick={handleBuyClick} className="w-full h-11 font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white">
                                            Continue Learning
                                        </Button>
                                        {certificateData?.isEligible && (
                                            <Link href={`/courses/${id}/certificate`} className="block w-full">
                                                <Button variant="outline" className="w-full h-10 border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg">
                                                    View Certificate
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            type="button"
                                            onClick={handleDownloadCurriculumPdf}
                                            variant="outline"
                                            className="w-full h-10 border-white/12 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <Download size={13} className="text-blue-400" />
                                            <span>Curriculum PDF</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-3xl font-bold text-white">
                                                {course.isFree ? "Free" : `₹${displayPrice}`}
                                            </span>
                                            {course.discountPercentage > 0 && course.originalPrice > 0 && !course.isFree && (
                                                <>
                                                    <span className="text-gray-500 line-through text-base">₹{course.originalPrice}</span>
                                                    <span className="text-xs text-emerald-400 font-semibold">{course.discountPercentage}% off</span>
                                                </>
                                            )}
                                        </div>
                                        <Button onClick={handleBuyClick} className={`w-full h-11 font-bold text-sm ${course.isFree ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}>
                                            {course.isFree ? "Enroll Now — Free" : "Buy Now"}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleDownloadCurriculumPdf}
                                            variant="outline"
                                            className="w-full mt-2 h-10 border-white/12 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <Download size={13} className="text-blue-400" />
                                            <span>Curriculum PDF</span>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TAB NAVIGATION ── */}
            <div className="sticky top-0 z-30 border-b border-white/8 bg-[#020617]/95 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
                        {([
                            { key: "overview", label: "Overview" },
                            { key: "curriculum", label: `Curriculum (${course.modules?.length || 0})` },
                            ...(isEnrolled ? [{ key: "resources", label: "Resources" }] : []),
                        ] as { key: "overview" | "curriculum" | "resources"; label: string }[]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                                    ? "border-blue-400 text-blue-400"
                                    : "border-transparent text-gray-400 hover:text-gray-200"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MAIN BODY ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* ── LEFT CONTENT ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Live Class Alert */}
                        {isEnrolled && activeLiveSession && (
                            <button
                                onClick={() => window.location.href = `/live/${activeLiveSession.roomId}`}
                                className="w-full flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-5 rounded-xl transition-colors shadow-lg shadow-emerald-600/25"
                            >
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <Video size={18} />
                                <span>Live Class is happening now — Join</span>
                                <ArrowRight size={16} className="ml-auto" />
                            </button>
                        )}

                        {/* ── OVERVIEW TAB ── */}
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {/* What you'll learn */}
                                {course.curriculum && course.curriculum.length > 0 && (
                                    <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                        <h2 className="text-lg font-bold text-white mb-5">What You'll Learn</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {course.curriculum.map((topic: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2.5">
                                                    <CheckCircle size={15} className="text-blue-400 shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-300 leading-snug">{topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Key Benefits */}
                                {course.benefits && course.benefits.length > 0 && (
                                    <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-6">
                                        <h2 className="text-lg font-bold text-white mb-5">Key Benefits</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {course.benefits.map((benefit: string, i: number) => (
                                                <div key={i} className="flex items-start gap-2.5">
                                                    <CheckCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-300 leading-snug">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Syllabus Roadmap */}
                                {course.syllabus && (
                                    <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.04] p-6">
                                        <h2 className="text-lg font-bold text-white mb-1">Syllabus Roadmap</h2>
                                        <p className="text-xs text-gray-500 mb-5">Complete step-by-step learning path</p>
                                        <div className="max-h-[480px] overflow-y-auto pr-1">
                                            <SyllabusRenderer content={course.syllabus} />
                                        </div>
                                    </div>
                                )}

                                {/* Certificate */}
                                {(course.certificateImage || isEnrolled) && (
                                    <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                        <h2 className="text-lg font-bold text-white mb-5">Earn Your Certificate</h2>
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="w-full md:w-[45%] rounded-xl overflow-hidden border border-white/10 shadow-xl shrink-0 bg-slate-900">
                                                <img 
                                                    src={course.certificateImage || "/assets/certificate-clean-format.png"} 
                                                    alt="Certificate" 
                                                    className="w-full h-auto object-cover" 
                                                />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <h3 className="text-base font-bold text-blue-400">Industry Recognized Certificate</h3>
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    Complete this course to receive a verified Webory Skills certificate — shareable on LinkedIn and your resume.
                                                </p>
                                                <ul className="space-y-2.5">
                                                    {["Shareable on LinkedIn & Resume", "Downloadable High-Res PDF", "Unique Verification ID", "QR Code Verified"].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                                                            <CheckCircle size={14} className="text-blue-400 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {isEnrolled && certificateData?.isEligible && (
                                                    <div className="pt-2">
                                                        <Link href={`/courses/${id}/certificate`}>
                                                            <Button className="h-10 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs">
                                                                View Certificate
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Live Classes in overview */}
                                {liveClasses.length > 0 && (
                                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-6">
                                        <div className="flex items-center gap-2.5 mb-5">
                                            <Video size={17} className="text-purple-400" />
                                            <h2 className="text-lg font-bold text-white">Scheduled Live Classes</h2>
                                        </div>
                                        <div className="space-y-3">
                                            {liveClasses.map((lc) => (
                                                <div key={lc._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${new Date(lc.date) > new Date() ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                                                        <div className="min-w-0">
                                                            <p className="text-sm text-white font-medium truncate">{lc.title}</p>
                                                            <p className="text-xs text-gray-500">{safeDate(lc.date)} · {new Date(lc.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                    </div>
                                                    {isEnrolled ? (
                                                        <div className="flex gap-2 shrink-0 ml-3">
                                                            <a href={lc.meetingUrl} target="_blank" rel="noopener noreferrer">
                                                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-7 text-xs px-3">Join</Button>
                                                            </a>
                                                            {lc.recordingUrl && (
                                                                <a href={lc.recordingUrl} target="_blank" rel="noopener noreferrer">
                                                                    <Button size="sm" variant="outline" className="border-white/15 text-white hover:bg-white/10 h-7 text-xs px-3">Recording</Button>
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-gray-600 text-xs ml-3 shrink-0">
                                                            <Lock size={12} /> Enroll to join
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Requirements & Prerequisites */}
                                <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                    <h2 className="text-lg font-bold text-white mb-4">Requirements & Prerequisites</h2>
                                    <ul className="space-y-2.5 text-sm text-gray-300">
                                        <li className="flex items-start gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                            <span>A laptop or computer (Windows, macOS, or Linux) with an active internet connection.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                            <span>A modern web browser (Chrome, Firefox, Edge, or Brave) and a code editor like VS Code installed.</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                            <span>Zero prior coding or design experience required — every concept is taught from absolute ground zero.</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Instructor & Mentorship */}
                                <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                    <h2 className="text-lg font-bold text-white mb-5">Instructor & Mentorship</h2>
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg shadow-blue-600/20">
                                            V
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <h3 className="text-base font-bold text-white">Vijay Kumar</h3>
                                                <p className="text-xs text-blue-400 font-medium">IIT Mandi Alumnus · Software Engineer & Tech Educator</p>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                Vijay Kumar and the Webory engineering team specialize in translating complex computer science paradigms into intuitive, hands-on industrial projects. Under IIT Mandi faculty mentorship, Webory curriculum is built to prepare students for real high-impact tech careers.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Frequently Asked Questions */}
                                <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                    <h2 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h2>
                                    <div className="divide-y divide-white/5">
                                        {FAQS.map((faq, idx) => (
                                            <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                                    className="w-full flex items-center justify-between text-left gap-4 group"
                                                >
                                                    <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                        {faq.q}
                                                    </span>
                                                    {openFaq === idx ? (
                                                        <ChevronUp size={16} className="text-gray-400 shrink-0" />
                                                    ) : (
                                                        <ChevronDown size={16} className="text-gray-500 shrink-0 group-hover:text-white" />
                                                    )}
                                                </button>
                                                {openFaq === idx && (
                                                    <p className="text-xs sm:text-sm text-gray-400 mt-2.5 leading-relaxed pr-6">
                                                        {faq.a}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── CURRICULUM TAB ── */}
                        {activeTab === "curriculum" && (
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/8">
                                    <p className="text-sm text-gray-300 font-medium">{course.modules?.length} modules · {totalVideos} videos</p>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setExpandedModules(Object.fromEntries(course.modules.map((_: any, i: number) => [i, true])))} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                            Expand all
                                        </button>
                                        <Button
                                            type="button"
                                            onClick={handleDownloadCurriculumPdf}
                                            variant="outline"
                                            className="h-8 px-3 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                                        >
                                            <Download size={13} className="text-blue-400" />
                                            <span>Curriculum PDF</span>
                                        </Button>
                                    </div>
                                </div>

                                {course.modules && course.modules.length > 0 ? (
                                    course.modules
                                        .sort((a: any, b: any) => a.order - b.order)
                                        .map((module: any, moduleIndex: number) => {
                                            const startIndex = course.modules
                                                .slice(0, moduleIndex)
                                                .reduce((acc: number, m: any) => acc + (m.videos?.length || 0), 0);
                                            const isUnlocked = isEnrolled || moduleIndex === 0;

                                            return (
                                                <div key={moduleIndex} className="rounded-xl border border-white/8 overflow-hidden">
                                                    {/* Module Header */}
                                                    <button
                                                        onClick={() => toggleModule(moduleIndex)}
                                                        className="w-full flex items-center gap-4 p-4 bg-[#0C1020] hover:bg-[#0F1428] transition-colors text-left"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                                                            {moduleIndex + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-semibold text-white">{module.title}</p>
                                                                {!isEnrolled && moduleIndex === 0 && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">FREE</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {module.videos?.length || 0} lesson{(module.videos?.length || 0) !== 1 ? 's' : ''}
                                                                {module.description ? ` · ${module.description}` : ''}
                                                            </p>
                                                        </div>
                                                        {expandedModules[moduleIndex]
                                                            ? <ChevronUp size={16} className="text-gray-500 shrink-0" />
                                                            : <ChevronDown size={16} className="text-gray-500 shrink-0" />
                                                        }
                                                    </button>

                                                    {/* Module Videos */}
                                                    {expandedModules[moduleIndex] && (
                                                        <div className="divide-y divide-white/[0.04] bg-[#080B17]">
                                                            {(module.videos || []).map((video: any, videoIndex: number) => {
                                                                const globalIndex = startIndex + videoIndex;
                                                                return (
                                                                    <div key={videoIndex} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.025] transition-colors group">
                                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                            <PlayCircle size={15} className={`shrink-0 ${isUnlocked ? "text-blue-400" : "text-gray-600"}`} />
                                                                            <div className="min-w-0">
                                                                                <p className="text-sm text-gray-200 truncate group-hover:text-white transition-colors">{video.title}</p>
                                                                                {video.duration && <p className="text-xs text-gray-600">{video.duration}</p>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3 shrink-0">
                                                                            {isUnlocked ? (
                                                                                user ? (
                                                                                    <Link href={`/courses/${id}/video/${globalIndex}`}>
                                                                                        <span className={`text-xs font-medium hover:underline ${moduleIndex === 0 && !isEnrolled ? 'text-emerald-400' : 'text-blue-400'}`}>
                                                                                            {moduleIndex === 0 && !isEnrolled ? 'Preview' : 'Play'}
                                                                                        </span>
                                                                                    </Link>
                                                                                ) : (
                                                                                    <button onClick={() => router.push(`/login?redirect=/courses/${id}`)} className="text-xs text-emerald-400 font-medium hover:underline">
                                                                                        Watch
                                                                                    </button>
                                                                                )
                                                                            ) : (
                                                                                <Lock size={13} className="text-gray-600" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* Module-specific PDFs */}
                                                            {(isEnrolled || (user && moduleIndex === 0)) && pdfs.some(p => p.afterModule === moduleIndex + 1) && (
                                                                <div className="px-4 py-2 bg-blue-500/[0.03] border-t border-blue-500/10">
                                                                    {pdfs.filter(p => p.afterModule === moduleIndex + 1)
                                                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                                        .map(pdf => (
                                                                            <div key={pdf._id} className="flex items-center justify-between py-2.5">
                                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                                    <FileText size={14} className="text-blue-400 shrink-0" />
                                                                                    <span className="text-sm text-gray-300 truncate">{pdf.title}</span>
                                                                                    <span className="text-xs text-gray-600 shrink-0">PDF</span>
                                                                                </div>
                                                                                <button onClick={() => { window.open(`/api/pdf-proxy?url=${encodeURIComponent(pdf.fileUrl)}`, '_blank'); trackPDFAccess(pdf._id); }} className="text-xs text-blue-400 hover:text-blue-300 ml-3 shrink-0">View</button>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                ) : (
                                    <div className="text-center py-12 text-gray-500 text-sm">Curriculum coming soon.</div>
                                )}
                            </div>
                        )}

                        {/* ── RESOURCES TAB (enrolled only) ── */}
                        {activeTab === "resources" && isEnrolled && (
                            <div className="space-y-6">
                                {/* Quizzes */}
                                {quizzes.filter(q => !q.afterModule || q.afterModule === 0).length > 0 && (
                                    <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-base font-bold text-white">Quizzes & Exams</h2>
                                            {!quizzesUnlocked && <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">Watch 25% to unlock</span>}
                                        </div>
                                        <div className="space-y-3">
                                            {quizzes.filter(q => !q.afterModule || q.afterModule === 0).map(quiz => (
                                                <div key={quiz._id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${quizzesUnlocked ? 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06]' : 'opacity-50 bg-white/[0.02] border-white/5'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <ClipboardList size={15} className={quizzesUnlocked ? "text-purple-400" : "text-gray-600"} />
                                                        <div>
                                                            <p className="text-sm text-white font-medium">{quiz.title}</p>
                                                            <p className="text-xs text-gray-500">{quiz.questions?.length} questions · {quiz.duration} min · Pass: {quiz.passingScore}%</p>
                                                        </div>
                                                    </div>
                                                    {quizzesUnlocked ? (
                                                        <Link href={`/courses/${id}/quiz/${quiz._id}`}>
                                                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8 text-xs px-3">Start</Button>
                                                        </Link>
                                                    ) : <Lock size={14} className="text-gray-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Assignments */}
                                {assignments.filter(a => !a.afterModule || a.afterModule === 0).length > 0 && (
                                    <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                        <h2 className="text-base font-bold text-white mb-4">Assignments</h2>
                                        <div className="space-y-3">
                                            {assignments.filter(a => !a.afterModule || a.afterModule === 0).map(assignment => (
                                                <div key={assignment._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <FileText size={15} className="text-emerald-400 shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm text-white font-medium truncate">{assignment.title}</p>
                                                            <p className="text-xs text-gray-500">Due: {safeDate(assignment.dueDate)} · {assignment.totalMarks} marks</p>
                                                        </div>
                                                    </div>
                                                    <Link href={`/courses/${id}/assignment/${assignment._id}`}>
                                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs px-3 ml-3 shrink-0">Submit</Button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PDF Resources */}
                                {pdfs.filter(p => !p.afterModule || p.afterModule === 0).length > 0 && (
                                    <div className="rounded-xl border border-white/10 bg-[#0B0F19]/50 p-6">
                                        <h2 className="text-base font-bold text-white mb-4">PDF Resources</h2>
                                        <div className="space-y-3">
                                            {pdfs.filter(p => !p.afterModule || p.afterModule === 0).map(pdf => (
                                                <div key={pdf._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <FileText size={15} className="text-blue-400 shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-sm text-white font-medium truncate">{pdf.title}</p>
                                                            <p className="text-xs text-gray-500">{(pdf.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <a href={pdf.fileUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackPDFAccess(pdf._id)} className="text-xs text-blue-400 hover:text-blue-300 ml-3 shrink-0 font-medium">View PDF</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {quizzes.length === 0 && assignments.length === 0 && pdfs.length === 0 && (
                                    <div className="text-center py-16 text-gray-500 text-sm">No resources yet. Check back soon.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── STICKY SIDEBAR ── */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-[4.5rem] rounded-2xl border border-white/10 bg-[#0C1020]/80 backdrop-blur shadow-2xl overflow-hidden">
                            {/* Card Top: Thumbnail mini */}
                            {course.thumbnail && (
                                <div className="relative aspect-video bg-slate-900">
                                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1020] via-transparent to-transparent" />
                                </div>
                            )}

                            <div className="p-5">
                                {isEnrolled ? (
                                    <>
                                        <Link href={`/courses/${id}/video/0`}>
                                            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 font-bold mb-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                                                <PlayCircle size={18} /> Continue Learning
                                            </Button>
                                        </Link>

                                        <div className="space-y-2.5 text-sm mb-4">
                                            {[
                                                ["Access", "Lifetime"],
                                                ["Certificate", "Included"],
                                                ["Support", "24 / 7"],
                                                ...(quizzes.length > 0 ? [["Quizzes", String(quizzes.length)]] : []),
                                                ...(assignments.length > 0 ? [["Assignments", String(assignments.length)]] : []),
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                                                    <span className="text-gray-400">{label}</span>
                                                    <span className="text-white font-medium">{value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleDownloadCurriculumPdf}
                                            variant="outline"
                                            className="w-full border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-white h-9 text-xs mb-2 flex items-center justify-center gap-2 font-medium transition-colors"
                                        >
                                            <Download size={13} className="text-blue-400" />
                                            <span>Curriculum PDF</span>
                                        </Button>

                                        <Button onClick={handleDownloadInvoice} variant="outline" className="w-full border-white/12 text-gray-400 hover:bg-white/[0.05] h-9 text-xs mb-4">
                                            📄 Download Invoice
                                        </Button>

                                        {/* Certificate Progress */}
                                        {certificateData && (
                                            <div className="mt-1 p-4 rounded-xl bg-white/[0.04] border border-white/8">
                                                <div className="flex items-center gap-2.5 mb-3">
                                                    {certificateData.isEligible
                                                        ? <Trophy size={16} className="text-amber-400" />
                                                        : <Lock size={16} className="text-gray-500" />
                                                    }
                                                    <div>
                                                        <p className="text-white text-sm font-semibold">Certificate</p>
                                                        <p className="text-xs text-gray-500">{certificateData.isEligible ? "Unlocked! 🎉" : "Complete to unlock"}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2.5 mb-3">
                                                    {[
                                                        { label: "Video Progress", value: certificateData.videoProgress, threshold: 100, color: certificateData.videoProgress >= 100 ? "bg-emerald-500" : "bg-blue-500" },
                                                        { label: "Grade (need 90%)", value: certificateData.overallScore, threshold: 90, color: certificateData.overallScore >= 90 ? "bg-emerald-500" : "bg-purple-500" },
                                                    ].map(({ label, value, threshold, color }) => (
                                                        <div key={label}>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-gray-500">{label}</span>
                                                                <span className={value >= threshold ? "text-emerald-400" : "text-gray-300"}>{Math.min(Math.round(value), 100)}%</span>
                                                            </div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {certificateData.isEligible ? (
                                                    <Link href={`/courses/${id}/certificate`}>
                                                        <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold h-8 text-xs">🏆 View Certificate</Button>
                                                    </Link>
                                                ) : (
                                                    <Button disabled className="w-full bg-white/5 text-gray-500 h-8 text-xs cursor-not-allowed">Locked</Button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Pricing */}
                                        <div className="mb-4">
                                            <div className="flex items-baseline gap-2.5 flex-wrap">
                                                <span className="text-3xl font-bold text-white">
                                                    {course.isFree ? "Free" : `₹${displayPrice}`}
                                                </span>
                                                {course.gstPercentage > 0 && !course.isFree && <span className="text-xs text-gray-500">+ GST</span>}
                                                {course.discountPercentage > 0 && course.originalPrice > 0 && !course.isFree && (
                                                    <>
                                                        <span className="text-gray-600 line-through text-lg">₹{course.originalPrice}</span>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">{course.discountPercentage}% off</span>
                                                    </>
                                                )}
                                            </div>
                                            {course.discountPercentage > 0 && (
                                                <p className="text-xs text-red-400 mt-1 font-medium">⏰ Limited time offer</p>
                                            )}
                                        </div>

                                        <Button onClick={handleBuyClick} className={`w-full h-12 text-[15px] font-bold mb-2.5 shadow-lg ${course.isFree ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'} text-white`}>
                                            {course.isFree ? "Enroll Now — Free" : "Buy Now"}
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={handleDownloadCurriculumPdf}
                                            variant="outline"
                                            className="w-full border-white/12 bg-white/5 hover:bg-blue-600/15 hover:border-blue-500/30 text-gray-200 hover:text-white h-10 text-xs font-semibold mb-3 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Download size={14} className="text-blue-400" />
                                            <span>Curriculum PDF</span>
                                        </Button>

                                        <p className="text-center text-xs text-gray-500 mb-5">30-Day Money-Back Guarantee</p>

                                        <div className="space-y-2.5 text-sm mb-5">
                                            {[
                                                ["Access", "Lifetime"],
                                                ["Certificate", "Included"],
                                                ["Language", course.language || "English/Hindi"],
                                                ["Support", "24 / 7"],
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                                                    <span className="text-gray-400">{label}</span>
                                                    <span className="text-white font-medium">{value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Trust badges */}
                                        <div className="grid grid-cols-3 gap-2 text-center py-3 border-t border-white/8">
                                            {[
                                                { icon: Shield, label: "Govt. Verified", color: "text-blue-400" },
                                                { icon: Trophy, label: "Certificate", color: "text-amber-400" },
                                                { icon: Zap, label: "Lifetime", color: "text-purple-400" },
                                            ].map(({ icon: Icon, label, color }) => (
                                                <div key={label} className="flex flex-col items-center gap-1.5">
                                                    <Icon size={16} className={color} />
                                                    <span className="text-[10px] text-gray-500 leading-tight">{label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE BOTTOM CTA ── */}
            {!isEnrolled && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#0A0D1A]/95 backdrop-blur-xl border-t border-white/8 flex items-center gap-3">
                    <div>
                        <span className="text-white font-bold text-lg">{course.isFree ? "Free" : `₹${displayPrice}`}</span>
                        {course.discountPercentage > 0 && !course.isFree && (
                            <span className="text-gray-500 line-through text-sm ml-2">₹{course.originalPrice}</span>
                        )}
                    </div>
                    <Button onClick={handleBuyClick} className={`flex-1 h-11 font-bold ${course.isFree ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}>
                        {course.isFree ? "Enroll Free" : "Buy Now"}
                    </Button>
                </div>
            )}
            {isEnrolled && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#0A0D1A]/95 backdrop-blur-xl border-t border-white/8">
                    {certificateData?.isEligible ? (
                        <div className="flex gap-2">
                            <Link href={`/courses/${course?.slug || id}/video/0`} className="flex-1">
                                <Button className="w-full h-11 font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2">
                                    <PlayCircle size={18} /> Continue Learning
                                </Button>
                            </Link>
                            <Link href={`/courses/${id}/certificate`} className="flex-1">
                                <Button variant="outline" className="w-full h-11 font-semibold text-sm border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center">
                                    View Certificate
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href={`/courses/${course?.slug || id}/video/0`}>
                            <Button className="w-full h-11 font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2">
                                <PlayCircle size={18} /> Continue Learning
                            </Button>
                        </Link>
                    )}
                </div>
            )}

            {/* Promo Video Modal */}
            <AnimatePresence>
                {showPromo && course.promoVideoUrl && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm p-4">
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                            <button onClick={() => setShowPromo(false)} className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors">
                                <X size={18} />
                            </button>
                            {course.promoVideoUrl?.includes('youtube.com') || course.promoVideoUrl?.includes('youtu.be') ? (
                                <iframe src={getEmbedUrl(course.promoVideoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            ) : (
                                <video src={course.promoVideoUrl} className="w-full h-full" controls autoPlay />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                courseTitle={course.title}
                price={displayPrice}
                originalPrice={course.originalPrice}
                discountPercentage={course.discountPercentage}
                gstPercentage={course.gstPercentage || 0}
                courseId={id as string}
                userId={user?._id || ""}
                userName={user ? `${user.firstName} ${user.lastName}` : ""}
                userEmail={user?.email || ""}
                mobileNumber={user?.phone}
            />

            {showInvoice && transactionData && (
                <Invoice {...transactionData} onClose={() => setShowInvoice(false)} />
            )}

            <Footer />
        </main>
    );
}
