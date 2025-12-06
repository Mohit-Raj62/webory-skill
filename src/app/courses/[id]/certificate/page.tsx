"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Printer, Award } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
                    // Use backend generated ID if available, otherwise fallback
                    const courseTitleSlug = data.course?.title
                        ? data.course.title.split(" ").map((w: string) => w[0]).join("").toUpperCase().substring(0, 4)
                        : "WS";
                    
                    const certId = data.certificateId || `${courseTitleSlug}-${userData.user._id.substring(0, 6).toUpperCase()}-${Date.now().toString().substring(8)}`;
                    setCertificateId(certId);

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

            {/* Certificate Container - A4 Landscape Ratio (297mm x 210mm) */}
            <div className="bg-white text-black w-full max-w-[297mm] aspect-[1.414/1] shadow-2xl relative overflow-hidden print:shadow-none print:w-full print:max-w-none print:h-screen print:absolute print:top-0 print:left-0 print:m-0 print:rounded-none mx-auto">

                {/* Outer Border */}
                <div className="absolute inset-0 p-3">
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
                <div className="relative z-10 h-full flex flex-col items-center justify-between py-16 px-20">

                    {/* Header */}
                    <div className="text-center w-full">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Award className="text-[#c5a059]" size={56} />
                            <div className="text-left">
                                <h2 className="text-3xl font-bold text-[#1a237e] tracking-wide uppercase font-serif">Webory Skill</h2>
                                <p className="text-sm text-[#c5a059] tracking-[0.2em] uppercase">Excellence in Education</p>
                            </div>
                        </div>

                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1a237e] to-transparent mb-8 opacity-30"></div>

                        <h1 className="text-6xl font-serif font-bold text-[#1a237e] mb-4 tracking-tight certificate-title">
                            Certificate of Completion
                        </h1>
                        <p className="text-xl text-gray-500 italic font-serif">This is to certify that</p>
                    </div>

                    {/* Recipient */}
                    <div className="text-center w-full my-4">
                        <h2 className="text-5xl font-serif font-bold text-[#1a237e] mb-2 px-8 py-2 inline-block border-b-2 border-[#c5a059] min-w-[400px]">
                            {user?.firstName} {user?.lastName}
                        </h2>
                    </div>

                    {/* Course Details */}
                    <div className="text-center w-full space-y-4">
                        <p className="text-xl text-gray-600 font-serif">has successfully completed the course</p>
                        <h3 className="text-4xl font-bold text-black font-serif tracking-wide">
                            {course?.title}
                        </h3>
                        <p className="text-lg text-gray-600 font-serif max-w-2xl mx-auto">
                            demonstrating proficiency and dedication, achieving an overall grade of <span className="font-bold text-[#1a237e]">{certificateData.overallScore}%</span>.
                        </p>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full grid grid-cols-3 gap-8 items-end mt-8">
                        {/* Date */}
                        <div className="text-center">
                            <p className="text-lg font-serif font-bold text-[#1a237e] border-b border-gray-400 pb-2 mb-2">
                                {certificateData?.completedAt 
                                    ? new Date(certificateData.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                }
                            </p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Date Issued</p>
                        </div>

                        {/* Seal with QR Code */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                                <div className="absolute inset-0 border-4 border-[#c5a059] border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-20"></div>
                                <div className="bg-white p-1 rounded-lg shadow-sm">
                                     <QRCodeSVG 
                                        value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://webory-skill.vercel.app'}/verify-certificate/${certificateId}`}
                                        size={100}
                                        level="H"
                                     />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Scan to Verify</p>
                            {certificateData?.certificateKey && (
                                <p className="text-[8px] font-mono text-gray-400 mt-1">
                                    Key: {certificateData.certificateKey}
                                </p>
                            )}
                        </div>

                        {/* Signature */}
                        <div className="text-center">
                            <div className="h-12 flex items-end justify-center mb-2">
                                <span className="font-signature text-3xl text-[#1a237e]">Webory Team</span>
                            </div>
                            <div className="border-b border-gray-400 w-full mb-2"></div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Director of Education</p>
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
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background: white;
                    }
                    /* Hide everything that is not the certificate container */
                    body > *:not(.print\:block) {
                       /* This might be too aggressive if the structure is complex, 
                          but our print:hidden classes should handle most UI. */
                    }
                }
            `}</style>
        </div>
    );
}

