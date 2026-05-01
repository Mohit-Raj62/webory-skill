"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import HackathonCertificate from "@/components/HackathonCertificate";

export function CertificateViewClient({ certificate }: { certificate: any }) {
    const router = useRouter();

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Verification link copied to clipboard! 🔗");
    };

    return (
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
            {/* Verification Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl print:hidden">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black uppercase tracking-tight">Verified Credential</h1>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Digital Certificate ID: {certificate.certificateId}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                    <Button 
                        onClick={handlePrint}
                        className="h-12 px-6 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-gray-200"
                    >
                        <Download size={14} /> Download PDF
                    </Button>
                    <Button 
                        onClick={handleShare}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white/5"
                    >
                        <Share2 size={14} /> Share Link
                    </Button>
                    <Button 
                        onClick={() => router.push("/hackathons")}
                        variant="ghost"
                        className="h-12 px-6 text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px]"
                    >
                        <Globe size={14} className="mr-2" /> Arena
                    </Button>
                </div>
            </div>

            {/* Certificate Render */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="motion-wrapper shadow-[0_0_100px_rgba(37,99,235,0.1)] rounded-[2rem] overflow-hidden print:overflow-visible print:shadow-none print:rounded-none mb-12"
            >
                <HackathonCertificate 
                    type={certificate.type || (certificate.title?.toLowerCase().includes('champion') ? 'winner' : 'participant')}
                    studentName={certificate.studentName}
                    hackathonTitle={certificate.hackathonTitle || certificate.description?.match(/in the (.*?)\./)?.[1] || "Software Development Hackathon"}
                    projectName={certificate.projectName || certificate.description?.split("Project: ")[1] || "Open Innovation Project"}
                    rank={certificate.rank || (certificate.title?.match(/(\d+)/)?.[0] ? parseInt(certificate.title.match(/(\d+)/)![0]) : 0)}
                    issueDate={certificate.issuedAt}
                    certificateId={certificate.certificateId}
                    domain={certificate.domain || "Skills Hackathon"}
                    college={certificate.college}
                    collaborations={certificate.collaborations}
                    signatures={certificate.signatures}
                />
            </motion.div>

            {/* Official Verification Details - THE SOURCE OF TRUTH */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-xl print:hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1.5 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white">Official Verification Record</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
                    {/* Student Name */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Verified Candidate</span>
                        <p className="text-xl font-bold text-white tracking-tight">{certificate.studentName}</p>
                        <div className="flex items-center gap-1.5 text-emerald-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                            <span className="text-[10px] font-bold uppercase">Identity Verified</span>
                        </div>
                    </div>

                    {/* Hackathon Title */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Event / Competition</span>
                        <p className="text-xl font-bold text-white tracking-tight">
                            {certificate.hackathonTitle || "Webory Skills Hackathon"}
                        </p>
                    </div>

                    {/* Project Name */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Project Title</span>
                        <p className="text-xl font-bold text-blue-400 tracking-tight">
                            {certificate.projectName || "Official Submission"}
                        </p>
                    </div>

                    {/* Credential Type */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Credential Type</span>
                        <div className="flex items-center gap-2">
                            <p className="text-xl font-bold text-white tracking-tight capitalize">
                                {certificate.type === 'winner' ? 'Excellence Award' : 'Completion Award'}
                            </p>
                            {certificate.rank > 0 && (
                                <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                    Rank #{certificate.rank}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Issue Date */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Date of Issuance</span>
                        <p className="text-xl font-bold text-white tracking-tight">
                            {new Date(certificate.issuedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Verification Status</span>
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 w-fit px-4 py-2 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Active & Authentic</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-[10px] font-medium max-w-xl text-center md:text-left leading-relaxed">
                        This digital record is securely stored on Webory Skills servers and serves as the primary source of truth for this credential. Any discrepancy between this record and the visual certificate should be reported to support@weboryskills.in.
                    </p>
                    <div className="flex items-center gap-2 opacity-50 grayscale">
                         <span className="text-[10px] font-black text-white uppercase tracking-tighter">Powered by Webory Verification Engine</span>
                    </div>
                </div>
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
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 297mm !important;
                        height: 210mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 9999999 !important;
                        background: white !important;
                        transform: scale(1) !important;
                        transform-origin: top left !important;
                        display: flex !important;
                        flex-direction: column !important;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                        visibility: visible !important;
                    }
                    /* Ensure parents are not display:none but content is hidden */
                    main, .container, .motion-wrapper {
                        display: block !important;
                        visibility: hidden !important;
                        height: auto !important;
                        width: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible !important;
                    }
                    /* Force hide other specific non-parents */
                    navbar, footer, .print\\:hidden {
                        display: none !important;
                    }
                }
            ` }} />
        </div>
    );
}
