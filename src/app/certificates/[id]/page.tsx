import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { CertificateViewClient } from "@/components/certificates/CertificateViewClient";
import dbConnect from "@/lib/db";
import CustomCertificate from "@/models/CustomCertificate";
import HackathonSubmission from "@/models/HackathonSubmission";
import "@/models/Hackathon"; // Ensure Hackathon model is registered
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

const getCachedCertificate = unstable_cache(
    async (id: string) => {
        await dbConnect();
        const certificate = await CustomCertificate.findOne({ certificateId: id }).lean();

        if (!certificate) return null;

        // Always try to find the HackathonSubmission to get latest signatures & collaborations
        const submission = await HackathonSubmission.findOne({ certificateId: certificate._id })
            .populate("hackathonId", "title theme collaborations signatures")
            .lean();
        
        if (submission) {
            certificate.projectName = certificate.projectName || submission.projectName;
            certificate.hackathonTitle = certificate.hackathonTitle || (submission.hackathonId as any)?.title;
            certificate.domain = certificate.domain || (submission.hackathonId as any)?.theme;
            certificate.rank = certificate.rank || submission.rank;
            certificate.type = certificate.type || (submission.status === "winner" ? "winner" : "participant");
            certificate.studentName = certificate.studentName || submission.teamName;
            
            // Populate collaborations and signatures from Hackathon
            const hackathon = submission.hackathonId as any;
            if (hackathon) {
                certificate.collaborations = certificate.collaborations?.length ? certificate.collaborations : hackathon.collaborations;
                certificate.signatures = certificate.signatures || hackathon.signatures;
            }
        }

        return JSON.parse(JSON.stringify(certificate));
    },
    ['public-certificate'],
    { revalidate: 3600, tags: ['certificates'] }
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const certificate = await getCachedCertificate(id);

    if (!certificate) {
        return { title: "Invalid Certificate - Webory Skills" };
    }

    const hackTitle = (certificate as any).hackathonTitle || (certificate as any).title || "Webory Hackathon";

    return {
        title: `Verified Certificate for ${certificate.studentName} - Webory Skills`,
        description: `Verified credential for completion of ${hackTitle} at Webory Skills.`,
        openGraph: {
            images: [`/api/certificates/${id}/og`],
        }
    };
}

export default async function PublicCertificateView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const certificate = await getCachedCertificate(id);

    if (!certificate) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white p-6 text-center">
                <ShieldCheck size={64} className="text-red-500 mb-6 opacity-20" />
                <h1 className="text-3xl font-black uppercase mb-2">Invalid Certificate</h1>
                <p className="text-gray-500 max-w-md">This credential could not be verified. Please ensure the link is correct or contact support.</p>
                <Link href="/">
                    <Button className="mt-8 bg-white text-black font-black px-8 rounded-xl h-12 hover:bg-gray-200">
                        Return to Webory
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] relative">
            <Navbar />
            <CertificateViewClient certificate={certificate} />
            <Footer className="print:hidden" />
        </main>
    );
}
