"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Github, Linkedin, Mail, Award, Briefcase, Code, ExternalLink, Rocket, FileText, ChevronRight, Globe, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

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
        courseThumbnail: string;
        completedAt: string;
    }[];
    internships: {
        id: string;
        title: string;
        company: string;
        status: string;
        startDate: string;
        duration: string;
    }[];
    projects: {
        id: string;
        title: string;
        description: string;
        courseTitle: string;
        submissionUrl: string;
        submissionText: string;
    }[];
    proofOfWork: {
        id: string;
        title: string;
        language: string;
        subdomain: string;
        deploymentUrl: string;
        caseStudy: string;
    }[];
}

export default function PortfolioPage() {
    const params = useParams();
    const [data, setData] = useState < PortfolioData | null > (null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/portfolio/${params.id}`);
                const json = await res.json();
                if (res.ok) {
                    setData(json.portfolio);
                } else {
                    setError(json.error || "Failed to load portfolio");
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <h1 className="text-2xl font-bold text-red-500">Error</h1>
                <p className="text-gray-400">{error || "Portfolio not found"}</p>
                <Button onClick={() => window.location.href = '/'} variant="outline">Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
                <div className="container mx-auto max-w-5xl relative z-10 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-300">
                            {data.user.avatar ? (
                                <img src={data.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                data.user.firstName[0]
                            )}
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {data.user.firstName} {data.user.lastName}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        {data.user.bio || "Passionate learner and developer building the future with code."}
                    </p>

                    <div className="flex justify-center gap-4">
                        <a href={`mailto:${data.user.email}`} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                            <Mail size={24} />
                        </a>
                        {data.user.github && (
                            <a href={data.user.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                                <Github size={24} />
                            </a>
                        )}
                        {data.user.linkedin && (
                            <a href={data.user.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                                <Linkedin size={24} />
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl px-6 py-12 space-y-24">
                {/* Skills Section */}
                {data.user.skills.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Code className="text-blue-500" /> Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {data.user.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/20 transition-colors cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Proof of Work (Live Projects) Section */}
                {data.proofOfWork && data.proofOfWork.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Rocket className="text-blue-500" /> Proof of Work
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.proofOfWork.map((pow) => (
                                <div key={pow.id} className="group relative bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <Globe size={24} className="text-blue-400 group-hover:text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                                        {pow.title}
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{pow.language}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <a 
                                                    href={pow.deploymentUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                                    title="View Live Site"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                                            Live project deployed via Webory DevLab on <span className="text-blue-500 font-mono">{pow.subdomain}.weboryskills.in</span>
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="flex-1 rounded-xl border-white/10 hover:bg-white/5 text-xs font-bold gap-2">
                                                        <FileText size={14} /> View Case Study
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[#0d1117] border-[#30363d] text-white max-w-3xl max-h-[80vh] overflow-y-auto scrollbar-hide">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-3 text-2xl">
                                                            <Sparkles className="text-yellow-500" /> AI Generated Case Study
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="prose prose-invert prose-blue max-w-none mt-6">
                                                        <ReactMarkdown>{pow.caseStudy}</ReactMarkdown>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            
                                            <a 
                                                href={pow.deploymentUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                Visit App <ChevronRight size={14} />
                                            </a>
                                        </div>
                                    </div>
                                    
                                    {/* Accent line */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Section */}
                {data.projects.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Briefcase className="text-purple-500" /> Projects
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {data.projects.map((project) => (
                                <div key={project.id} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">{project.courseTitle}</p>
                                        </div>
                                        {project.submissionUrl && (
                                            <a href={project.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                        {project.description || "A project built during the course."}
                                    </p>
                                    {project.submissionText && (
                                        <div className="text-xs text-gray-500 bg-black/30 p-3 rounded-lg font-mono truncate">
                                            {project.submissionText}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience / Internships Section */}
                {data.internships.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Briefcase className="text-green-500" /> Experience
                        </h2>
                        <div className="space-y-6">
                            {data.internships.map((internship) => (
                                <div key={internship.id} className="relative pl-8 border-l-2 border-white/10 pb-8 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <h3 className="text-xl font-bold text-white">{internship.title}</h3>
                                    <p className="text-green-400 font-medium mb-1">{internship.company}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                        <span>{internship.duration}</span>
                                        <span>•</span>
                                        <span className="capitalize">{internship.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates Section */}
                {data.certificates.length > 0 && (
                    <section>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <Award className="text-yellow-500" /> Certifications
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {data.certificates.map((cert) => (
                                <div key={cert.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-yellow-500/10 transition-all">
                                    <div className="aspect-video bg-gray-800 relative">
                                        {cert.courseThumbnail ? (
                                            <img src={cert.courseThumbnail} alt={cert.courseTitle} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <Award size={40} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-white line-clamp-1 mb-1">{cert.courseTitle}</h3>
                                        <p className="text-xs text-gray-500">
                                            Issued: {new Date(cert.completedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
                <p>Generated by Webory Skills Portfolio Builder</p>
            </footer>
        </div>
    );
}
