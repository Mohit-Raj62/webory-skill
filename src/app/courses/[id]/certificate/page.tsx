"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Award, Download } from "lucide-react";
import CourseCertificate from "@/components/certificates/CourseCertificate";
import { downloadCertificateAsPDF } from "@/lib/certificate-download";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();

    const [certificateData, setCertificateData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [certificateId, setCertificateId] = useState("");
    const [certificateKey, setCertificateKey] = useState("");
    const [downloadingPdf, setDownloadingPdf] = useState(false);

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
                    setCertificateKey(data.certificateKey || "");
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

    const handleDownloadPDF = async () => {
        setDownloadingPdf(true);
        await downloadCertificateAsPDF(
            "certificate-container",
            `Webory_Course_${certificateId || "Certificate"}`
        );
        setDownloadingPdf(false);
    };

    return (
        <div className="certificate-page-root min-h-screen bg-gray-100 flex flex-col items-center py-6 sm:py-8 px-2 sm:px-4 print:p-0 print:m-0 print:bg-white print:overflow-visible">
            {/* Controls */}
            <div className="w-full max-w-[1122px] flex justify-between items-center mb-6 print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm">
                    <ArrowLeft className="mr-1.5 sm:mr-2" size={18} />
                    Back to Course
                </Button>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Button 
                        onClick={handleDownloadPDF} 
                        disabled={downloadingPdf}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs px-3 sm:px-5 h-9 sm:h-10 shadow-md"
                    >
                        <Download className="mr-1.5 sm:mr-2 h-4 w-4" /> {downloadingPdf ? "Generating PDF..." : "Download PDF"}
                    </Button>
                    <Button onClick={() => window.print()} variant="outline" className="bg-white hover:bg-gray-50 text-gray-800 text-xs px-3 sm:px-4 h-9 sm:h-10 border-gray-300">
                        <Printer className="mr-1.5 sm:mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>

            <CourseCertificate 
                studentName={`${user?.firstName || 'Student'} ${user?.lastName || 'Name'}`}
                courseName={course?.title || 'Course Title'}
                duration={course?.duration || "N/A"}
                startDate={formattedStartDate}
                endDate={formattedEndDate}
                certificateId={certificateId}
                certificateKey={certificateKey}
                collaborations={collabs}
                signatures={course?.signatures}
            />

            {/* Print Styles - EXACT same bulletproof A4 landscape engine */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { 
                        size: A4 landscape; 
                        margin: 0; 
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        height: 100% !important;
                        width: 100% !important;
                        overflow: hidden !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body {
                        visibility: hidden !important;
                    }
                    #certificate-container, 
                    #certificate-container * {
                        visibility: visible !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #certificate-container {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 297mm !important;
                        height: 210mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 99999999 !important;
                        background: #fafaf8 !important;
                        transform: none !important;
                        -webkit-transform: none !important;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                        visibility: visible !important;
                    }
                    /* Ensure parents are not display:none but content is hidden */
                    main, .container, .motion-wrapper, .certificate-wrapper, .certificate-page-root, body > div {
                        display: block !important;
                        visibility: hidden !important;
                        position: static !important;
                        height: auto !important;
                        width: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                    }
                    /* Force hide other specific non-parents */
                    navbar, footer, .print\\:hidden, button {
                        display: none !important;
                    }
                }
            ` }} />
        </div>
    );
}

