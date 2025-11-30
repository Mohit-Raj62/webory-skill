"use client";

import { useEffect, useState } from "react";
import { Loader2, Download, Printer, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PortfolioData {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        bio: string;
        skills: string[];
        avatar?: string;
        linkedin?: string;
        github?: string;
    };
    certificates: {
        id: string;
        courseTitle: string;
        completedAt: string;
    }[];
    internships: {
        id: string;
        title: string;
        company: string;
        startDate: string;
        duration: string;
    }[];
    projects: {
        id: string;
        title: string;
        description: string;
        submissionUrl: string;
    }[];
}

export default function ResumePage() {
    const [data, setData] = useState < PortfolioData | null > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/portfolio"); // Fetch logged-in user's data
                const json = await res.json();
                if (res.ok) {
                    setData(json.portfolio);
                } else {
                    toast.error("Failed to load resume data");
                }
            } catch (err) {
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin text-gray-500" size={32} />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
            {/* Toolbar - Hidden in Print */}
            <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center print:hidden">
                <h1 className="text-2xl font-bold text-gray-800">Resume Preview</h1>
                <Button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Printer size={18} /> Print / Save as PDF
                </Button>
            </div>

            {/* Resume A4 Page */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none min-h-[297mm] p-[20mm] text-gray-800 font-serif leading-relaxed">

                {/* Header */}
                <header className="border-b-2 border-gray-800 pb-6 mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
                        {data.user.firstName} {data.user.lastName}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Mail size={14} /> {data.user.email}
                        </div>
                        {data.user.linkedin && (
                            <div className="flex items-center gap-1">
                                <Linkedin size={14} /> {data.user.linkedin}
                            </div>
                        )}
                        {data.user.github && (
                            <div className="flex items-center gap-1">
                                <Github size={14} /> {data.user.github}
                            </div>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {data.user.bio && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
                        <p className="text-sm text-gray-700">{data.user.bio}</p>
                    </section>
                )}

                {/* Skills */}
                {data.user.skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.user.skills.map((skill, i) => (
                                <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded print:bg-transparent print:p-0 print:mr-2">
                                    {skill}{i < data.user.skills.length - 1 ? "," : ""}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {data.internships.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Experience</h2>
                        <div className="space-y-4">
                            {data.internships.map((internship) => (
                                <div key={internship.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold">{internship.title}</h3>
                                        <span className="text-sm text-gray-600">{internship.duration}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">{internship.company}</div>
                                    {/* Add description if available in future */}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Projects</h2>
                        <div className="space-y-4">
                            {data.projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold">{project.title}</h3>
                                        {project.submissionUrl && (
                                            <a href={project.submissionUrl} className="text-sm text-blue-600 underline print:text-black print:no-underline">
                                                Link
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education / Certifications */}
                {data.certificates.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Certifications</h2>
                        <div className="space-y-2">
                            {data.certificates.map((cert) => (
                                <div key={cert.id} className="flex justify-between text-sm">
                                    <span className="font-medium">{cert.courseTitle}</span>
                                    <span className="text-gray-600">{new Date(cert.completedAt).getFullYear()}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}
