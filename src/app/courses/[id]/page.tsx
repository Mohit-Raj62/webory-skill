"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const PaymentModal = dynamic(() => import("@/components/courses/payment-modal").then(mod => mod.PaymentModal), { ssr: false });
const Invoice = dynamic(() => import("@/components/courses/invoice").then(mod => mod.Invoice), { ssr: false });
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, BarChart, Users, Globe, PlayCircle, Lock, ClipboardList, FileText, Calendar, Video } from "lucide-react";
import Link from "next/link";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCourse = await fetch(`/api/courses/${id}`);
                if (resCourse.ok) {
                    const data = await resCourse.json();
                    setCourse(data.course);
                    // Set PDFs from course data if available (populated) or fetch separately if needed
                    // Assuming course.pdfResources is available in the course object
                    if (data.course.pdfResources) {
                        setPdfs(data.course.pdfResources.sort((a: any, b: any) => {
                            if (a.afterModule !== b.afterModule) return a.afterModule - b.afterModule;
                            return a.order - b.order;
                        }));
                    }

                    try {
                        const resQuizzes = await fetch(`/api/admin/courses/${id}/quizzes`);
                        if (resQuizzes.ok) {
                            const quizData = await resQuizzes.json();
                            setQuizzes(quizData.quizzes || []);
                        }
                    } catch (err) {
                        console.log('No quizzes found');
                    }

                    try {
                        const resAssignments = await fetch(`/api/admin/courses/${id}/assignments`);
                        if (resAssignments.ok) {
                            const assignmentData = await resAssignments.json();
                            setAssignments(assignmentData.assignments || []);
                        }
                    } catch (err) {
                        console.log('No assignments found');
                    }

                    try {
                        const resLiveClasses = await fetch(`/api/courses/${id}/live-classes`);
                        if (resLiveClasses.ok) {
                            const liveClassData = await resLiveClasses.json();
                            setLiveClasses(liveClassData.liveClasses || []);
                        }
                    } catch (err) {
                        console.log('No live classes found');
                    }
                }

                const resAuth = await fetch("/api/auth/me");
                if (resAuth.ok) {
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
                            // Fetch certificate eligibility
                            try {
                                const resCert = await fetch(`/api/courses/${id}/certificate-eligibility`);
                                if (resCert.ok) {
                                    const certData = await resCert.json();
                                    setCertificateData(certData);
                                }
                            } catch (err) {
                                console.error("Failed to fetch certificate data", err);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
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
            ? new Date(enrollmentData.enrolledAt).toLocaleDateString()
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
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{course.title}</h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">{course.description}</p>

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
                                Last Updated: {new Date(course.createdAt).toLocaleDateString()}
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
                            <h2 className="text-2xl font-bold text-white mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {course.curriculum.map((topic: string, index: number) => (
                                    <div key={index} className="flex items-start text-gray-300">
                                        <CheckCircle className="mr-3 text-blue-500 flex-shrink-0 mt-1" size={18} />
                                        {topic}
                                    </div>
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
                                                            {new Date(liveClass.date).toLocaleDateString()}
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
                                            
                                            return (
                                                <div key={moduleIndex} className="border border-white/10 rounded-xl overflow-hidden">
                                                    <div className="bg-white/5 p-4 border-b border-white/10">
                                                        <h3 className="text-white font-bold text-lg">
                                                            Module {moduleIndex + 1}: {module.title}
                                                        </h3>
                                                        {module.description && (
                                                            <p className="text-gray-400 text-sm mt-1">{module.description}</p>
                                                        )}
                                                        <p className="text-gray-500 text-xs mt-2">
                                                            {module.videos?.length || 0} video{(module.videos?.length || 0) !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2 p-2">
                                                        {(module.videos || []).map((video: any, videoIndex: number) => {
                                                            const globalIndex = startIndex + videoIndex;
                                                            return (
                                                                <div key={videoIndex} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                                    <div className="flex items-center text-gray-300 flex-1">
                                                                        <PlayCircle className="mr-3 text-gray-500" size={20} />
                                                                        <div>
                                                                            <span className="text-white font-medium">{video.title}</span>
                                                                            <p className="text-xs text-gray-500">{video.duration}</p>
                                                                        </div>
                                                                    </div>
                                                                    {isEnrolled ? (
                                                                        <Link href={`/courses/${id}/video/${globalIndex}`}>
                                                                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                                                                Play
                                                                            </Button>
                                                                        </Link>
                                                                    ) : (
                                                                        <Lock size={16} className="text-gray-600" />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
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

                        {isEnrolled && pdfs.length > 0 && (
                            <div className="glass-card p-8 rounded-2xl mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6">Course Resources</h2>
                                <div className="space-y-4">
                                    {pdfs.map((pdf) => (
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

                        {isEnrolled && quizzes.length > 0 && (
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
                                    {quizzes.map((quiz) => (
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

                        {isEnrolled && assignments.length > 0 && (
                            <div className="glass-card p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold text-white mb-6">Assignments</h2>
                                <div className="space-y-4">
                                    {assignments.map((assignment) => (
                                        <div key={assignment._id} className="p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="text-green-400" size={20} />
                                                    <div>
                                                        <h3 className="text-white font-medium">{assignment.title}</h3>
                                                        <p className="text-gray-400 text-sm">
                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()} • {assignment.totalMarks} marks
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
