"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HackathonCertificate from "@/components/HackathonCertificate";
import { Button } from "@/components/ui/button";
import { 
    Download, 
    Share2, 
    CheckCircle2, 
    ArrowLeft, 
    Loader2,
    ShieldCheck,
    Globe
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PublicCertificateView() {
    const { id } = useParams();
    const router = useRouter();
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificate();
    }, [id]);

    const fetchCertificate = async () => {
        try {
            const res = await fetch(`/api/certificates/${id}`);
            const data = await res.json();
            if (res.ok) {
                setCertificate(data.data);
            } else {
                toast.error("Certificate not found or invalid.");
            }
        } catch (error) {
            toast.error("Verification server error.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Verification link copied to clipboard! 🔗");
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    if (!certificate) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white p-6 text-center">
                <ShieldCheck size={64} className="text-red-500 mb-6 opacity-20" />
                <h1 className="text-3xl font-black uppercase mb-2">Invalid Certificate</h1>
                <p className="text-gray-500 max-w-md">This credential could not be verified. Please ensure the link is correct or contact support.</p>
                <Button onClick={() => router.push("/")} className="mt-8 bg-white text-black font-black px-8 rounded-xl h-12 hover:bg-gray-200">
                    Return to Webory
                </Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] relative">
            <Navbar />
            
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
                {/* Verification Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl print:hidden">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl font-black uppercase tracking-tight">Verified Credential</h1>
                                <CheckCircle2 size={16} className="text-emerald-500" />
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
                    className="shadow-[0_0_100px_rgba(37,99,235,0.1)] rounded-[2rem] overflow-hidden"
                >
                    <HackathonCertificate 
                        type={certificate.type}
                        studentName={certificate.studentName}
                        hackathonTitle={certificate.hackathonTitle}
                        projectName={certificate.projectName}
                        rank={certificate.rank}
                        issueDate={certificate.issuedAt}
                        certificateId={certificate.certificateId}
                    />
                </motion.div>

                {/* Print Styles */}
                <style jsx global>{`
                    @media print {
                        body { background: white !important; }
                        main { padding: 0 !important; }
                        .container { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
                        .print\:hidden { display: none !important; }
                        footer { display: none !important; }
                        .certificate-container { 
                            box-shadow: none !important; 
                            border: 8px double #eee !important;
                            max-width: 100% !important;
                            width: 100% !important;
                            margin: 0 !important;
                            transform: scale(0.9) !important;
                        }
                    }
                `}</style>
            </div>

            <Footer className="print:hidden" />
        </main>
    );
}
