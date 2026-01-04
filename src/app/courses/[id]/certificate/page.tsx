"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Printer, Award, Clock, CalendarDays } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();

    const [certificateData, setCertificateData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [certificateId, setCertificateId] = useState("");
    const [isMobile, setIsMobile] = useState(false); // Track mobile state for print adjustments if needed

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch User
                const resAuth = await fetch("/api/auth/me");
                if (!resAuth.ok) {
                    router.push("/login");
                    return;
                }
                const userData = await resAuth.json();
                setUser(userData.user);

                // 2. Fetch Course
                const resCourse = await fetch(`/api/courses/${id}`);
                if (resCourse.ok) {
                    const data = await resCourse.json();
                    setCourse(data.course);
                }

                // 3. Fetch Eligibility
                const resCert = await fetch(`/api/courses/${id}/certificate-eligibility`);
                if (resCert.ok) {
                    const data = await resCert.json();
                    setCertificateData(data);

                    // Use backend generated ID if available, otherwise fallback (though backend should generate it now)
                    const certId = data.certificateId;
                    setCertificateId(certId || "");

                    if (!data.isEligible) {
                        // If not eligible, redirect back to course page after a delay or show message
                        // For now, we'll just let the UI handle the "Not Eligible" state
                    }
                }
            } catch (error) {
                console.error("Failed to fetch certificate data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Certificate Locked</h1>
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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 print:p-0 print:bg-white">
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

            {/* Certificate Container Wrapper for Scaling */}
            <div 
                className="relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:overflow-visible"
                style={{
                    width: isMobile ? window.innerWidth - 32 : '297mm', // 297mm is approx 1122px
                    height: isMobile ? (window.innerWidth - 32) * (210/297) : '210mm',
                }}
            >
                {/* Scalable Content */}
                <div 
                    id="certificate-container"
                    style={{
                        width: '1122px', // Fixed Source Width (A4 96dpi)
                        height: '794px', // Fixed Source Height
                        transform: isMobile ? `scale(${(window.innerWidth - 32) / 1122})` : 'none',
                        transformOrigin: 'top left',
                    }}
                    className="bg-white text-black relative print:transform-none print:w-full print:h-full"
                >

                {/* Outer Border */}
                <div className="absolute inset-0 p-[12px]">
                    <div className="w-full h-full border-[12px] border-double border-[#1a237e] relative">
                        {/* Inner Ornamental Border */}
                        <div className="absolute inset-1 border border-[#c5a059]"></div>
                        <div className="absolute inset-3 border-2 border-[#1a237e]"></div>

                        {/* Corner Ornaments */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-[12px] border-l-[12px] border-[#c5a059] rounded-tl-sm"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 border-t-[12px] border-r-[12px] border-[#c5a059] rounded-tr-sm"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[12px] border-l-[12px] border-[#c5a059] rounded-bl-sm"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[12px] border-r-[12px] border-[#c5a059] rounded-br-sm"></div>
                    </div>
                </div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                    <Award size={600} />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between pt-12 pb-10 px-24">

                    {/* Header */}
                    <div className="text-center w-full">
                        <div className="flex items-start justify-center gap-4 mb-1">
                            <Award className="text-[#c5a059] mt-1" size={48} />
                            <div className="text-left">
                                <h2 className="text-3xl font-bold text-[#1a237e] tracking-wide uppercase font-serif">Webory Skill&apos;s </h2>
                                <p className="text-sm text-[#c5a059] tracking-[0.2em] uppercase">Excellence in Education</p>
                                <div className="flex gap-4 mt-1">
                                    <div className="flex flex-col items-start border-l-2 border-[#c5a059] pl-2">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Govt. of India Recognized Startup</p>
                                        <p className="text-[9px] text-[#c5a056] font-bold font-mono tracking-wider">MSME Reg: UDYAM-BR-26-0208472</p>
                                    </div>
                                    {course?.collaboration && (
                                        <div className="flex flex-col items-start border-l-2 border-[#c5a059] pl-2">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">In Association With</p>
                                            <p className="text-sm text-[#c5a059] font-bold font-serif tracking-wider uppercase">{course.collaboration}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1a237e] to-transparent mb-4 opacity-30"></div>

                        <h1 className="text-5xl font-serif font-bold text-[#1a237e] mb-1 tracking-tight certificate-title">
                            Certificate of Completion
                        </h1>
                        <p className="text-lg text-gray-500 italic font-serif">This is to certify that</p>
                    </div>

                    {/* Recipient */}
                    <div className="text-center w-full my-2">
                        <h2 className="text-5xl font-serif font-bold text-[#1a237e] mb-2 px-8 py-2 inline-block border-b-2 border-[#c5a059] min-w-[400px] capitalize">
                            {user?.firstName} {user?.lastName}
                        </h2>
                    </div>

                    {/* Course Details */}
                    <div className="text-center w-full space-y-1">
                        <p className="text-lg text-gray-600 font-serif">has successfully completed the course</p>
                        <h3 className="text-4xl font-bold text-black font-serif tracking-wide mb-2">
                            {course?.title}
                        </h3>

                        <div className="flex justify-center gap-12 mb-4 border-y border-gray-200 py-2 mx-10">
                            {/* Duration */}
                            <div className="flex flex-col items-center px-2">
                                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                    <Clock size={14} />
                                    <span className="text-[10px] uppercase tracking-widest font-semibold">Duration</span>
                                </div>
                                <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">{course?.duration || "N/A"}</span>
                            </div>

                            {/* Joining Date */}
                            <div className="flex flex-col items-center px-2 border-l border-gray-200 pl-12">
                                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                    <CalendarDays size={14} />
                                    <span className="text-[10px] uppercase tracking-widest font-semibold">Enrolled</span>
                                </div>
                                <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">
                                    {certificateData?.enrolledAt 
                                        ? new Date(certificateData.enrolledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : "N/A"
                                    }
                                </span>
                            </div>

                            {/* Date Issued */}
                            <div className="flex flex-col items-center px-2 border-l border-gray-200 pl-12">
                                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                    <Award size={14} />
                                    <span className="text-[10px] uppercase tracking-widest font-semibold">Completed</span>
                                </div>
                                <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">
                                    {certificateData?.completedAt 
                                        ? new Date(certificateData.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                    }
                                </span>
                            </div>
                        </div>
                       
                        <p className="text-lg text-gray-600 font-serif max-w-2xl mx-auto">
                            demonstrating proficiency and dedication, achieving an overall grade of <span className="font-bold text-[#1a237e]">{certificateData.overallScore}%</span>.
                        </p>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full flex flex-col items-center mt-1">
                        {/* Seal with QR Code - Centered Top */}
                        <div className="flex flex-col items-center justify-center mb-1">
                            <div className="relative w-28 h-28 flex items-center justify-center mb-1">
                                <div className="absolute inset-0 border-4 border-[#c5a059] border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-20"></div>
                                <div className="bg-white p-1 rounded-lg shadow-sm">
                                {certificateId ? (
                                    <QRCodeSVG 
                                        value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://weboryskills.in'}/verify-certificate/${certificateId}`}
                                        size={100}
                                        level="H"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400 text-center leading-tight p-2">
                                        Verifying...
                                    </div>
                                )}
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                {certificateId ? "Scan to Verify" : "Generating ID..."}
                            </p>
                            <p className="text-[8px] text-[#2e7d32] font-bold uppercase tracking-widest mt-0.5">Govt. Recognized</p>
                        </div>

                        {/* Signatures Grid */}
                        <div className={`w-full grid ${course?.collaboration ? 'grid-cols-3' : 'grid-cols-2'} gap-8 items-end px-12`}>
                            {/* Signature 1 (Left) - Founder */}
                            <div className="text-center">
                                <div className="h-12 flex items-end justify-center mb-1">
                                    <span className="font-signature text-4xl text-[#1a237e] whitespace-nowrap px-2">
                                        {course?.signatures?.founder?.name || "Mohit Raj"}
                                    </span>
                                </div>
                                <div className="border-b border-gray-400 w-full mb-1"></div>
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{course?.signatures?.founder?.title || "Founder & CEO"}</p>
                            </div>

                            {/* Signature 2 */}
                            <div className="text-center">
                                <div className="h-12 flex items-end justify-center mb-1">
                                    <span className="font-signature text-4xl text-[#1a237e] whitespace-nowrap px-2">
                                        {course?.signatures?.director?.name || "Webory Team"}
                                    </span>
                                </div>
                                <div className="border-b border-gray-400 w-full mb-1"></div>
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{course?.signatures?.director?.title || "Director of Education"}</p>
                            </div>

                            {/* Signature 3 (Partner) - Only if collaboration */}
                            {course?.collaboration && (
                                <div className="text-center">
                                    <div className="h-12 flex items-end justify-center mb-1">
                                        <span className="font-signature text-4xl text-[#c5a059] whitespace-nowrap px-2">
                                            {course?.signatures?.partner?.name || "Partner Rep."}
                                        </span>
                                    </div>
                                    <div className="border-b border-gray-400 w-full mb-1"></div>
                                    <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{course?.signatures?.partner?.title || "Authorized Signatory"}</p>
                                </div>
                            )}

                        </div>

                        {/* Official Seal Overlay */}
                        <div className="absolute bottom-24 right-16 opacity-80 transform -rotate-12 pointer-events-none z-20 mix-blend-multiply">
                            <div className="border-4 border-[#1a237e] rounded-full w-32 h-32 flex items-center justify-center p-2 text-center text-[#1a237e] font-bold text-xs uppercase tracking-widest">
                                <div className="border border-[#1a237e] rounded-full w-full h-full flex items-center justify-center leading-tight">
                                    Webory Skills
                                    <br />
                                    Verified &
                                    <br />
                                    Authorized
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certificate ID - Top Left */}
                    <div className="absolute top-10 left-10">
                        <p className="text-sm font-mono tracking-wider text-[#a5c098] font-bold">
                            ID: {certificateId}
                        </p>
                    </div>
                </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&display=swap');

                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                .font-signature {
                    font-family: 'Great Vibes', cursive;
                }
                
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
                    
                    #certificate-container {
                        visibility: visible;
                        position: fixed;
                        top: 0;
                        left: 0;
                        /* Force scale down for mobile print to fit 1 page */
                        zoom: 0.5;
                        min-width: 1024px;

                        /* Force A4 Pixels for Print - browsers handle px to physical unit well in print mode usually */
                        width: 1122px !important;
                        height: 794px !important;
                        transform: none !important;
                        margin: 0;
                        padding: 0;
                        z-index: 9999;
                        overflow: hidden;
                        box-shadow: none;
                        background: white;
                    }
                    
                    #certificate-container * {
                        visibility: visible;
                    }
                }
            `}</style>
        </div>
    );
}

