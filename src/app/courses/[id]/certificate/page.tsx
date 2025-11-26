"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Award } from "lucide-react";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();

    const [certificateData, setCertificateData] = useState < any > (null);
    const [user, setUser] = useState < any > (null);
    const [course, setCourse] = useState < any > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch User
                const resAuth = await fetch("/api/auth/me");
                if (!resAuth.ok) {
                    router.push("/login");
                    return;
                }
                const userData = await resAuth.json();
                setUser(userData.user);

                // 2. Fetch Course
                const resCourse = await fetch(`/api/courses/${id}`);
                if (resCourse.ok) {
                    const data = await resCourse.json();
                    setCourse(data.course);
                }

                // 3. Fetch Eligibility
                const resCert = await fetch(`/api/courses/${id}/certificate-eligibility`);
                if (resCert.ok) {
                    const data = await resCert.json();
                    setCertificateData(data);

                    if (!data.isEligible) {
                        // If not eligible, redirect back to course page after a delay or show message
                        // For now, we'll just let the UI handle the "Not Eligible" state
                    }
                }
            } catch (error) {
                console.error("Failed to fetch certificate data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Loading certificate...</p>
            </div>
        );
    }

    if (!certificateData?.isEligible) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="bg-gray-900 p-8 rounded-2xl max-w-md text-center border border-gray-800">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="text-gray-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Certificate Locked</h1>
                    <p className="text-gray-400 mb-8">
                        You haven't met the requirements to unlock this certificate yet.
                        Please complete 100% of the videos and achieve an overall grade of 90%.
                    </p>
                    <Button onClick={() => router.back()} variant="outline">
                        Back to Course
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-4">
            {/* Controls */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
                <Button variant="ghost" onClick={() => router.back()} className="text-white">
                    <ArrowLeft className="mr-2" size={20} />
                    Back to Course
                </Button>
                <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Printer className="mr-2" size={20} />
                    Print Certificate
                </Button>
            </div>

            {/* Certificate Container */}
            <div className="bg-white text-black p-12 w-full max-w-4xl aspect-[1.414/1] shadow-2xl relative overflow-hidden print:shadow-none print:w-full print:h-screen print:absolute print:top-0 print:left-0 print:m-0">
                {/* Decorative Border */}
                <div className="absolute inset-4 border-4 border-double border-gray-800 pointer-events-none"></div>
                <div className="absolute inset-6 border border-gray-300 pointer-events-none"></div>

                {/* Corner Ornaments (CSS only) */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-yellow-600"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-yellow-600"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-yellow-600"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-yellow-600"></div>

                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center text-center relative z-10">

                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Award className="text-yellow-600" size={48} />
                            <span className="text-2xl font-bold tracking-widest uppercase text-gray-800">Webory Skill </span>
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">Certificate of Completion</h1>
                        <div className="w-32 h-1 bg-yellow-600 mx-auto"></div>
                    </div>

                    {/* Body */}
                    <div className="space-y-6 mb-12">
                        <p className="text-xl text-gray-600 italic">This is to certify that</p>

                        <h2 className="text-4xl font-bold text-blue-900 border-b-2 border-gray-200 pb-2 inline-block min-w-[300px]">
                            {user?.firstName} {user?.lastName}
                        </h2>

                        <p className="text-xl text-gray-600 italic">has successfully completed the course</p>

                        <h3 className="text-3xl font-bold text-gray-800">
                            {course?.title}
                        </h3>

                        <p className="text-lg text-gray-600">
                            with an overall grade of <span className="font-bold text-black">{certificateData.overallScore}%</span>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-end px-16 mt-8">
                        <div className="text-center">
                            <div className="w-48 border-b border-gray-400 mb-2 pb-1 font-signature text-2xl">
                                Webory Skill Team
                            </div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Instructor</p>
                        </div>

                        <div className="text-center">
                            <div className="w-32 h-32 relative flex items-center justify-center">
                                {/* Seal */}
                                <div className="absolute inset-0 border-4 border-yellow-600 rounded-full opacity-20"></div>
                                <div className="absolute inset-2 border-2 border-yellow-600 rounded-full opacity-40"></div>
                                <Award className="text-yellow-600 opacity-80" size={74} />
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="w-48 border-b border-gray-400 mb-2 pb-1">
                                {new Date().toLocaleDateString()}
                            </div>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Date</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        background: white;
                    }
                }
                .font-signature {
                    font-family: 'Brush Script MT', cursive;
                }
            `}</style>
        </div>
    );
}
