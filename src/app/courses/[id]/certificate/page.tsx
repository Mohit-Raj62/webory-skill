"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Award } from "lucide-react";
import CourseCertificate from "@/components/certificates/CourseCertificate";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();

    const [certificateData, setCertificateData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [certificateId, setCertificateId] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetching using Promise.all for speed
                const [resAuth, resCourse, resCert] = await Promise.all([
                    fetch("/api/auth/me"),
                    fetch(`/api/courses/${id}`),
                    fetch(`/api/courses/${id}/certificate-eligibility`)
                ]);

                if (!resAuth.ok) {
                    router.push("/login"); // router.push() works fine here since it's an event loop cycle
                    return;
                }
                const userData = await resAuth.json();
                setUser(userData.user);

                if (resCourse.ok) {
                    const data = await resCourse.json();
                    setCourse(data.course);
                }

                if (resCert.ok) {
                    const data = await resCert.json();
                    setCertificateData(data);
                    setCertificateId(data.certificateId || "");
                }
            } catch (error) {
                console.error("Failed to fetch certificate data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
                <div className="w-full max-w-[297mm] h-[210mm] bg-white shadow-2xl rounded-sm p-12 flex flex-col items-center justify-between animate-pulse">
                    <div className="w-full h-full border-[12px] border-double border-gray-200 relative p-8 flex flex-col items-center gap-8">
                        <div className="w-20 h-20 bg-gray-100 rounded-full" />
                        <div className="w-3/4 h-12 bg-gray-100 rounded-lg" />
                        <div className="w-1/2 h-6 bg-gray-100 rounded" />
                        <div className="w-2/3 h-16 bg-gray-100 rounded-xl my-8" />
                        <div className="w-full h-24 bg-gray-100 rounded-lg" />
                        <div className="w-full flex justify-between mt-auto">
                            <div className="w-32 h-10 bg-gray-100 rounded" />
                            <div className="w-32 h-10 bg-gray-100 rounded" />
                            <div className="w-32 h-10 bg-gray-100 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!certificateData?.isEligible) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl max-w-md text-center shadow-lg border border-gray-200">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="text-red-500" size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900 leading-none">WEBORY SKILLS</h1>
                    <p className="text-gray-600 mb-8">
                        You haven&apos;t met the requirements to unlock this certificate yet.
                        Please complete 100% of the videos and achieve an overall grade of 90%.
                    </p>
                    <Button onClick={() => router.back()} variant="outline">
                        Back to Course
                    </Button>
                </div>
            </div>
        );
    }

    const formattedStartDate = certificateData?.enrolledAt 
        ? new Date(certificateData.enrolledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : "N/A";

    const formattedEndDate = certificateData?.completedAt 
        ? new Date(certificateData.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let collabs = course?.collaborations || [];
    if (collabs.length === 0 && course?.collaboration) {
        collabs = [{ name: course.collaboration }];
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 print:p-0 print:bg-white print:overflow-hidden">
            {/* Controls */}
            <div className="w-full max-w-[297mm] flex justify-between items-center mb-8 print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Course
                </Button>
                <Button onClick={() => window.print()} className="bg-blue-900 hover:bg-blue-800 text-white shadow-md">
                    <Printer className="mr-2" size={20} />
                    Print / Save as PDF
                </Button>
            </div>

            <CourseCertificate 
                studentName={`${user?.firstName || 'Student'} ${user?.lastName || 'Name'}`}
                courseName={course?.title || 'Course Title'}
                duration={course?.duration || "N/A"}
                startDate={formattedStartDate}
                endDate={formattedEndDate}
                certificateId={certificateId}
                collaborations={collabs}
                signatures={course?.signatures}
            />

            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        visibility: hidden;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background: white;
                        margin: 0;
                        padding: 0;
                    }
                    html, body {
                        width: 100%;
                        height: 100vh;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }
                    @media print {
                        body {
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }
                    }
                    #certificate-container {
                        visibility: visible;
                        position: relative !important;
                        left: auto !important;
                        top: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 9999;
                        overflow: hidden;
                        box-shadow: none;
                        background: white;
                        border: none;
                        width: 1122px !important;
                        height: 794px !important;
                        transform-origin: center center !important;
                    }
                    @media print and (orientation: portrait) {
                         @page {
                            size: portrait;
                            margin: 0;
                        }
                        #certificate-container {
                            position: relative !important;
                            top: 0 !important;
                            left: 0 !important;
                            transform: scale(0.8) !important;
                            transform-origin: top left !important;
                            left: 50% !important;
                            margin-left: -449px !important; 
                            margin-top: 20px;
                        }
                    }
                    @media print and (orientation: landscape) {
                        @page { 
                            size: landscape; 
                            margin: 0;
                        }
                        #certificate-container {
                            transform: scale(0.98) !important;
                            transform-origin: top left !important;
                            left: 0 !important;
                             margin-left: 0 !important;
                        }
                    }
                    #certificate-container * {
                        visibility: visible;
                    }
                }
            `}</style>
        </div>
    );
}

