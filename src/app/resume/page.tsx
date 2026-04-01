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
        twitter?: string;
        website?: string;
        phone?: string;
    };
    certificates: {
        id: string;
        courseTitle: string;
        completedAt: string;
    }[];
    education: {
        id: string;
        degree: string;
        institution: string;
        startDate: string;
        endDate: string;
        current: boolean;
        learnings?: string;
        achievements?: string;
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
        technologies?: string[];
    }[];
    hackathons: {
        id: string;
        title: string;
        projectName: string;
        description: string;
        role: string;
        date: string;
        type: 'internal' | 'external';
        status?: string;
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

    const sanitizeDescription = (text: string) => {
        if (!text) return "";
        // If text looks like a log dump (contains node_modules or common debug strings)
        if (text.includes("node_modules") || text.includes("DEBUG_SUBMISSION") || text.includes("GET /") || text.includes("POST /")) {
            return "Developed an innovative project during the competition focused on solving real-world challenges.";
        }
        return text;
    };

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
        <div className="min-h-screen bg-neutral-50 py-12 px-4 print:p-0 print:bg-white">
            {/* Control Bar - Hidden in Print */}
            <div className="max-w-[210mm] mx-auto mb-10 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-neutral-200 print:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Printer size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-neutral-900 leading-tight">Professional Resume</h1>
                        <p className="text-xs text-neutral-500 font-medium tracking-tight">FAANG-Ready • ATS Optimized</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handlePrint} className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold flex items-center gap-2">
                        <Download size={16} /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Resume A4 Page Content */}
            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[297mm] p-[15mm] md:p-[20mm] text-neutral-900 font-sans leading-normal selection:bg-blue-50">

                {/* Professional Header - Elite Center Aligned */}
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase selection:text-blue-600">
                        {data.user.firstName} {data.user.lastName}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs font-medium text-neutral-600">
                        <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">{data.user.email}</span>
                        {data.user.phone && (
                             <>
                                <span className="text-neutral-300">•</span>
                                <span className="hover:text-blue-600 transition-colors cursor-pointer">{data.user.phone}</span>
                             </>
                        )}
                        {data.user.linkedin && (
                            <>
                                <span className="text-neutral-300">•</span>
                                <a href={data.user.linkedin} target="_blank" className="hover:text-blue-600 transition-colors">LinkedIn</a>
                            </>
                        )}
                        {data.user.github && (
                            <>
                                <span className="text-neutral-300">•</span>
                                <a href={data.user.github} target="_blank" className="hover:text-blue-600 transition-colors">GitHub</a>
                            </>
                        )}
                    </div>
                    {data.user.bio && (
                        <p className="mt-4 text-xs text-neutral-500 max-w-2xl mx-auto leading-relaxed border-t border-neutral-100 pt-4">
                            {data.user.bio}
                        </p>
                    )}
                </header>

                <div className="space-y-8">
                    {/* Education Section */}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-neutral-200 pb-1.5 mb-4">
                                Education
                            </h2>
                            <div className="space-y-5">
                                {data.education.map((edu) => (
                                    <div key={edu.id} className="group">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-bold text-sm text-neutral-900">{edu.institution}</h3>
                                            <span className="text-[10px] font-bold text-neutral-400 tabular-nums">
                                                {new Date(edu.startDate).getFullYear()} — {edu.current ? "Present" : new Date(edu.endDate).getFullYear()}
                                            </span>
                                        </div>
                                        <div className="text-[11px] italic text-neutral-600 mb-2">{edu.degree}</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {edu.learnings && (
                                                <div className="text-[11px] text-neutral-500 border-l-2 border-neutral-100 pl-3 py-0.5 italic">
                                                    {edu.learnings}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skill Matrix - Professional Categories */}
                    {data.user.skills.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-neutral-200 pb-1.5 mb-3">
                                Technical Skills
                            </h2>
                            <div className="text-[11px] grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5">
                                <span className="font-bold text-neutral-700 capitalize">Core Technologies:</span>
                                <p className="text-neutral-600">{data.user.skills.join(", ")}</p>
                            </div>
                        </section>
                    )}

                    {/* Hackathons - Compact Achievement Format */}
                    {data.hackathons && data.hackathons.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-neutral-200 pb-1.5 mb-3">
                                Hackathons & Achievements
                            </h2>
                            <div className="space-y-3">
                                {data.hackathons.map((hack) => (
                                    <div key={hack.id}>
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-bold text-[13px] text-neutral-900 uppercase tracking-tight">
                                                {hack.title} 
                                                {hack.role && hack.role !== 'Participant' && (
                                                    <>
                                                        <span className="text-neutral-300 mx-1">|</span> 
                                                        <span className="text-neutral-500 font-medium">{hack.role}</span>
                                                    </>
                                                )}
                                                {hack.status === 'winner' && (
                                                    <span className="ml-2 text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-tighter">
                                                        Winner • Credential Awarded
                                                    </span>
                                                )}
                                            </h3>
                                            <span className="text-[10px] font-bold text-neutral-400 tabular-nums uppercase">
                                                {new Date(hack.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Work Experience */}
                    {data.internships.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-neutral-200 pb-1.5 mb-4">
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {data.internships.map((intern) => (
                                    <div key={intern.id}>
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-bold text-sm text-neutral-900">{intern.company}</h3>
                                            <span className="text-[10px] font-bold text-neutral-400 tabular-nums uppercase">
                                                {intern.duration}
                                            </span>
                                        </div>
                                        <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                                            {intern.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Key Projects */}
                    {data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-neutral-200 pb-1.5 mb-4">
                                Technical Projects
                            </h2>
                        <div className="space-y-2.5">
                            {data.projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-bold text-[12px] text-neutral-900 uppercase tracking-tight">{project.title}</h3>
                                        {project.submissionUrl && (
                                            <a href={project.submissionUrl} target="_blank" className="text-[9px] font-bold text-blue-600 uppercase tracking-widest underline underline-offset-2">
                                                Link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        </section>
                    )}

                    {/* Academic Certifications */}
                    {data.certificates.length > 0 && (
                        <section>
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 border-b border-neutral-200 pb-1.5 mb-3">
                                Certifications
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.certificates.map((cert) => (
                                    <span key={cert.id} className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded uppercase tracking-tight">
                                        {cert.courseTitle}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page {
                        margin: 0;
                        size: A4 portrait;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .bg-neutral-50 {
                        background: white !important;
                    }
                    .shadow-2xl {
                        box-shadow: none !important;
                    }
                }
            ` }} />
        </div>
    );
}
