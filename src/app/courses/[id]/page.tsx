"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const PaymentModal = dynamic(() => import("@/components/courses/payment-modal").then(mod => mod.PaymentModal), { ssr: false });
const Invoice = dynamic(() => import("@/components/courses/invoice").then(mod => mod.Invoice), { ssr: false });
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, BarChart, Users, Globe, PlayCircle, Lock, ClipboardList, FileText, Calendar, Video, ChevronDown, ChevronUp, Brain } from "lucide-react";
import Link from "next/link";

// Helper for safe date parsing on iOS/Safari
const safeDate = (date: any): string => {
    try {
        if (!date) return new Date().toLocaleDateString();
        const d = new Date(date);
        // Check if date is valid
        if (isNaN(d.getTime())) {
            // Try to parse if it's a specific string format or just return current/fallback
            return new Date().toLocaleDateString();
        }
        return d.toLocaleDateString();
    } catch (e) {
        return new Date().toLocaleDateString();
    }
};

export default function CourseDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState < any > (null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState < any > (null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [transactionData, setTransactionData] = useState < any > (null);
    const [quizzes, setQuizzes] = useState < any[] > ([]);
    const [assignments, setAssignments] = useState < any[] > ([]);
    const [liveClasses, setLiveClasses] = useState < any[] > ([]);
    const [certificateData, setCertificateData] = useState < any > (null);
    const [pdfs, setPdfs] = useState < any[] > ([]);
    const [enrollmentData, setEnrollmentData] = useState < any > (null);
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 0: true });
    const fetchingRef = useRef(false);

    const toggleModule = (index: number) => {
        setExpandedModules(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        // Check for buy param
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('buy') === 'true' && user && !isEnrolled) {
            setShowPayment(true);
            // Optional: remove param from URL clean up
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [user, isEnrolled]);

    useEffect(() => {
        const fetchData = async () => {
            if (fetchingRef.current) return;
            fetchingRef.current = true;
            
            try {
                const resCourse = await fetch(`/api/courses/${id}`);
                if (!resCourse.ok) throw new Error("Course not found");
                
                const data = await resCourse.json();
                setCourse(data.course);
                
                if (data.course.pdfResources) {
                    setPdfs(data.course.pdfResources.sort((a: any, b: any) => {
                        if (a.afterModule !== b.afterModule) return a.afterModule - b.afterModule;
                        return a.order - b.order;
                    }));
                }

                // Parallel fetch for secondary data
                const [resQuizzes, resAssignments, resLiveClasses, resAuth] = await Promise.all([
                    fetch(`/api/admin/courses/${id}/quizzes`).catch(() => null),
                    fetch(`/api/admin/courses/${id}/assignments`).catch(() => null),
                    fetch(`/api/courses/${id}/live-classes`).catch(() => null),
                    fetch("/api/auth/me").catch(() => null)
                ]);

                if (resQuizzes?.ok) {
                    const quizData = await resQuizzes.json();
                    setQuizzes(quizData.quizzes || []);
                }
                if (resAssignments?.ok) {
                    const assignmentData = await resAssignments.json();
                    setAssignments(assignmentData.assignments || []);
                }
                if (resLiveClasses?.ok) {
                    const liveClassData = await resLiveClasses.json();
                    setLiveClasses(liveClassData.liveClasses || []);
                }

                if (resAuth?.ok) {
                    const userData = await resAuth.json();
                    setUser(userData.user);

                    const resEnroll = await fetch("/api/user/enrollments");
                    if (resEnroll.ok) {
                        const enrollData = await resEnroll.json();
                        const currentEnrollment = enrollData.enrollments.find(
                            (e: any) => e.course?._id?.toString() === id
                        );
                        const enrolled = !!currentEnrollment;
                        setIsEnrolled(enrolled);
                        setEnrollmentData(currentEnrollment);

                        if (enrolled) {
                            const resCert = await fetch(`/api/courses/${id}/certificate-eligibility`);
                            if (resCert.ok) {
                                const certData = await resCert.json();
                                setCertificateData(certData);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
                fetchingRef.current = false;
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleBuyClick = () => {
        if (!user) {
            router.push("/login");
            return;
        }
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
                // Refresh certificate data
                const resCert = await fetch(`/api/courses/${id}/certificate-eligibility`);
                if (resCert.ok) {
                    const certData = await resCert.json();
                    setCertificateData(certData);
                }
            } else {
                console.error("Enrollment failed");
            }
        } catch (error) {
            console.error("Enrollment failed", error);
        }
    };

    const trackPDFAccess = async (pdfId: string, downloaded: boolean = false) => {
        try {
            await fetch(`/api/student/courses/${id}/pdfs/${pdfId}/access`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ downloaded }),
            });
        } catch (error) {
            console.error("Failed to track PDF access", error);
        }
    };

    const handleDownloadInvoice = () => {
        const enrollmentDate = enrollmentData?.enrolledAt 
            ? safeDate(enrollmentData.enrolledAt)
            : new Date().toLocaleDateString();
        
        // Use enrollment ID to generate consistent transaction ID
        const transactionId = enrollmentData?._id 
            ? `TXN${enrollmentData._id.toString().substring(0, 12)}`
            : `TXN${Date.now()}`;
        
        const invoiceData = {
            transactionId,
            courseTitle: course.title,
            amount: course.price,
            date: enrollmentDate,
            userEmail: user?.email || 'student@example.com',
        };
        setTransactionData(invoiceData);
        setShowInvoice(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                Loading course details...
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                Course not found.
            </div>
        );
    }

    const videoProgress = certificateData?.videoProgress || 0;
    const quizzesUnlocked = videoProgress >= 25;

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{course.title}</h1>
                        <p className="text-xl text-blue-400 font-medium mb-6">Build real-world web applications and become job-ready.</p>
                        <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">{course.description}</p>

                        <div className="flex flex-wrap gap-6 mb-12">
                            <div className="flex items-center text-gray-300">
                                <BarChart className="mr-2 text-blue-400" size={20} />
                                {course.level}
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Users className="mr-2 text-purple-400" size={20} />
                                {course.studentsCount} Students
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Globe className="mr-2 text-green-400" size={20} />
                                English
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Clock className="mr-2 text-orange-400" size={20} />
                                {course.duration}
                            </div>
                            <div className="flex items-center text-gray-300">
                                <Calendar className="mr-2 text-yellow-400" size={20} />
                                Last Updated: {safeDate(course.createdAt)}
                            </div>
                        </div>

                         {/* Who is this for? */}
                         <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Who Is This Course For?</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "College students looking for structured learning",
                                    "Beginners with basic computer knowledge",
                                    "Freshers aiming for their first tech job",
                                    "Career switchers wanting hands-on skills"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>


                        {course.benefits && course.benefits.length > 0 && (
                            <div className="glass-card p-8 rounded-2xl mb-12 border border-[#c5a059]/30 bg-[#c5a059]/5">
                                <h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.benefits.map((benefit: string, index: number) => (
                                        <div key={index} className="flex items-start text-gray-300">
                                            <div className="mr-3 text-[#c5a059] flex-shrink-0 mt-1">
                                                <CheckCircle size={18} />
                                            </div>
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificate Preview Section */}
                        {course.certificateImage && (
                            <div className="glass-card p-8 rounded-2xl mb-12 border border-[#c5a059]/30 bg-[#c5a059]/5">
                                <h2 className="text-2xl font-bold text-white mb-6">Earn Your Certificate</h2>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-[#c5a059]/30">
                                            <img
                                                src={course.certificateImage}
                                                alt="Course Certificate Sample"
                                                className="w-full h-auto object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                                <span className="bg-[#c5a059] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    Official Certification
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-xl font-bold text-[#c5a059]">Industry Recognized</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            Upon successful completion of this course, you will receive a verified certificate from Webory Skills.
                                            This certificate validates your expertise and can be shared on LinkedIn and your resume.
                                        </p>
                                        <ul className="space-y-2">
                                            <li className="flex items-center text-gray-300">
                                                <CheckCircle className="mr-2 text-[#c5a059]" size={16} />
                                                Shareable on LinkedIn
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <CheckCircle className="mr-2 text-[#c5a059]" size={16} />
                                                Downloadable High-Res PDF
                                            </li>
                                            <li className="flex items-center text-gray-300">
                                                <CheckCircle className="mr-2 text-[#c5a059]" size={16} />
                                                Unique Verification ID
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="glass-card p-8 rounded-2xl mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Skills You Will Learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.curriculum.map((topic: string, index: number) => (
                                    <div key={index} className="flex items-start text-gray-300">
                                        <CheckCircle className="mr-3 text-blue-500 flex-shrink-0 mt-1" size={18} />
                                        {topic}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects Section */}
                         <div className="glass-card p-8 rounded-2xl mb-12 border border-purple-500/20 bg-purple-500/5">
                            <h2 className="text-2xl font-bold text-white mb-6">Projects You Will Build</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Portfolio Website", desc: "Build a personal portfolio to showcase your skills." },
                                    { title: "Real-world CRUD App", desc: "Create a fully functional application with database integration." },
                                    { title: "Mini SaaS Project", desc: "Understand subscription models and user management." }
                                ].map((project, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="mr-4 mt-1 bg-purple-500/20 p-2 rounded-lg text-purple-400">
                                            <ClipboardList size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{project.title}</h4>
                                            <p className="text-gray-400 text-sm">{project.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Roadmap Explainer */}
                        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Brain size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white">AI Roadmap Integration</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                This course is delivered through a personalized AI-generated roadmap, ensuring you learn the right skills at the right time based on your goal and progress. No random videos, just a structured path to success.
                            </p>
                        </div>

                        {/* Career Outcomes */}
                        <div className="mb-12">
                             <h2 className="text-2xl font-bold text-white mb-6">Career Outcomes</h2>
                             <p className="text-gray-400 mb-4">After completing this course, you can apply for:</p>
                             <div className="flex flex-wrap gap-3">
                                {["Junior Web Developer", "Frontend Developer", "Freelance Projects", "Internship Opportunities"].map((role, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium">
                                        {role}
                                    </span>
                                ))}
                             </div>
                        </div>

                        {/* Live Classes Section */}
                        {liveClasses.length > 0 && (
                            <div className="glass-card p-8 rounded-2xl mb-12 border border-purple-500/30 bg-purple-500/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <Video size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Live Classes</h2>
                                </div>
                                <div className="space-y-4">
                                    {liveClasses.map((liveClass) => (
                                        <div key={liveClass._id} className="p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full border ${
                                                            new Date(liveClass.date) > new Date()
                                                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                        }`}>
                                                            {new Date(liveClass.date) > new Date() ? 'Upcoming' : 'Past'}
                                                        </span>
                                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {safeDate(liveClass.date)}
                                                        </span>
                                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {new Date(liveClass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-white font-bold text-lg">{liveClass.title}</h3>
                                                    <p className="text-gray-400 text-sm line-clamp-1">{liveClass.description}</p>
                                                </div>
                                                
                                                {isEnrolled ? (
                                                    <div className="flex gap-2">
                                                        <a 
                                                            href={liveClass.meetingUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                                                Join
                                                            </Button>
                                                        </a>
                                                        {liveClass.recordingUrl && (
                                                            <a 
                                                                href={liveClass.recordingUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                                                    Recording
                                                                </Button>
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-500 bg-white/5 px-3 py-2 rounded-lg">
                                                        <Lock size={16} />
                                                        <span className="text-sm">Enroll to join</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="glass-card p-8 rounded-2xl mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                            {course.modules && course.modules.length > 0 && course.modules.some((m: any) => m.videos && m.videos.length > 0) ? (
                                <div className="space-y-4">
                                    {course.modules
                                        .sort((a: any, b: any) => a.order - b.order)
                                        .map((module: any, moduleIndex: number) => {
                                            // Calculate starting video index for this module
                                            const startIndex = course.modules
                                                .slice(0, moduleIndex)
                                                .reduce((acc: number, m: any) => acc + (m.videos?.length || 0), 0);
                                            
                                            // Unlocked if enrolled OR it's the first module (Free Trial)
                                            // For guests, we will visually unlock it but redirect to login on click
                                            const isModuleContentUnlocked = isEnrolled || moduleIndex === 0;

                                            return (
                                                <div key={moduleIndex} className="border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
                                                    <div 
                                                        className="bg-white/5 p-4 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors flex items-center justify-between"
                                                        onClick={() => toggleModule(moduleIndex)}
                                                    >
                                                        <div>
                                                            <h3 className="text-white font-bold text-lg">
                                                                Module {moduleIndex + 1}: {module.title}
                                                            </h3>
                                                            {module.description && (
                                                                <p className="text-gray-400 text-sm mt-1">{module.description}</p>
                                                            )}
                                                            <p className="text-gray-500 text-xs mt-2 flex items-center">
                                                                {module.videos?.length || 0} video{(module.videos?.length || 0) !== 1 ? 's' : ''}
                                                                {!isEnrolled && moduleIndex === 0 && (
                                                                    <span className="ml-2 bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                                                        Free Trial
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        {expandedModules[moduleIndex] ? (
                                                            <ChevronUp className="text-gray-400" size={20} />
                                                        ) : (
                                                            <ChevronDown className="text-gray-400" size={20} />
                                                        )}
                                                    </div>
                                                    
                                                    {expandedModules[moduleIndex] && (
                                                        <div className="space-y-2 p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {(module.videos || []).map((video: any, videoIndex: number) => {
                                                            const globalIndex = startIndex + videoIndex;
                                                            return (
                                                                <div key={videoIndex} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                                    <div className="flex items-center text-gray-300 flex-1">
                                                                        <PlayCircle className={`mr-3 ${isModuleContentUnlocked ? "text-blue-400" : "text-gray-500"}`} size={20} />
                                                                        <div>
                                                                            <span className="text-white font-medium">{video.title}</span>
                                                                            <p className="text-xs text-gray-500">{video.duration}</p>
                                                                        </div>
                                                                    </div>
                                                                    {isModuleContentUnlocked ? (
                                                                         user ? (
                                                                            <Link href={`/courses/${id}/video/${globalIndex}`}>
                                                                                <Button 
                                                                                    size="sm" 
                                                                                    variant={moduleIndex === 0 && !isEnrolled ? "outline" : "ghost"} 
                                                                                    className={moduleIndex === 0 && !isEnrolled 
                                                                                        ? "text-green-400 border-green-500/30 hover:bg-green-500/10 hover:text-green-300" 
                                                                                        : "text-blue-400 hover:text-blue-300"
                                                                                    }
                                                                                >
                                                                                    {moduleIndex === 0 && !isEnrolled ? "Free Preview" : "Play"}
                                                                                </Button>
                                                                            </Link>
                                                                        ) : (
                                                                            <Button 
                                                                                size="sm" 
                                                                                variant="outline"
                                                                                className="text-green-400 border-green-500/30 hover:bg-green-500/10 hover:text-green-300"
                                                                                onClick={() => router.push(`/login?redirect=/courses/${id}`)}
                                                                            >
                                                                                Watch Demo
                                                                            </Button>
                                                                        )
                                                                    ) : (
                                                                        <Lock size={16} className="text-gray-600" />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                        
                                                        {/* Module specific PDFs */}
                                                        {(isEnrolled || (user && moduleIndex === 0)) && pdfs.some(p => p.afterModule === moduleIndex + 1) && (
                                                            <div className="my-2 space-y-2 border-t border-white/5 pt-2">
                                                                {pdfs.filter(p => p.afterModule === moduleIndex + 1)
                                                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                                    .map((pdf) => (
                                                                        <div key={pdf._id} className="flex items-center justify-between p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 hover:bg-blue-500/10 transition-colors ml-4">
                                                                            <div className="flex items-center text-gray-300 flex-1">
                                                                                <FileText className="mr-3 text-blue-400" size={18} />
                                                                                <div>
                                                                                    <span className="text-white font-medium text-sm">{pdf.title}</span>
                                                                                    <p className="text-xs text-gray-500">PDF Resource</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdf.fileUrl)}`;
                                                                                        window.open(proxyUrl, '_blank');
                                                                                        trackPDFAccess(pdf._id, false);
                                                                                    }}
                                                                                    className="text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20"
                                                                                >
                                                                                    View PDF
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>

                                                        )}

                                                        {/* Module specific Quizzes */}
                                                        {(isEnrolled || (user && moduleIndex === 0)) && quizzes.some(q => q.afterModule === moduleIndex + 1) && (
                                                            <div className="my-2 space-y-2 border-t border-white/5 pt-2">
                                                                {quizzes.filter(q => q.afterModule === moduleIndex + 1)
                                                                    .map((quiz) => (
                                                                        <div key={quiz._id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ml-4 ${quizzesUnlocked
                                                                            ? 'bg-purple-500/5 border-purple-500/10 hover:bg-purple-500/10'
                                                                            : 'bg-white/5 border-white/5 opacity-50'
                                                                            }`}>
                                                                            <div className="flex items-center text-gray-300 flex-1">
                                                                                <ClipboardList className={`mr-3 ${quizzesUnlocked ? "text-purple-400" : "text-gray-600"}`} size={18} />
                                                                                <div>
                                                                                    <span className="text-white font-medium text-sm">{quiz.title}</span>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {quiz.type === 'exam' ? 'Exam' : quiz.type === 'test' ? 'Test' : 'Quiz'} • {quiz.questions.length} Qs • {quiz.duration} min
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                {quizzesUnlocked ? (
                                                                                    <Link href={`/courses/${id}/quiz/${quiz._id}`}>
                                                                                        <button
                                                                                            className="text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-3 py-1.5 rounded-lg transition-colors border border-purple-500/20"
                                                                                        >
                                                                                            Start
                                                                                        </button>
                                                                                    </Link>
                                                                                ) : (
                                                                                     <Lock size={14} className="text-gray-600" />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}

                                                        {/* Module specific Assignments */}
                                                        {(isEnrolled || (user && moduleIndex === 0)) && assignments.some(a => a.afterModule === moduleIndex + 1) && (
                                                            <div className="my-2 space-y-2 border-t border-white/5 pt-2">
                                                                {assignments.filter(a => a.afterModule === moduleIndex + 1)
                                                                    .map((assignment) => (
                                                                        <div key={assignment._id} className="flex items-center justify-between p-3 rounded-xl border border-green-500/10 bg-green-500/5 hover:bg-green-500/10 transition-all ml-4">
                                                                            <div className="flex items-center text-gray-300 flex-1">
                                                                                <FileText className="mr-3 text-green-400" size={18} />
                                                                                <div>
                                                                                    <span className="text-white font-medium text-sm">{assignment.title}</span>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        Assignment • Due: {safeDate(assignment.dueDate)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <Link href={`/courses/${id}/assignment/${assignment._id}`}>
                                                                                    <button
                                                                                        className="text-xs bg-green-500/20 text-green-300 hover:bg-green-500/30 px-3 py-1.5 rounded-lg transition-colors border border-green-500/20"
                                                                                    >
                                                                                        Submit
                                                                                    </button>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            ) : course.videos && course.videos.length > 0 ? (
                                <div className="space-y-4">
                                    {course.videos.map((video: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center text-gray-300 flex-1">
                                                <PlayCircle className="mr-3 text-gray-500" size={20} />
                                                <div>
                                                    <span className="text-white font-medium">{video.title}</span>
                                                    <p className="text-xs text-gray-500">{video.duration}</p>
                                                </div>
                                            </div>
                                            {isEnrolled ? (
                                                <Link href={`/courses/${id}/video/${index}`}>
                                                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                                        Play
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Lock size={16} className="text-gray-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    <p>No videos available yet.</p>
                                </div>
                            )}
                        </div>

                        {isEnrolled && pdfs.some(p => !p.afterModule || p.afterModule === 0) && (
                            <div className="glass-card p-8 rounded-2xl mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6">Course Resources</h2>
                                <div className="space-y-4">
                                    {pdfs.filter(p => !p.afterModule || p.afterModule === 0).map((pdf) => (
                                        <div key={pdf._id} className="p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-red-500/20 p-2 rounded-lg">
                                                        <FileText className="text-red-400" size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-medium">{pdf.title}</h3>
                                                        <p className="text-gray-400 text-sm">
                                                            {pdf.description || "PDF Resource"} • {(pdf.fileSize / (1024 * 1024)).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdf.fileUrl)}`;
                                                            window.open(proxyUrl, '_blank');
                                                            trackPDFAccess(pdf._id, false);
                                                        }}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-9 px-3"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEnrolled && quizzes.some(q => !q.afterModule || q.afterModule === 0) && (
                            <div className="glass-card p-8 rounded-2xl mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Quizzes & Tests</h2>
                                    {!quizzesUnlocked && (
                                        <span className="text-sm text-yellow-400">
                                            Watch 25% videos to unlock
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {quizzes.filter(q => !q.afterModule || q.afterModule === 0).map((quiz) => (
                                        <div key={quiz._id} className={`p-4 rounded-xl border transition-all ${quizzesUnlocked
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                            : 'bg-white/5 border-white/5 opacity-50'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <ClipboardList className={quizzesUnlocked ? "text-purple-400" : "text-gray-600"} size={20} />
                                                    <div>
                                                        <h3 className="text-white font-medium">{quiz.title}</h3>
                                                        <p className="text-gray-400 text-sm">
                                                            {quiz.questions.length} questions • {quiz.duration} min • Pass: {quiz.passingScore}%
                                                        </p>
                                                    </div>
                                                </div>
                                                {quizzesUnlocked ? (
                                                    <Link href={`/courses/${id}/quiz/${quiz._id}`}>
                                                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                                                            Start Quiz
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Lock size={16} className="text-gray-600" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEnrolled && assignments.some(a => !a.afterModule || a.afterModule === 0) && (
                            <div className="glass-card p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6">Assignments</h2>
                                <div className="space-y-4">
                                    {assignments.filter(a => !a.afterModule || a.afterModule === 0).map((assignment) => (
                                        <div key={assignment._id} className="p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="text-green-400" size={20} />
                                                    <div>
                                                        <h3 className="text-white font-medium">{assignment.title}</h3>
                                                        <p className="text-gray-400 text-sm">
                                                            Due: {safeDate(assignment.dueDate)} • {assignment.totalMarks} marks
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link href={`/courses/${id}/assignment/${assignment._id}`}>
                                                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-teal-600">
                                                        Submit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-card p-8 rounded-2xl sticky top-32 border-t-4 border-t-blue-500">
                            {isEnrolled ? (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-white mb-4">Course Access</h3>
                                        <div className="space-y-3 text-gray-300">
                                            <div className="flex items-center justify-between">
                                                <span>Access</span>
                                                <span className="text-white">Lifetime</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Certificate</span>
                                                <span className="text-white">Yes</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Support</span>
                                                <span className="text-white">24/7</span>
                                            </div>
                                            {quizzes.length > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span>Quizzes</span>
                                                    <span className="text-white">{quizzes.length}</span>
                                                </div>
                                            )}
                                            {assignments.length > 0 && (
                                                <div className="flex items-center justify-between">
                                                    <span>Assignments</span>
                                                    <span className="text-white">{assignments.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleDownloadInvoice}
                                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white h-12 font-semibold mb-6"
                                    >
                                        📄 Download Invoice
                                    </Button>

                                    {/* Certificate Section */}
                                    {certificateData && (
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center gap-3 mb-4">
                                                {certificateData.isEligible ? (
                                                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                                        <CheckCircle size={24} />
                                                    </div>
                                                ) : (
                                                    <div className="p-2 bg-gray-700/50 rounded-lg text-gray-400">
                                                        <Lock size={24} />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-white font-bold">Course Certificate</h3>
                                                    <p className="text-xs text-gray-400">
                                                        {certificateData.isEligible ? "Unlocked & Ready" : "Complete requirements to unlock"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div>
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span>Video Progress</span>
                                                        <span className={certificateData.videoProgress >= 100 ? "text-green-400" : ""}>
                                                            {Math.min(Math.round(certificateData.videoProgress), 100)}% / 100%
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${certificateData.videoProgress >= 100 ? "bg-green-500" : "bg-blue-500"}`}
                                                            style={{ width: `${Math.min(certificateData.videoProgress, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span>Overall Grade (Required: 90%)</span>
                                                        <span className={certificateData.overallScore >= 90 ? "text-green-400 font-semibold" : "text-white font-semibold"}>
                                                            {certificateData.overallScore}%
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${certificateData.overallScore >= 90 ? "bg-green-500" : "bg-purple-500"}`}
                                                            style={{ width: `${Math.min(certificateData.overallScore, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {certificateData.isEligible ? (
                                                <Link href={`/courses/${id}/certificate`}>
                                                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold">
                                                        🏆 View Certificate
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed">
                                                    Locked
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <span className="text-gray-400 text-lg mb-3 block">Price</span>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {/* Discounted Price */}
                                            <span className="text-5xl font-bold text-white">
                                                ₹{course.discountPercentage > 0 && course.originalPrice > 0
                                                    ? Math.round(course.originalPrice * (1 - course.discountPercentage / 100))
                                                    : course.price}
                                            </span>

                                            {/* Original Price (if discount exists) */}
                                            {course.discountPercentage > 0 && course.originalPrice > 0 && (
                                                <>
                                                    <span className="text-gray-500 line-through text-2xl">
                                                        ₹{course.originalPrice}
                                                    </span>
                                                    <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-base font-bold border border-green-500/30">
                                                        {course.discountPercentage}% off
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleBuyClick}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 text-lg font-bold mb-4 shadow-lg shadow-blue-500/25"
                                    >
                                        Buy Now
                                    </Button>

                                    <p className="text-center text-gray-500 text-sm mb-6">30-Day Money-Back Guarantee</p>

                                    <div className="space-y-4 text-gray-300">
                                        <div className="flex items-center justify-between">
                                            <span>Access</span>
                                            <span className="text-white">Lifetime</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Certificate</span>
                                            <span className="text-white">Yes</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Support</span>
                                            <span className="text-white">24/7</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                courseTitle={course.title}
                price={course.discountPercentage > 0 && course.originalPrice > 0
                    ? Math.round(course.originalPrice * (1 - course.discountPercentage / 100))
                    : course.price}
                originalPrice={course.originalPrice}
                discountPercentage={course.discountPercentage}
                courseId={id as string}
                userId={user?._id || ""}
                userName={user ? `${user.firstName} ${user.lastName}` : ""}
                userEmail={user?.email || ""}
                mobileNumber={user?.mobileNumber}
            />

            {showInvoice && transactionData && (
                <Invoice
                    {...transactionData}
                    onClose={() => setShowInvoice(false)}
                />
            )}

            <Footer />
        </main>
    );
}
