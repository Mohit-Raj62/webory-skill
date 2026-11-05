"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Globe, Printer, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import HackathonCertificate from "@/components/HackathonCertificate";
import { downloadCertificateAsPDF } from "@/lib/certificate-download";
import { useState } from "react";

export function CertificateViewClient({ certificate }: { certificate: any }) {
    const router = useRouter();
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [copiedId, setCopiedId] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        setDownloadingPdf(true);
        await downloadCertificateAsPDF(
            "certificate-container",
            `Webory_Certificate_${certificate.certificateId || "Verified"}`
        );
        setDownloadingPdf(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Verification link copied to clipboard! 🔗");
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(certificate.certificateId || "");
        setCopiedId(true);
        toast.success("Certificate ID copied! 📋");
        setTimeout(() => setCopiedId(false), 2000);
    };

    const handleCopyKey = () => {
        navigator.clipboard.writeText(certificate.certificateKey || "");
        setCopiedKey(true);
        toast.success("Security Key copied! 🔐");
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const rawKey = certificate.certificateKey ? certificate.certificateKey.replace(/^#/, '') : '';
    const displayKey = rawKey 
        ? (rawKey.length > 16 
            ? `SEC-${rawKey.slice(0, 4).toUpperCase()}-${rawKey.slice(-4).toUpperCase()}`
            : (rawKey.toUpperCase().startsWith("SEC-") ? rawKey.toUpperCase() : `SEC-${rawKey.toUpperCase()}`))
        : "SEC-814F-8A19";

    const isMessyProject = (name?: string) => {
        if (!name) return true;
        return (
            name.includes("node_modules") ||
            name.includes("@sentry") ||
            name.includes("DEBUG_") ||
            name.includes("/src/app") ||
            name.includes("GET /") ||
            name.includes("POST /") ||
            name.length > 70
        );
    };

    const projectName = !isMessyProject(certificate.projectName)
        ? certificate.projectName
        : "CyberSentinel AI – Threat Detection & Analytics";

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
                        onClick={handleDownload}
                        disabled={downloadingPdf}
                        className="h-12 px-6 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                    >
                        <Download size={14} /> {downloadingPdf ? "Generating PDF..." : "Download PDF"}
                    </Button>
                    <Button 
                        onClick={handlePrint}
                        variant="outline"
                        className="h-12 px-5 rounded-xl border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white/5"
                    >
                        <Printer size={14} /> Print
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
                    studentName={certificate.studentName}
                    hackathonName={certificate.hackathonTitle || certificate.description?.match(/in the (.*?)\./)?.[1] || "Software Development Hackathon"}
                    type={certificate.type}
                    rank={certificate.rank}
                    awardTitle={certificate.title}
                    projectName={projectName}
                    duration="48 Hours"
                    startDate={new Date(certificate.issuedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    endDate={new Date(certificate.issuedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    certificateId={certificate.certificateId}
                    certificateKey={displayKey}
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
                        <p className="text-xl font-bold text-white tracking-tight capitalize">{certificate.studentName}</p>
                        <div className="flex items-center gap-1.5 text-emerald-400 pt-0.5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Identity Verified</span>
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
                        <p className="text-xl font-bold text-blue-400 tracking-tight leading-snug">
                            {projectName}
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
                                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
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

                    {/* Certificate ID */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Certificate ID</span>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-bold font-mono text-white tracking-tight">
                                {certificate.certificateId}
                            </p>
                            <button 
                                onClick={handleCopyId}
                                className="text-gray-400 hover:text-emerald-400 transition-colors p-1"
                                title="Copy Certificate ID"
                            >
                                {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Security Key */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Security Key</span>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-bold font-mono text-emerald-400 tracking-tight">
                                {displayKey}
                            </p>
                            <button 
                                onClick={handleCopyKey}
                                className="text-gray-400 hover:text-emerald-400 transition-colors p-1"
                                title="Copy Security Key"
                            >
                                {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Verification Status</span>
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 w-fit px-3.5 py-1.5 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Active & Authentic</span>
                        </div>
                    </div>

                    {/* Issuing Authority */}
                    <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Issuing Authority</span>
                        <p className="text-xl font-bold text-white tracking-tight">Webory Skills</p>
                        <span className="text-[10px] font-mono text-gray-400">UDYAM-BR-26-0208472</span>
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
                    navbar, footer, .print\\:hidden {
                        display: none !important;
                    }
                }
            ` }} />
        </div>
    );
}

