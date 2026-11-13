"use client";

import { ShieldCheck, FileText, CheckCircle2, Building, Mail, Clock, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";

export function CorporateComplianceSection() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Corporate Governance & Compliance
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Legal Standing & Transparency
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Webory Skills is a legally registered and government-recognized enterprise operating with complete compliance, verified registrations, and student protection guidelines.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Entity Details */}
                    <div className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 space-y-4 shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center">
                            <Building size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Registered Business Entity</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Officially incorporated enterprise operating under Indian commercial regulations.
                            </p>
                        </div>
                        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3 text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Legal Name:</span>
                                <span className="font-semibold text-white">Webory Skills</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Industry:</span>
                                <span className="text-slate-300">EdTech & Vocational Skill Training</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Country:</span>
                                <span className="text-slate-300">India</span>
                            </div>
                        </div>
                    </div>

                    {/* Government Recognition */}
                    <div className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 space-y-4 shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">MSME Government Recognition</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Registered with the Ministry of Micro, Small and Medium Enterprises, Govt. of India.
                            </p>
                        </div>
                        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3 text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Udyam Reg. No:</span>
                                <span className="font-mono font-bold text-blue-400">UDYAM-BR-26-0208472</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status:</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Active & Verified
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Startup India:</span>
                                <span className="text-slate-300">Recognized Entity</span>
                            </div>
                        </div>
                    </div>

                    {/* Student Protection & Grievance */}
                    <div className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 space-y-4 shadow-md">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Student Support & Grievance SLA</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Committed to swift, transparent resolution of all student and institutional queries.
                            </p>
                        </div>
                        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3 text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Support Desk:</span>
                                <span className="font-mono text-slate-200">support@weboryskills.com</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Response SLA:</span>
                                <span className="text-slate-200 font-semibold flex items-center gap-1">
                                    <Clock size={12} className="text-blue-400" /> Within 24 Business Hours
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Verification:</span>
                                <Link href="/verify-certificate" className="text-blue-400 hover:underline flex items-center gap-1">
                                    <span>Instant QR Portal</span>
                                    <ExternalLink size={11} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

