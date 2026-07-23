"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer, MapPin, Mail, Globe, ShieldCheck, Award, Phone } from "lucide-react";

interface OfferLetterData {
    student: {
        firstName: string;
        lastName: string;
        email: string;
        gender?: string;
    };
    internship: {
        title: string;
        company: string;
        location: string;
        type: string;
        stipend: string;
    };
    startDate: string;
    offerDate: string;
    duration: string;
    appliedAt: string;
}

export default function OfferLetterPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState < OfferLetterData | null > (null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState < string | null > (null);

    useEffect(() => {
        const fetchOfferLetter = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(`[Offer Letter] Fetching for App: ${params.id}`);
                const res = await fetch(`/api/internships/applications/${params.id}/offer-letter`);
                const json = await res.json();

                if (!res.ok) {
                    console.error("[Offer Letter] API Error:", json);
                    setError(json.error || `Error ${res.status}: Failed to load offer letter`);
                    return;
                }

                setData(json);
                console.log("[Offer Letter] Data loaded successfully");
            } catch (err: any) {
                console.error("[Offer Letter] Fetch Exception:", err);
                setError("A network error occurred. Please check your internet connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchOfferLetter();
    }, [params.id, router]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 px-4">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="flex flex-col items-center">
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Document Protocol...</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-1">ID: {params.id}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 rotate-3">
                        <Printer className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Letter Unavailable</h2>
                    <p className="text-gray-500 text-sm mb-10 leading-relaxed font-mono">
                        {error}
                    </p>
                    <div className="space-y-3">
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="w-full bg-white text-black hover:bg-gray-200 h-14 rounded-xl font-bold text-lg"
                        >
                            Retry Connection
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => router.push('/profile')} 
                            className="w-full text-gray-500 hover:text-white h-12"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const formattedDate = new Date(data.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const displayedDate = data.offerDate ? new Date(data.offerDate) : new Date(data.appliedAt);
    
    const studentTitle = data.student.gender 
        ? (data.student.gender.toLowerCase() === 'female' ? 'Ms.' : 'Mr.')
        : 'Mr./Ms.';
    const offerDate = displayedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white relative">
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page {
                        margin: 0;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}} />
            {/* Print Button - Hidden when printing */}
            <div className="print:hidden fixed top-6 right-6 z-50 flex gap-3 shadow-2xl">
                <Button onClick={() => router.push("/profile")} variant="outline" className="bg-white/90 backdrop-blur shadow-sm border-gray-200 text-black hover:bg-gray-100">
                    Back to Profile
                </Button>
                <Button onClick={handlePrint} className="bg-[#1a237e] hover:bg-[#1a237e]/90 text-white shadow-lg">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Offer Letter
                </Button>
            </div>

            {/* Offer Letter - A4 Size */}
            <div className="w-[210mm] print:w-full print:max-w-none mx-auto p-12 print:px-6 print:py-4 bg-white text-black min-h-[297mm] print:min-h-0 print:h-auto print:text-[10px] leading-relaxed shadow-[0_0_40px_rgba(0,0,0,0.1)] print:shadow-none relative overflow-hidden box-border">
                
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none z-0">
                     <ShieldCheck size={600} />
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10 pb-6 border-b-2 border-[#1a237e] print:mb-1 print:pb-1">
                        {/* Logo */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4 mb-2">
                                <Award className="text-[#c5a059] w-9 h-9 print:w-6 print:h-6" />
                                <div className="text-left">
                                    <h2 className="text-2xl font-bold text-[#1a237e] tracking-wide uppercase font-serif">
                                        WEBORY <span className="relative inline-block ml-2">
                                            <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 border border-gray-200"></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                            </span>
                                            SKILLS
                                        </span>
                                    </h2>
                                    <p className="text-xs text-[#c5a059] tracking-[0.2em] uppercase font-semibold mt-0.5">Excellence in Education</p>
                                </div>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider pl-12">
                                Govt. of India Recognized Startup
                            </div>
                            <div className="text-[10px] text-[#c5a056] font-bold font-mono tracking-widest mt-0.5 pl-12">
                                MSME Reg: UDYAM-BR-26-0208472
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="text-right text-xs text-gray-600 space-y-1.5 print:text-[10px]">
                            <p className="font-black text-[#1a237e] text-sm print:text-xs tracking-wide uppercase">WEBORY SKILLS PLATFORM</p>
                            <p className="flex items-center justify-end gap-1.5"><MapPin size={12} className="text-[#c5a059]" /> Patna, Bihar, India</p>
                            <p className="flex items-center justify-end gap-1.5"><Phone size={12} className="text-[#c5a059]" /> +91 94734 71153</p>
                            <p className="flex items-center justify-end gap-1.5"><Mail size={12} className="text-[#c5a059]" />weboryinfo@gmail.com</p>
                            <p className="flex items-center justify-end gap-1.5"><Globe size={12} className="text-[#c5a059]" /> www.weboryskills.in</p>
                        </div>
                    </div>

                    {/* Meta Info (Date / Ref) */}
                    <div className="flex justify-between items-end mb-10 print:mb-1">
                        <div className="text-sm text-gray-700 print:text-xs font-mono bg-gray-50 print:bg-transparent print:border-none print:px-0 px-3 py-1.5 rounded border border-gray-100">
                            <span className="font-bold text-gray-900">Ref No:</span> {`WS/INT/${new Date(data.appliedAt || new Date()).getFullYear()}${String(new Date(data.appliedAt || new Date()).getMonth() + 1).padStart(2, '0')}/${(params.id as string)?.length >= 24 ? String(parseInt((params.id as string).substring(18, 24), 16) % 100000).padStart(5, '0') : (params.id as string)?.substring(0, 5).toUpperCase() || '00001'}`}
                        </div>
                        <div className="text-sm text-gray-700 print:text-xs font-mono bg-gray-50 print:bg-transparent print:border-none print:px-0 px-3 py-1.5 rounded border border-gray-100">
                            <span className="font-bold text-gray-900">Date:</span> {offerDate}
                        </div>
                    </div>
                    {/* Heading / Title */}
                    <div className="mb-8 print:mb-1 flex flex-col items-center justify-center text-center">
                        <h1 className="text-2xl print:text-lg font-black text-[#1a237e] tracking-[0.15em] uppercase font-serif mb-2 border-b-2 border-[#c5a059] pb-1 inline-block px-2">
                            Internship Offer Letter
                        </h1>
                        <p className="text-base print:text-sm font-bold text-gray-800">
                            For the Position of <span className="text-[#c5a059]">{data.internship.title}</span>
                        </p>
                        <div className="mt-2 text-[#990000] font-black tracking-widest uppercase text-[10px] print:text-[9px]">
                            — Issued by Webory Skills —
                        </div>
                    </div>

                    {/* Recipient Details */}
                    <div className="mb-10 print:mb-1">
                        <p className="font-bold text-gray-600 print:text-[10px] uppercase tracking-wider text-xs mb-1">To,</p>
                        <p className="font-black text-xl text-[#1a237e] print:text-base">
                            {data.student.firstName} {data.student.lastName}
                        </p>
                        <p className="text-sm text-gray-600 print:text-xs mt-1">{data.student.email}</p>
                    </div>


                    {/* Letter Body */}
                    <div className="space-y-5 print:space-y-1 mb-10 print:mb-1 text-justify text-gray-800 text-sm print:text-[10px] print:leading-snug leading-relaxed">
                        <p>Dear {studentTitle} <span className="font-bold text-black">{data.student.firstName}</span>,</p>

                        <p>
                            Following your application and successful completion of the interview process, we are delighted to offer you the position of <span className="font-bold text-[#1a237e]">{data.internship.title}</span> at <span className="font-bold">{data.internship.company}</span>. We are confident that your skills, dedication, and enthusiasm will make a valuable contribution to our team.
                        </p>

                        <p>
                            We were highly impressed with your background, skills, and enthusiasm, and we believe that your contribution will be valuable to our team's goals and your own professional growth.
                        </p>

                        <div className="my-10 print:my-1 border-t-2 border-b-2 border-gray-200 py-6 print:py-1">
                            <p className="font-black mb-6 print:mb-1 text-[#1a237e] uppercase tracking-[0.15em] text-sm print:text-[10px] text-left">Internship Details</p>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 print:gap-y-1.5">
                                <div className="flex flex-col border-b border-gray-100 pb-2">
                                    <span className="text-[10px] print:text-[9px] uppercase font-bold text-gray-500 tracking-widest">Role</span>
                                    <span className="font-black text-[#1a237e] text-base print:text-sm mt-1">{data.internship.title}</span>
                                </div>
                                <div className="flex flex-col border-b border-gray-100 pb-2">
                                    <span className="text-[10px] print:text-[9px] uppercase font-bold text-gray-500 tracking-widest">Company</span>
                                    <span className="font-bold text-gray-900 text-base print:text-sm mt-1">{data.internship.company}</span>
                                </div>
                                <div className="flex flex-col border-b border-gray-100 pb-2">
                                    <span className="text-[10px] print:text-[9px] uppercase font-bold text-gray-500 tracking-widest">Location & Model</span>
                                    <span className="font-medium text-gray-800 text-base print:text-sm mt-1">{data.internship.location} ({data.internship.type})</span>
                                </div>
                                <div className="flex flex-col border-b border-gray-100 pb-2">
                                    <span className="text-[10px] print:text-[9px] uppercase font-bold text-gray-500 tracking-widest">Duration</span>
                                    <span className="font-medium text-gray-800 text-base print:text-sm mt-1">{data.duration}</span>
                                </div>
                                <div className="flex flex-col border-b border-gray-100 pb-2">
                                    <span className="text-[10px] print:text-[9px] uppercase font-bold text-gray-500 tracking-widest">Start Date</span>
                                    <span className="font-medium text-gray-800 text-base print:text-sm mt-1">{formattedDate}</span>
                                </div>
                                <div className="flex flex-col border-b border-gray-100 pb-2">
                                    <span className="text-[10px] print:text-[9px] uppercase font-bold text-gray-500 tracking-widest">Stipend</span>
                                    <span className="font-bold text-[#c5a059] text-base print:text-sm mt-1">{data.internship.stipend}</span>
                                </div>
                            </div>
                        </div>

                        <p className="font-bold mt-8 print:mt-1 mb-3 print:mb-0 text-[#1a237e] uppercase tracking-wider text-xs print:text-[10px] break-after-avoid">Terms and Conditions:</p>
                        <ul className="list-disc pl-6 space-y-3 print:space-y-0.5 text-gray-700 print:text-[10px] print:leading-tight">
                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Scope of Work:</span> During the internship, you will perform tasks, assignments, and projects assigned by your mentor or reporting manager. You are expected to complete your responsibilities with dedication and within the given timelines.
                            </li>

                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Confidentiality:</span> You may have access to confidential information related to the company, its clients, or projects. Such information must remain confidential and must not be shared with any third party during or after the internship without prior written permission.
                            </li>

                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Code of Conduct:</span> You are expected to maintain professional behavior, follow the company's policies, respect mentors and fellow interns, and uphold ethical standards throughout the internship.
                            </li>

                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Attendance & Performance:</span> Regular participation, timely submission of assigned tasks, and satisfactory performance are required throughout the internship.
                            </li>

                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Certificate Eligibility:</span> The Internship Certificate and any applicable Letter of Recommendation will be issued only upon successful completion of the internship and fulfillment of all assigned requirements.
                            </li>

                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Intellectual Property:</span> Any work, project, code, design, or content developed during the internship for the company shall remain the intellectual property of Webory Skills unless otherwise agreed in writing.
                            </li>

                            <li className="break-inside-avoid">
                                <span className="font-bold text-gray-900">Termination:</span> Webory Skills reserves the right to discontinue the internship in cases of misconduct, violation of company policies, confidentiality breaches, prolonged inactivity, or unsatisfactory performance.
                            </li>
                        </ul>

                        <p className="pt-4 print:pt-1 font-medium text-gray-900 print:text-[10px] break-inside-avoid">
                            By accepting this offer, you acknowledge that you have read, understood, and agreed to the terms and conditions of this internship. We look forward to welcoming you to Webory Skills and wish you a successful learning experience.
                        </p>
                    </div>

                    {/* Signatures & Seals */}
                    <div className="mt-16 print:mt-1 flex justify-between items-end break-inside-avoid px-2">
                        
                        {/* 1. Signature (Left) */}
                        <div className="text-left w-1/3">
                            <p className="mb-6 print:mb-4 text-gray-600 font-medium text-sm">Sincerely,</p>
                            <div className="mb-2 relative">
                                {/* Digital Signature */}
                                <p className="text-2xl print:text-lg text-[#1a237e] font-cursive transform -rotate-2" style={{ fontFamily: '"Great Vibes", "Brush Script MT", cursive' }}>
                                    Mohit Sinha
                                </p>
                            </div>
                            <div className="border-t-2 border-gray-800 w-[180px] pt-3 mt-3">
                                <p className="text-gray-900 print:text-sm text-lg uppercase tracking-wide">Mohit Sinha</p>
                                <p className="text-sm text-gray-600 print:text-xs font-medium">Founder & CEO</p>
                                <p className="text-sm text-[#1a237e] font-bold print:text-[10px] mt-0.5 tracking-wide">WEBORY SKILLS</p>
                            </div>
                        </div>

                        {/* 2. Official Seal (Center) */}
                        <div className="flex flex-col items-center justify-end pb-2 w-1/3">
                            <div className="relative">
                                {/* Elegant Gold Seal */}
                                <div className="w-32 h-32 print:w-24 print:h-24 rounded-full border-4 border-[#c5a059] flex items-center justify-center p-1 shadow-lg bg-[#fffbe6] relative">
                                    <div className="w-full h-full rounded-full border-2 border-[#c5a059] border-dashed flex items-center justify-center relative">
                                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                <path id="curve" d="M 20,50 A 30,30 0 1,1 80,50 A 30,30 0 1,1 20,50" fill="none" />
                                                <text width="100" className="text-[11px] font-bold uppercase tracking-widest fill-[#b8860b]">
                                                    <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                                                        Webory Official Seal
                                                    </textPath>
                                                </text>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col items-center mt-2 print:mt-1">
                                            <Award className="text-[#c5a059] w-7 h-7 print:w-5 print:h-5" />
                                            <span className="text-[9px] print:text-[7px] font-bold text-[#b8860b] uppercase mt-1 print:mt-0">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. MSME Logo (Right) */}
                        <div className="flex flex-col items-end justify-end pb-2 w-1/3">
                            <div className="flex flex-col items-center w-full max-w-[150px] print:max-w-[110px]">
                                <img 
                                    src="/assets/msme-logo.jpg" 
                                    alt="MSME Logo" 
                                    className="w-full h-auto object-contain bg-white rounded shadow-sm border border-gray-100 p-2"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-16 print:mt-8 pt-4 border-t-2 border-gray-200 text-center flex flex-col items-center avoid-break-inside">
                        <p className="text-xs print:text-[10px] text-gray-500 font-medium">This is a system-generated offer letter and does not require a physical signature.</p>
                        <p className="text-[10px] print:text-[8px] text-gray-400 mt-1 font-bold tracking-widest uppercase">Webory Skills • Empowering the Future • MSME Registered</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Great+Vibes&display=swap');
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                .font-cursive {
                    font-family: 'Great Vibes', cursive;
                }
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0mm;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .avoid-break-inside {
                         break-inside: avoid;
                    }
                    /* Ensure background images/colors are printed */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
