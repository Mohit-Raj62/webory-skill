"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Printer } from "lucide-react";
import InternshipCertificate from "@/components/certificates/InternshipCertificate";

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
    collaboration?: string;
    collaborations?: { name: string, logo?: string }[];
    signatures?: {
        founder: { name: string, title: string },
        director: { name: string, title: string, credential?: string },
        partner: { name: string, title: string },
    };
}

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();

    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplication = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/internships/applications/${id}/certificate`);
                const data = await res.json();
                
                if (!res.ok) {
                    console.error("API Error:", data);
                    setError(data.error || "Failed to load certificate data");
                    return;
                }

                if (data.status !== 'completed') {
                    setError("Certificate not available yet. Your internship must be marked as 'Completed' by the administrator.");
                    return;
                }

                setApplication(data);
            } catch (err: any) {
                console.error("Fetch Error:", err);
                setError("A network error occurred. Please check your connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchApplication();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-sm animate-pulse text-gray-400 uppercase tracking-widest">Verifying Certificate Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <Award className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Document Unavailable</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {error}
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6 rounded-xl"
                        >
                            Retry Loading
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => router.push('/profile')} 
                            className="w-full text-gray-400 hover:text-white"
                        >
                            Back to Profile
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!application) return null;

    const formattedStartDate = application.startDate 
        ? new Date(application.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : (application.appliedAt ? new Date(application.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A');

    const formattedEndDate = application.completedAt 
        ? new Date(application.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
        : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    let collabs = application.internship?.collaborations || [];
    if (collabs.length === 0 && application.internship?.collaboration) {
        collabs = [{ name: application.internship.collaboration }];
    }

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 print:p-0 print:bg-white print:overflow-hidden">
            {/* Actions Bar */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-4">
                    <Button onClick={handlePrint} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>

            <InternshipCertificate 
                studentName={`${application.student?.firstName || 'Student'} ${application.student?.lastName || 'Name'}`}
                internshipRole={application.internship?.title || 'Internship Position'}
                duration={application.duration || '3 months'}
                startDate={formattedStartDate}
                endDate={formattedEndDate}
                certificateId={application.certificateId}
                collaborations={collabs}
                signatures={application.internship?.signatures}
            />
            
            <style jsx global>{`
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
                    html, body {
                        width: 100%;
                        height: 100vh;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }
                    @media print {
                        body {
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }
                    }
                    #certificate-container {
                        visibility: visible;
                        position: relative !important;
                        left: auto !important;
                        top: auto !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 9999;
                        overflow: hidden;
                        box-shadow: none;
                        background: white;
                        border: none;
                        width: 1122px !important;
                        height: 794px !important;
                        transform-origin: center center !important;
                    }
                    @media print and (orientation: portrait) {
                        @page {
                            size: portrait;
                            margin: 0; 
                        }
                        #certificate-container {
                            position: relative !important;
                            top: 0 !important;
                            left: 0 !important;
                            transform: scale(0.8) !important;
                            transform-origin: top left !important;
                            left: 50% !important;
                            margin-left: -449px !important; 
                            margin-top: 20px;
                        }
                    }
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
                     #certificate-container * {
                        visibility: visible;
                    }
                    svg text {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
}
