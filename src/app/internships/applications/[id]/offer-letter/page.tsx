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
    duration: string;
    appliedAt: string;
}

export default function OfferLetterPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState < OfferLetterData | null > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfferLetter = async () => {
            try {
                console.log("=== FETCHING OFFER LETTER ===");
                console.log("Application ID:", params.id);

                const res = await fetch(`/api/internships/applications/${params.id}/offer-letter`);
                console.log("Response status:", res.status);

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    console.error("API Error Response:", errorData);
                    throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch offer letter`);
                }

                const offerData = await res.json();
                console.log("Offer letter data received:", offerData);
                setData(offerData);
            } catch (error: any) {
                console.error("=== OFFER LETTER ERROR ===");
                console.error("Error object:", error);
                console.error("Error message:", error.message);
                console.error("Error name:", error.name);
                console.error("Application ID:", params.id);
                console.error("========================");

                alert(`Error: ${error.message || "Unknown error"}\n\nApplication ID: ${params.id}\n\nPlease check:\n1. Application exists in database\n2. You are logged in\n3. This is your application`);
                router.push("/profile");
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading offer letter...</div>
            </div>
        );
    }

    if (!data) return null;

    const formattedDate = new Date(data.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const todayDate = new Date().toLocaleDateString("en-IN", {
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
            <div className="max-w-4xl mx-auto p-8 print:p-12 bg-white text-black min-h-screen">
                {/* Company Header */}
                <div className="text-center mb-8 border-b-2 border-blue-600 pb-4">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">
                        {data.internship.company}
                    </h1>
                    <p className="text-sm text-gray-600">WEBORY SKILL's Platform</p>
                    <p className="text-xs text-gray-500">{data.internship.location}</p>
                </div>

                {/* Date */}
                <div className="text-right mb-6">
                    <p className="text-sm">Date: {todayDate}</p>
                </div>

                {/* Student Address */}
                <div className="mb-6">
                    <p className="font-semibold">
                        {data.student.firstName} {data.student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{data.student.email}</p>
                </div>

                {/* Subject */}
                <div className="mb-6">
                    <p className="font-bold">
                        Subject: Offer Letter for {data.internship.title}
                    </p>
                </div>

                {/* Body */}
                <div className="space-y-4 mb-8">
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
                    <div className="my-6 border border-gray-300 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 bg-gray-50 font-semibold w-1/3">Position</td>
                                    <td className="p-3">{data.internship.title}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 bg-gray-50 font-semibold">Company</td>
                                    <td className="p-3">{data.internship.company}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 bg-gray-50 font-semibold">Location</td>
                                    <td className="p-3">{data.internship.location}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 bg-gray-50 font-semibold">Type</td>
                                    <td className="p-3">{data.internship.type}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 bg-gray-50 font-semibold">Duration</td>
                                    <td className="p-3">{data.duration}</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="p-3 bg-gray-50 font-semibold">Start Date</td>
                                    <td className="p-3">{formattedDate}</td>
                                </tr>
                                <tr>
                                    <td className="p-3 bg-gray-50 font-semibold">Stipend</td>
                                    <td className="p-3">{data.internship.stipend}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        Please confirm your acceptance of this offer by replying to this letter at your
                        earliest convenience.
                    </p>

                    <p>
                        We look forward to working with you and wish you all the best for your
                        internship journey!
                    </p>
                </div>

                {/* Signature */}
                <div className="mt-12 flex justify-between items-end">
                    <div>
                        <p className="mb-4">Sincerely,</p>
                        <div className="mb-2">
                            {/* Digital Signature */}
                            <p className="text-2xl text-blue-800 font-cursive transform -rotate-2" style={{ fontFamily: '"Great Vibes", "Brush Script MT", cursive' }}>
                                Mohit Sinha
                            </p>
                        </div>
                        <div className="border-t border-gray-400 w-48 pt-2">
                            <p className="font-bold text-gray-800">Authorized Signatory</p>
                            <p className="text-sm text-gray-600">HR Department</p>
                            <p className="text-sm text-gray-600">{data.internship.company}</p>
                        </div>
                    </div>

                    {/* Optional: Company Stamp/Seal placeholder */}
                    <div className="opacity-80 transform rotate-12 border-4 border-blue-800 rounded-full w-32 h-32 flex items-center justify-center p-2 text-center text-blue-800 font-bold text-xs uppercase tracking-widest hidden print:flex">
                        <div className="border border-blue-800 rounded-full w-full h-full flex items-center justify-center">
                            {data.internship.company}
                            <br />
                            Official Seal
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    <p>This is a system-generated offer letter from WEBORY SKILL's Platform</p>
                </div>
            </div>
        </div>
    );
}
