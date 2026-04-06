"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface OfferLetterData {
    student: {
        firstName: string;
        lastName: string;
        email: string;
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
    
    const offerDate = displayedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Print Button - Hidden when printing */}
            <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
                <Button onClick={() => router.push("/profile")} variant="outline">
                    Back to Profile
                </Button>
                <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Offer Letter
                </Button>
            </div>

            {/* Offer Letter - A4 Size */}
            <div className="max-w-4xl mx-auto p-4 md:p-8 print:p-8 bg-white text-black min-h-screen print:min-h-0 print:text-sm leading-relaxed shadow-lg print:shadow-none my-4 md:my-8 print:my-0">
                {/* Company Header with MSME */}
                <div className="text-center mb-8 print:mb-4 border-b-2 border-[#1a237e] pb-4 print:pb-2">
                    <h1 className="text-3xl print:text-2xl font-bold text-[#1a237e] mb-1 print:mb-1">
                        {data.internship.company}
                    </h1>
                     <div className="flex flex-col items-center justify-center mb-2">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Govt. of India Recognized Startup</p>
                        <p className="text-[10px] text-[#c5a056] font-bold font-mono tracking-wider">MSME Reg: UDYAM-BR-26-0208472</p>
                    </div>
                    <p className="text-sm text-gray-600 print:text-xs">WEBORY SKILL's Platform</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">{data.internship.location}</p>
                </div>

                {/* Date */}
                <div className="text-right mb-6 print:mb-4">
                    <p className="text-sm print:text-xs">Date: {offerDate}</p>
                </div>

                {/* Student Address */}
                <div className="mb-6 print:mb-4">
                    <p className="font-semibold print:text-sm">
                        {data.student.firstName} {data.student.lastName}
                    </p>
                    <p className="text-sm text-gray-600 print:text-xs">{data.student.email}</p>
                </div>

                {/* Subject */}
                <div className="mb-6 print:mb-4">
                    <p className="font-bold print:text-sm">
                        Subject: Offer Letter for {data.internship.title}
                    </p>
                </div>

                {/* Body */}
                <div className="space-y-4 print:space-y-2 mb-8 print:mb-4 text-justify">
                    <p>Dear {data.student.firstName},</p>

                    <p>
                        We are pleased to inform you that you have been selected for the position of{" "}
                        <span className="font-semibold">{data.internship.title}</span> at{" "}
                        <span className="font-semibold">{data.internship.company}</span>.
                    </p>

                    <p>
                        Congratulations! We were impressed by your application and believe you will be
                        a valuable addition to our team.
                    </p>

                    {/* Internship Details Table */}
                    <div className="my-6 print:my-4 border border-gray-300 rounded-lg overflow-hidden">
                        <table className="w-full text-sm print:text-xs">
                            <tbody>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold w-1/3">Position</td>
                                    <td className="p-3 print:p-1.5">{data.internship.title}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold">Company</td>
                                    <td className="p-3 print:p-1.5">{data.internship.company}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold">Location</td>
                                    <td className="p-3 print:p-1.5">{data.internship.location}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold">Type</td>
                                    <td className="p-3 print:p-1.5">{data.internship.type}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold">Duration</td>
                                    <td className="p-3 print:p-1.5">{data.duration}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold">Start Date</td>
                                    <td className="p-3 print:p-1.5">{formattedDate}</td>
                                </tr>
                                <tr>
                                    <td className="p-3 print:p-1.5 bg-gray-50 font-semibold">Stipend</td>
                                    <td className="p-3 print:p-1.5">{data.internship.stipend}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        Please confirm your acceptance of this offer by replying to this letter at your
                        earliest convenience.
                    </p>
                </div>

                {/* Signature */}
                <div className="mt-12 print:mt-12 flex justify-between items-end avoid-break-inside">
                    <div>
                        <p className="mb-4 print:mb-2 print:text-sm">Sincerely,</p>
                        <div className="mb-2">
                            {/* Digital Signature */}
                            <p className="text-2xl print:text-xl text-[#1a237e] font-cursive transform -rotate-2" style={{ fontFamily: '"Great Vibes", "Brush Script MT", cursive' }}>
                                Mohit Sinha
                            </p>
                        </div>
                        <div className="border-t border-gray-400 w-48 pt-2">
                            <p className="font-bold text-gray-800 print:text-sm">Authorized Signatory</p>
                            <p className="text-sm text-gray-600 print:text-xs">HR Department</p>
                            <p className="text-sm text-gray-600 print:text-xs">{data.internship.company}</p>
                        </div>
                    </div>

                    {/* Company Stamp/Seal */}
                    <div className="opacity-90 transform rotate-12 border-4 border-[#1a237e] rounded-full w-32 h-32 flex items-center justify-center p-2 text-center text-[#1a237e] font-bold text-xs uppercase tracking-widest hidden print:flex">
                        <div className="border border-[#1a237e] rounded-full w-full h-full flex items-center justify-center">
                            {data.internship.company}
                            <br />
                            Official Seal
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 print:mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    <p>This is a system-generated offer letter from WEBORY SKILL's Platform</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .avoid-break-inside {
                         break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
