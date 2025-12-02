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
    duration: string;
    completedAt: string;
    certificateId: string;
    certificateKey?: string;
}

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();
    const [application, setApplication] = useState < Application | null > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const dashRes = await fetch(`/api/user/dashboard`);
                if (!dashRes.ok) {
                    alert("Failed to load application data");
                    router.push('/profile');
                    return;
                }

                const dashData = await dashRes.json();
                const fullApp = dashData.applications?.find((app: any) => app._id === id);

                if (!fullApp) {
                    alert("Application not found");
                    router.push('/profile');
                    return;
                }

                if (fullApp.status !== 'completed') {
                    alert("Certificate not available yet. Internship must be marked as completed.");
                    router.push('/profile');
                    return;
                }

                setApplication(fullApp);
                console.log("Certificate ID:", fullApp.certificateId);
                console.log("Full Application:", fullApp);
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

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-certificate/${application.certificateId}`;

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4">
            {/* Actions Bar */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-4">
                    <Button onClick={handlePrint} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Certificate Container */}
            <div className="max-w-4xl mx-auto bg-white text-black p-12 shadow-2xl relative overflow-hidden print:shadow-none print:w-full print:max-w-none" style={{ minHeight: '600px', border: '10px solid #1e293b' }}>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <Award size={600} />
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-blue-900"></div>
                <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-blue-900"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-blue-900"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-blue-900"></div>

                {/* Content */}
                <div className="relative z-10 text-center flex flex-col items-center justify-center h-full py-10">

                    {/* Header */}
                    <div className="mb-12">
                        <h4 className="text-2x1 font-serif text-right">Webory skill </h4>
                        <h1 className="text-5xl font-serif font-bold text-blue-900 mb-4 tracking-wider uppercase">Webory skill&apos;s </h1>
                        <h2 className="text-2xl font-light text-gray-600 uppercase tracking-widest">Certificate of Completion</h2>
                    </div>

                    {/* Body */}
                    <div className="mb-12 space-y-6 max-w-2xl">
                        <p className="text-xl text-gray-600">This is to certify that</p>

                        <h3 className="text-4xl font-bold text-blue-800 font-serif italic border-b-2 border-gray-300 pb-2 inline-block px-10">
                            {application.student?.firstName || 'Student'} {application.student?.lastName || 'Name'}
                        </h3>

                        <p className="text-xl text-gray-600 mt-6">   
                             has successfully completed the internship program as a
                        </p>

                        <h4 className="text-3xl font-bold text-gray-800 mt-2">
                            {application.internship?.title || 'Internship Position'}
                        </h4>

                        <p className="text-lg text-gray-600 mt-4">
                            at <strong>{application.internship?.company || 'Webory Skills'}</strong>
                        </p>

                        <div className="text-gray-600 mt-6 space-y-2">
                            <p>
                                <strong>Started:</strong> {application.startDate ? new Date(application.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                            </p>
                            <p>
                                <strong>Completed:</strong> {application.completedAt ? new Date(application.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p>
                                <strong> Course Duration:</strong> {application.duration || '3 months'}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-end mt-12 px-10">
                        <div className="text-center">
                            <div className="w-48 border-b-2 border-gray-400 mb-2"><samp className="font-cursive text-3xl text-blue-900 mb-1" >Webory Skills</samp>  </div>
                            <p className="text-gray-600 font-semibold">Institute</p>
                            <p className="text-gray-500 text-sm">
                                {application.completedAt ? new Date(application.completedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
                            </p>
                        </div>

                        <div className="text-center">
                            {/* QR Code for Verification */}
                            <div className="bg-white p-2 inline-block border-2 border-blue-900 rounded">
                                <QRCodeSVG
                                    value={verificationUrl}
                                    size={80}
                                    level="H"
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-2 font-semibold">Scan to Verify</p>
                            <p className="text-[10px] text-gray-400">ID: {application.certificateId || 'N/A'}</p>
                            {application.certificateKey && (
                                <p className="text-[8px] font-mono text-gray-400 mt-1">
                                    Key: {application.certificateKey}
                                </p>
                            )}
                        </div>

                        <div className="text-center">
                            <div className="font-cursive text-4xl text-blue-900 mb-1">MohitSinha </div>
                            <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
                            <p className="text-gray-600 font-semibold">Director</p>
                            <p className="text-gray-500 text-sm">Webory Skills</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
