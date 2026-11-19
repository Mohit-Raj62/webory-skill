"use client";

import { useState } from "react";
import { Users, ShieldCheck, Linkedin, Github, Mail, CheckCircle2, Award, Briefcase, Instagram, Copy, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LeadershipSection() {
    const [copied, setCopied] = useState(false);
    const ceoEmail = "ceo.mohit_sinha@weboryskills.in";

    const handleCopy = () => {
        navigator.clipboard.writeText(ceoEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Executive Leadership
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Meet Our Founder & CEO
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                        Leading the initiative to bridge academic education with real-world software engineering across India.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="rounded-2xl border border-slate-800 bg-[#0b101b] p-4 sm:p-8 md:p-12 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
                        {/* Column 1: Round Image & Verified Tag */}
                        <div className="lg:col-span-5 flex flex-col items-center space-y-4 sm:space-y-5">
                            <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-slate-700/80 bg-slate-900 shadow-2xl ring-4 ring-blue-500/10 shrink-0">
                                <Image
                                    src="/mohit-sinha.jpg"
                                    alt="Mohit Sinha - Founder & CEO, Webory Skills"
                                    fill
                                    className="object-cover object-top rounded-full"
                                    priority
                                    sizes="(max-width: 640px) 192px, (max-width: 768px) 240px, 256px"
                                />
                            </div>

                            {/* Verification Badge */}
                            <div className="w-full max-w-[280px] p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs shadow-md">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
                                    <ShieldCheck size={16} className="text-blue-400 shrink-0" />
                                    <span className="font-medium text-[11px] sm:text-xs">Govt. Recognized</span>
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                    MSME & Startup India
                                </span>
                            </div>
                        </div>

                        {/* Column 2: Biography & Details */}
                        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
                            <div className="border-b border-slate-800 pb-4 sm:pb-5">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[11px] sm:text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-0.5 rounded">
                                        Build • Learn • Grow
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                                    Mohit Sinha
                                </h3>
                                <p className="text-blue-400 font-medium text-xs sm:text-sm md:text-base mt-1">
                                    Founder & Chief Executive Officer, Webory Skills
                                </p>
                            </div>

                            {/* Executive Summary */}
                            <div className="space-y-3 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                                <p>
                                    Mohit Sinha is a software engineer, technology mentor, and entrepreneur dedicated to transforming technical education in India. Having observed the substantial divide between academic engineering curriculums and modern tech stack requirements, he established <strong className="text-white font-semibold">Webory Skills</strong> to give students hands-on, production-grade project experience before entering the workforce.
                                </p>
                                <p>
                                    Under his stewardship, Webory has evolved into a recognized MSME tech startup that pairs students with working industry professionals, real client codebases, and verified industrial credentials.
                                </p>
                            </div>

                            {/* Founder Quote */}
                            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/60 border-l-2 border-blue-500 border border-slate-800 text-slate-200 text-xs sm:text-sm italic font-serif leading-relaxed">
                                &ldquo;Our objective is straightforward: replace rote theory with practical systems building. When students write production code and deploy real applications, their career trajectory completely changes.&rdquo;
                            </div>

                            {/* Professional Highlights Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                        <Briefcase size={14} className="text-blue-400 shrink-0" />
                                        <span>Industry Focus</span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                                        Production workflows, live Git repositories, and architecture.
                                    </p>
                                </div>
                                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                        <Award size={14} className="text-blue-400 shrink-0" />
                                        <span>Verified Credibility</span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                                        Government-recognized MSME startup credentials for all cohorts.
                                    </p>
                                </div>
                                <div className="p-2.5 sm:p-3 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1">
                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                                        <span>Student Mentorship</span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
                                        Dedicated doubt sessions, resume reviews, and career counseling.
                                    </p>
                                </div>
                            </div>

                            {/* Official Email Capsule */}
                            <div className="pt-2">
                                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 max-w-md">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                            <Mail size={15} />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                                Official Executive Desk
                                            </span>
                                            <a 
                                                href={`mailto:${ceoEmail}`} 
                                                className="text-xs sm:text-sm font-mono text-slate-200 hover:text-blue-400 font-semibold truncate block transition-colors"
                                                title={ceoEmail}
                                            >
                                                {ceoEmail}
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="self-end sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0 active:scale-95"
                                        title="Copy CEO Email"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={13} className="text-emerald-400" />
                                                <span className="text-emerald-400 font-semibold">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={13} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Direct Connect Actions: 2x2 Grid on Mobile, Flex on Desktop */}
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
                                <Link 
                                    href="https://www.linkedin.com/in/mohit0sinha" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-3.5 sm:px-4 py-2 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
                                >
                                    <Linkedin size={14} />
                                    <span>LinkedIn</span>
                                </Link>
                                <Link 
                                    href="https://www.instagram.com/it.m0sh.1?hvrq=MXdvcng4ZGJsb21jZw==" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-3.5 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-opacity shadow-sm active:scale-95"
                                >
                                    <Instagram size={14} />
                                    <span>Instagram</span>
                                </Link>
                                <Link 
                                    href="https://github.com/Mohit-Raj62" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-3.5 sm:px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors active:scale-95"
                                >
                                    <Github size={14} />
                                    <span>GitHub</span>
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className="px-3.5 sm:px-4 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                                >
                                    <Mail size={13} />
                                    <span>Contact Office</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
