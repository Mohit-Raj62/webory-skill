"use client";

import { Users, ShieldCheck, Linkedin, Github, Mail, CheckCircle2, Award, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LeadershipSection() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Executive Leadership
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Meet Our Founder & CEO
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Leading the initiative to bridge academic education with real-world software engineering across India.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="rounded-2xl border border-slate-800 bg-[#0b101b] p-6 sm:p-10 md:p-12 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* Column 1: Round Image & Verified Tag */}
                        <div className="lg:col-span-5 flex flex-col items-center space-y-5">
                            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-slate-700/80 bg-slate-900 shadow-2xl ring-4 ring-blue-500/10 shrink-0">
                                <Image
                                    src="/mohit-sinha.jpg"
                                    alt="Mohit Sinha - Founder & CEO, Webory Skills"
                                    fill
                                    className="object-cover object-top rounded-full"
                                    priority
                                    sizes="(max-width: 768px) 224px, 256px"
                                />
                            </div>

                            {/* Verification Badge */}
                            <div className="w-full max-w-[280px] p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs shadow-md">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <ShieldCheck size={16} className="text-blue-400" />
                                    <span className="font-medium">Govt. Recognized</span>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                    MSME & Startup India
                                </span>
                            </div>
                        </div>

                        {/* Column 2: Biography & Details */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            <div className="border-b border-slate-800 pb-5">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 rounded">
                                        Build • Learn • Grow
                                    </span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    Mohit Sinha
                                </h3>
                                <p className="text-blue-400 font-medium text-sm sm:text-base mt-1">
                                    Founder & Chief Executive Officer, Webory Skills
                                </p>
                            </div>

                            {/* Executive Summary */}
                            <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                                <p>
                                    Mohit Sinha is a software engineer, technology mentor, and entrepreneur dedicated to transforming technical education in India. Having observed the substantial divide between academic engineering curriculums and modern tech stack requirements, he established <strong className="text-white font-semibold">Webory Skills</strong> to give students hands-on, production-grade project experience before entering the workforce.
                                </p>
                                <p>
                                    Under his stewardship, Webory has evolved into a recognized MSME tech startup that pairs students with working industry professionals, real client codebases, and verified industrial credentials.
                                </p>
                            </div>

                            {/* Founder Quote */}
                            <div className="p-4 rounded-xl bg-slate-900/60 border-l-2 border-blue-500 border border-slate-800 text-slate-200 text-sm italic font-serif leading-relaxed">
                                &ldquo;Our objective is straightforward: replace rote theory with practical systems building. When students write production code and deploy real applications, their career trajectory completely changes.&rdquo;
                            </div>

                            {/* Professional Highlights Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                        <Briefcase size={14} className="text-blue-400" />
                                        <span>Industry Focus</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">
                                        Production workflows, live Git repositories, and architecture.
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                        <Award size={14} className="text-blue-400" />
                                        <span>Verified Credibility</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">
                                        Government-recognized MSME startup credentials for all cohorts.
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-blue-400" />
                                        <span>Student Mentorship</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-snug">
                                        Dedicated doubt sessions, resume reviews, and career counseling.
                                    </p>
                                </div>
                            </div>

                            {/* Direct Connect Actions */}
                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                <Link 
                                    href="https://www.linkedin.com/in/mohit0sinha" 
                                    target="_blank" 
                                    className="px-4 py-2 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                                >
                                    <Linkedin size={15} />
                                    <span>LinkedIn Profile</span>
                                </Link>
                                <Link 
                                    href="https://github.com/Mohit-Raj62" 
                                    target="_blank" 
                                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
                                >
                                    <Github size={15} />
                                    <span>GitHub</span>
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className="px-4 py-2 rounded-lg bg-transparent hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <Mail size={14} />
                                    <span>Contact Office</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Leadership Card: Vijay Kumar (IIT Mandi) */}
                <div className="mt-8 rounded-2xl border border-slate-800 bg-[#0b101b] p-6 sm:p-8 md:p-10 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                        <div className="lg:col-span-4 flex flex-col items-center space-y-4">
                            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-center shadow-xl ring-4 ring-blue-500/10">
                                <span className="text-3xl sm:text-4xl font-black text-blue-400 font-mono tracking-tighter">VK</span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Academic Head</span>
                            </div>

                            <div className="w-full max-w-[260px] p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                    <Award size={14} className="text-blue-400" />
                                    Alumnus, IIT Mandi
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                    Academic Council
                                </span>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-4 text-left">
                            <div className="border-b border-slate-800 pb-3">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 mb-2">
                                    <span>Academic & Curriculum Rigor</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    Vijay Kumar
                                </h3>
                                <p className="text-blue-400 font-medium text-xs sm:text-sm">
                                    Director of Education, Webory Skills • Alumnus, IIT Mandi
                                </p>
                            </div>

                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                Heading the curriculum design and technical standards at Webory Skills, Vijay Kumar brings the academic discipline of <strong className="text-white font-semibold">IIT Mandi</strong> combined with real industrial systems architecture. He oversees mentor allocations, code quality benchmarks, and the evaluation framework for all certification cohorts.
                            </p>

                            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 text-xs italic font-serif leading-relaxed">
                                &ldquo;True engineering education goes beyond coding tutorials. It requires architectural discipline, code readability, and knowing how to debug production failures under pressure.&rdquo;
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                                    <CheckCircle2 size={13} />
                                    Official Certificate Co-Signatory
                                </span>
                                <span className="text-slate-600">•</span>
                                <span>IIT Mandi Engineering Pedagogy</span>
                                <span className="text-slate-600">•</span>
                                <span>Curriculum Quality Audit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
