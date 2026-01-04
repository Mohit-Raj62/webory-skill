"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, Award } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface Application {
    _id: string;
    student: {
        firstName: string;
        lastName: string;
    };
    internship: {
        title: string;
        company: string;
    };
    status: string;
    startDate: string;
    appliedAt: string;
    duration: string;
    completedAt: string;
    certificateId: string;
    certificateKey?: string;
}

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const [application, setApplication] = useState < Application | null > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                // Optimized: Fetch only the specific application data instead of full dashboard
                const res = await fetch(`/api/internships/applications/${id}/certificate`);
                
                if (!res.ok) {
                    const error = await res.json();
                    console.error("API Error:", error);
                    alert("Failed to load certificate data");
                    router.push('/profile');
                    return;
                }

                const fullApp = await res.json();

                if (fullApp.status !== 'completed') {
                    alert("Certificate not available yet. Internship must be marked as completed.");
                    router.push('/profile');
                    return;
                }

                setApplication(fullApp);
            } catch (error) {
                console.error("Error fetching certificate data:", error);
                alert("Failed to load certificate");
                router.push('/profile');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchApplication();
    }, [id, router]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                Loading Certificate...
            </div>
        );
    }

    if (!application) return null;

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://weboryskills.in'}/verify-certificate/${application.certificateId}`;

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 print:p-0 print:bg-white">
            {/* Actions Bar */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-4">
                    <Button onClick={handlePrint} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    {/* Hiding duplicate download button as print handles PDF */}
                </div>
            </div>

            {/* Certificate Container Wrapper for Scaling */}
            <div 
                className="relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:overflow-visible bg-white"
                style={{
                    width: isMobile ? window.innerWidth - 32 : '297mm',
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
                    className="bg-white text-black relative print:transform-none print:w-full print:h-full overflow-hidden"
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

                {/* Watermark Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center z-0">
                    <Award size={600} />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between pt-12 pb-10 px-24">

                    {/* Header with MSME */}
                    <div className="text-center w-full">
                        <div className="flex items-start justify-center gap-4 mb-1">
                            <Award className="text-[#c5a059] mt-1" size={48} />
                            <div className="text-left">
                                <h2 className="text-3xl font-bold text-[#1a237e] tracking-wide uppercase font-serif">Webory Skills</h2>
                                <p className="text-sm text-[#c5a059] tracking-[0.2em] uppercase">Excellence in Education</p>
                                <div className="flex gap-4 mt-1">
                                    <div className="flex flex-col items-start border-l-2 border-[#c5a059] pl-2">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Govt. of India Recognized Startup</p>
                                        <p className="text-[9px] text-[#c5a056] font-bold font-mono tracking-wider">MSME Reg: UDYAM-BR-26-0208472</p>
                                    </div>
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
                            {application.student?.firstName || 'Student'} {application.student?.lastName || 'Name'}
                        </h2>
                    </div>

                    {/* Internship Details */}
                    <div className="text-center w-full space-y-1">
                        <p className="text-lg text-gray-600 font-serif">has successfully completed the internship program as a</p>
                        <h3 className="text-4xl font-bold text-black font-serif tracking-wide mb-2">
                            {application.internship?.title || 'Internship Position'}
                        </h3>
                        <p className="text-lg text-gray-600 font-serif">
                            at <span className="font-bold text-[#1a237e]">{application.internship?.company || 'Webory Skills'}</span>
                        </p>

                        <div className="flex justify-center gap-12 mt-6 mb-4 border-y border-gray-200 py-2 mx-10">
                            {/* Duration */}
                            <div className="flex flex-col items-center px-2">
                                <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Duration</span>
                                <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">{application.duration || '3 months'}</span>
                            </div>

                             {/* Start Date */}
                             <div className="flex flex-col items-center px-2 border-l border-gray-200 pl-12">
                                <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Started</span>
                                <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">
                                    {application.startDate ? new Date(application.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : (application.appliedAt ? new Date(application.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A')}
                                </span>
                            </div>

                            {/* Completed */}
                            <div className="flex flex-col items-center px-2 border-l border-gray-200 pl-12">
                                <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Completed</span>
                                <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">
                                    {application.completedAt 
                                        ? new Date(application.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                                        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full flex justify-between items-end mt-4 px-12">
                        {/* Signature 1 */}
                        <div className="text-center">
                            <div className="h-12 flex items-end justify-center mb-1">
                                <span className="font-signature text-3xl text-[#1a237e] whitespace-nowrap px-2">Webory Skills</span>
                            </div>
                            <div className="border-b border-gray-400 w-40 mx-auto mb-1"></div>
                            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Institute</p>
                        </div>

                         {/* QR Code */}
                         <div className="flex flex-col items-center justify-center">
                            <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                                <QRCodeSVG
                                    value={verificationUrl}
                                    size={80}
                                    level="H"
                                />
                            </div>
                            <p className="text-[8px] text-gray-500 mt-1 font-bold uppercase tracking-widest">Scan to Verify</p>
                            <p className="text-[8px] font-mono text-[#a5c098] font-bold">ID: {application.certificateId || 'N/A'}</p>
                            <p className="text-[8px] text-[#2e7d32] font-bold uppercase tracking-widest mt-0.5">Govt. Recognized</p>
                        </div>


                        {/* Signature 2 */}
                        <div className="text-center">
                            <div className="h-12 flex items-end justify-center mb-1">
                                <span className="font-signature text-3xl text-[#1a237e] whitespace-nowrap px-2">Mohit Sinha</span>
                            </div>
                            <div className="border-b border-gray-400 w-40 mx-auto mb-1"></div>
                            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Director</p>
                        </div>
                    </div>

                    {/* OFFICIAL SEAL */}
                    <div className="absolute bottom-40 right-16 opacity-90 print:block">
                        <div className="w-32 h-32 rounded-full border-4 border-[#c5a059] flex items-center justify-center p-1 shadow-lg bg-[#fffbe6]">
                            <div className="w-full h-full rounded-full border-2 border-[#c5a059] border-dashed flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow-static">
                                        <path id="curve" d="M 20,50 A 30,30 0 1,1 80,50 A 30,30 0 1,1 20,50" fill="none" />
                                        <text width="100" className="text-[11px] font-bold uppercase tracking-widest fill-[#b8860b]">
                                            <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                                                Webory Official Seal
                                            </textPath>
                                        </text>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Award size={32} className="text-[#c5a059]" />
                                    <span className="text-[10px] font-bold text-[#b8860b] uppercase mt-1">Verified</span>
                                </div>
                            </div>
                        </div>
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
                    
                    /* Nuclear Reset for Print */
                    html, body {
                        width: 100%;
                        height: 100vh; /* Force single page height */
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important; /* Kill scrollbars/2nd page */
                    }

                    /* Use Flexbox interactions on body to center the certificate */
                    @media print {
                        body {
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }
                    }

                    /* Base Print Container Settings */
                    #certificate-container {
                        visibility: visible;
                        position: relative !important; /* Let Flexbox handle it */
                        left: auto !important;
                        top: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 9999;
                        overflow: hidden;
                        box-shadow: none;
                        background: white;
                        border: none;
                        
                        /* Fixed Source Dimensions */
                        width: 1122px !important;
                        height: 794px !important;
                        
                        /* Default Transform Origin */
                        transform-origin: center center !important;
                    }
                    
                    /* PORTRAIT (Mobile Default): Revert to standard fit-width */
                    /* User requested: "rotated nhi karo" (Don't rotate) */
                    @media print and (orientation: portrait) {
                        @page {
                            size: portrait;
                            margin: 0; 
                        }
                        
                        #certificate-container {
                            position: relative !important;
                            top: 0 !important;
                            left: 0 !important;
                            
                            /* 
                               MAXIMUM WIDTH FIT:
                               Landscape (1122px) -> Portrait (794px).
                               Scale = 0.7 (approx).
                               This is the biggest it can be without rotation.
                            */
                            transform: scale(0.7) !important;
                            transform-origin: top left !important;
                            left: 50% !important;
                            margin-left: -392px !important; /* Center it: 1122 * 0.7 / 2 approx */
                            
                            margin-top: 20px; /* Give it a little breathing room from top */
                        }
                    }

                    /* LANDSCAPE: Full size beauty */
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

                    /* Hide everything else */
                     #certificate-container * {
                        visibility: visible;
                    }
                    /* Ensure SVG text renders correctly in print */
                    svg text {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        fill: #b8860b !important;
                    }
                }
            `}</style>
        </div>
    );
}
