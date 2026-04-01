"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Github, Linkedin, Mail, Award, Briefcase, Code, ExternalLink, Rocket, FileText, ChevronRight, Globe, Sparkles, Trophy, Star, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    hackathons: {
        id: string;
        title: string;
        projectName: string;
        description: string;
        role: string;
        date: string;
        status: string;
        type: 'internal' | 'external';
        certificateId?: string;
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

const fadeInUp: any = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer: any = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function PortfolioPage() {
    const params = useParams();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
            <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="text-blue-500" size={48} />
                </motion.div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] text-white gap-6">
                <motion.div 
                    initial={fadeInUp.initial}
                    animate={fadeInUp.animate}
                    transition={fadeInUp.transition}
                    className="text-center"
                >
                    <h1 className="text-3xl font-black text-red-500 mb-2">ACCESS DENIED</h1>
                    <p className="text-neutral-500 font-mono text-sm">{error || "Portfolio data stream corrupted or not found"}</p>
                </motion.div>
                <Button onClick={() => window.location.href = '/'} variant="outline" className="rounded-full border-neutral-800 hover:bg-white/5">
                    Return to Orbit
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030303] text-neutral-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Mesh Gradient Background Layer */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Hero Section - The WOW Entrance */}
            <header className="relative pt-32 pb-24 px-6 z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="container mx-auto max-w-5xl text-center"
                >
                    {/* Avatar with Halo */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                        <div className="relative w-full h-full rounded-full p-0.5 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden shadow-2xl shadow-blue-500/20">
                            <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center text-4xl font-black text-white italic">
                                {data.user.avatar ? (
                                    <img src={data.user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    data.user.firstName[0]
                                )}
                            </div>
                        </div>
                    </div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500"
                    >
                        {data.user.firstName} <span className="text-blue-500">{data.user.lastName}</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        {data.user.bio || "Crafting digital experiences with precision and passion."}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center gap-6"
                    >
                        <a href={`mailto:${data.user.email}`} className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all text-neutral-400 hover:text-white hover:scale-110 active:scale-95 shadow-xl">
                            <Mail size={24} />
                        </a>
                        {data.user.github && (
                            <a href={data.user.github} target="_blank" rel="noopener noreferrer" className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all text-neutral-400 hover:text-white hover:scale-110 active:scale-95 shadow-xl">
                                <Github size={24} />
                            </a>
                        )}
                        {data.user.linkedin && (
                            <a href={data.user.linkedin} target="_blank" rel="noopener noreferrer" className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all text-neutral-400 hover:text-white hover:scale-110 active:scale-95 shadow-xl">
                                <Linkedin size={24} />
                            </a>
                        )}
                    </motion.div>
                </motion.div>
            </header>

            <main className="container mx-auto max-w-5xl px-6 py-12 relative z-10 space-y-32">
                
                {/* Skills - Floating Chip Grid */}
                {data.user.skills.length > 0 && (
                    <motion.section 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Zap className="text-blue-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Tech Stack</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {data.user.skills.map((skill, index) => (
                                <motion.span
                                    key={index}
                                    variants={fadeInUp}
                                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 font-bold text-sm hover:bg-blue-600/10 hover:border-blue-500/30 hover:text-blue-400 transition-all cursor-default shadow-sm backdrop-blur-sm"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Proof of Work - Featured Grid */}
                {data.proofOfWork && data.proofOfWork.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Rocket className="text-purple-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Proof of Work</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.proofOfWork.map((pow) => (
                                <motion.div 
                                    key={pow.id}
                                    whileHover={{ y: -8 }}
                                    className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md hover:border-purple-500/30 transition-all hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]"
                                >
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-500 text-purple-400 group-hover:text-white">
                                                    <Globe size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors italic tracking-tight">
                                                        {pow.title.toUpperCase()}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{pow.language}</span>
                                                        <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                                        <span className="text-[9px] font-bold text-green-500 flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> LIVE
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-neutral-400 text-sm leading-relaxed mb-10 italic line-clamp-3">
                                            Architecture deployed at <span className="text-purple-400 font-mono lowercase">{pow.subdomain}.weboryskills.in</span> using high-performance virtualization.
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="flex-1 h-12 rounded-2xl border-white/10 hover:bg-white/10 text-xs font-black uppercase tracking-widest gap-2 active:scale-95 transition-transform bg-white/5">
                                                        <FileText size={14} /> Briefing
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[#050505] border-white/10 text-white max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-[2.5rem]">
                                                    <div className="p-8 bg-gradient-to-r from-purple-900/40 to-transparent border-b border-white/5">
                                                        <DialogHeader>
                                                            <DialogTitle className="flex items-center gap-4 text-3xl font-black italic tracking-tighter">
                                                                <Star className="text-purple-400 fill-purple-400" /> MISSION CASE STUDY
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                                                        <div className="prose prose-invert prose-purple max-w-none prose-p:text-neutral-400 prose-headings:text-white prose-strong:text-white">
                                                            <ReactMarkdown>{pow.caseStudy}</ReactMarkdown>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            
                                            <a 
                                                href={pow.deploymentUrl} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex-1 h-12 inline-flex items-center justify-center gap-2 px-6 bg-white text-black hover:bg-purple-500 hover:text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95"
                                            >
                                                Launch <ChevronRight size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements Showcase - Trophy Room */}
                {data.hackathons && data.hackathons.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Trophy className="text-amber-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Achievements</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.hackathons.map((hack) => (
                                <motion.div 
                                    key={hack.id} 
                                    whileHover={{ scale: 1.02 }}
                                    className={`group relative bg-white/5 border rounded-[2rem] p-10 transition-all ${hack.status === 'winner' ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${hack.status === 'winner' ? 'bg-amber-500/20 text-amber-500 shadow-lg shadow-amber-500/10' : 'bg-blue-500/10 text-blue-500'}`}>
                                                <Trophy size={28} className={hack.status === 'winner' ? 'animate-bounce' : ''} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors uppercase italic tracking-tighter leading-tight">
                                                    {hack.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${hack.type === 'internal' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}`}>
                                                        {hack.type}
                                                    </span>
                                                    {hack.status === 'winner' && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-amber-500 text-black shadow-xl shadow-amber-500/30">
                                                            Winner
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                                            {mounted ? new Date(hack.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "..."}
                                        </div>
                                    </div>

                                    <div className="space-y-6 mb-10">
                                        <div>
                                            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Deployed Architecture</div>
                                            <p className="text-white text-lg font-bold leading-tight line-clamp-2 italic">
                                                "{hack.projectName}"
                                            </p>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Strategic Role</div>
                                            <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                                                {hack.description || `Leading as ${hack.role}, successfully implemented mission-critical features within constraints.`}
                                            </p>
                                        </div>
                                    </div>

                                    {hack.certificateId && (
                                        <div className="pt-8 border-t border-white/5">
                                            <a 
                                                href={`/certificates/${hack.certificateId}`} 
                                                target="_blank" 
                                                className="w-full h-12 inline-flex items-center justify-center gap-3 px-6 bg-white text-black hover:bg-amber-500 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95"
                                            >
                                                <Award size={18} /> View Certificate
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Section - Sleek List */}
                {data.projects.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Star className="text-blue-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Project Matrix</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {data.projects.map((project) => (
                                <motion.div 
                                    key={project.id} 
                                    whileHover={{ x: 10 }}
                                    className="group relative bg-white/5 border border-white/5 rounded-[1.5rem] p-8 hover:bg-white/[0.08] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                                                {project.title}
                                            </h3>
                                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{project.courseTitle}</p>
                                        </div>
                                        {project.submissionUrl && (
                                            <a href={project.submissionUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-blue-600 transition-all">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6 italic line-clamp-2">
                                        {project.description || "Experimental project focusing on module integration and performance."}
                                    </p>
                                    {project.submissionText && (
                                        <div className="text-[10px] text-neutral-500 bg-black/50 p-4 rounded-xl font-mono truncate border border-white/5">
                                            $ cat manifest.json » {project.submissionText}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience Timeline */}
                {data.internships.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <Briefcase className="text-green-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Experience</h2>
                        </div>
                        <div className="space-y-12">
                            {data.internships.map((internship, index) => (
                                <motion.div 
                                    key={internship.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-12 border-l border-white/10"
                                >
                                    <div className="absolute -left-[6px] top-0 w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                                    <div className="flex flex-wrap justify-between items-baseline gap-4 mb-4">
                                        <h3 className="text-2xl font-black text-white italic tracking-tighter">{internship.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-neutral-500 px-3 py-1 bg-white/5 rounded-full uppercase tracking-tighter">{internship.duration}</span>
                                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded uppercase tracking-widest border border-green-500/20">{internship.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-lg text-neutral-300 font-bold mb-4">{internship.company}</p>
                                    <p className="text-neutral-500 text-sm italic max-w-2xl leading-relaxed">
                                        Collaborated on high-stakes delivery cycles, ensuring code robustness and performance.
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Wall of Fame - Certifications */}
                {data.certificates.length > 0 && (
                    <section className="pb-20">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                <Award className="text-yellow-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Wall of Fame</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {data.certificates.map((cert) => (
                                <motion.div 
                                    key={cert.id} 
                                    whileHover={{ y: -10 }}
                                    className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-yellow-500/30 transition-all shadow-xl"
                                >
                                    <div className="aspect-[4/3] relative bg-[#111] overflow-hidden">
                                        {cert.courseThumbnail ? (
                                            <img src={cert.courseThumbnail} alt={cert.courseTitle} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-800">
                                                <Award size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                    </div>
                                    <div className="p-6 relative">
                                        <h3 className="font-bold text-white line-clamp-1 mb-2 group-hover:text-yellow-400 transition-colors">{cert.courseTitle}</h3>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                                                {mounted ? new Date(cert.completedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "..."}
                                            </p>
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="border-t border-white/5 py-20 text-center relative z-10 bg-black/50 backdrop-blur-2xl">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="container mx-auto px-6"
                >
                    <div className="text-4xl font-black italic tracking-tighter text-white mb-4">WEBORY <span className="text-blue-500">SKILLS</span></div>
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.3em]">Built for the future by {data.user.firstName}</p>
                    <div className="mt-10 flex justify-center gap-6 text-neutral-600">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protocol</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Security Clearance</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Terms of Engagement</span>
                    </div>
                </motion.div>
            </footer>
        </div>
    );
}
