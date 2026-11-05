"use client";

import { useState } from "react";
import CourseCertificate from "@/components/certificates/CourseCertificate";
import InternshipCertificate from "@/components/certificates/InternshipCertificate";
import HackathonCertificate from "@/components/HackathonCertificate";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { downloadCertificateAsPDF } from "@/lib/certificate-download";

export default function CertificatePreviewPage() {
    const [tab, setTab] = useState<"internship" | "course" | "hackathon">("internship");
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        await downloadCertificateAsPDF("certificate-container", `Webory_${tab}_certificate`);
        setDownloading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-8 px-4">
            {/* Control Bar */}
            <div className="w-full max-w-[1122px] flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900 border border-slate-800 p-4 rounded-xl print:hidden">
                <div className="flex gap-2">
                    <Button 
                        variant={tab === "internship" ? "default" : "outline"} 
                        onClick={() => setTab("internship")}
                        className="text-xs h-9"
                    >
                        Internship Certificate
                    </Button>
                    <Button 
                        variant={tab === "course" ? "default" : "outline"} 
                        onClick={() => setTab("course")}
                        className="text-xs h-9"
                    >
                        Course Certificate
                    </Button>
                    <Button 
                        variant={tab === "hackathon" ? "default" : "outline"} 
                        onClick={() => setTab("hackathon")}
                        className="text-xs h-9"
                    >
                        Hackathon Certificate
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={handleDownload} 
                        disabled={downloading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9"
                    >
                        <Download size={14} className="mr-1.5" />
                        {downloading ? "Generating PDF..." : "Download PDF"}
                    </Button>
                    <Button 
                        onClick={() => window.print()} 
                        variant="outline" 
                        className="text-xs h-9 border-slate-700"
                    >
                        <Printer size={14} className="mr-1.5" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Certificate Render */}
            <div className="w-full max-w-[1122px] flex justify-center shadow-2xl rounded-lg bg-transparent print:shadow-none print:rounded-none print:overflow-visible">
                {tab === "internship" && (
                    <InternshipCertificate 
                        studentName="Mohit Raj"
                        internshipRole="Full Stack (MERN) Development"
                        duration="2 Months"
                        startDate="11 Aug 2026"
                        endDate="09 Oct 2026"
                        certificateId="WS/INT/2026/08437"
                        certificateKey="SEC-8941-XYZ"
                    />
                )}
                {tab === "course" && (
                    <CourseCertificate 
                        studentName="Mohit Raj"
                        courseName="Full Stack (MERN) Development"
                        duration="2 Months"
                        startDate="11 Aug 2026"
                        endDate="09 Oct 2026"
                        certificateId="WS/CRS/2026/08437"
                        certificateKey="SEC-5521-ABC"
                        collaborations={[{ name: "Skill India", logo: "/assets/skill-india.png" }]}
                    />
                )}
                {tab === "hackathon" && (
                    <HackathonCertificate 
                        studentName="Mohit Raj"
                        hackathonName="National AI & Web3 Innovation Hackathon"
                        duration="48 Hours"
                        startDate="11 Aug 2026"
                        endDate="09 Oct 2026"
                        certificateId="WS/HCK/2026/08437"
                        certificateKey="SEC-1102-HCK"
                    />
                )}
            </div>

            {/* Print Styles */}
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
                    main, .container, .motion-wrapper, .certificate-wrapper, body > div {
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
