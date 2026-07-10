"use client";

import InternshipCertificate from "@/components/certificates/InternshipCertificate";

export default function CertificatePreviewPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
            <div className="w-full max-w-[1200px] overflow-auto border-4 border-slate-700 rounded-xl">
                <InternshipCertificate />
            </div>
        </div>
    );
}
