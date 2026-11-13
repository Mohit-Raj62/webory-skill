"use client";

import { ShieldCheck, GitCommit, QrCode, Headphones, CheckCircle2, Lock } from "lucide-react";

export function QualityGuaranteeSection() {
    const guarantees = [
        {
            title: "100% Original Code Policy",
            desc: "Zero tolerance for copy-paste tutorials. Every student submits actual pull requests on GitHub and passes code review before certification.",
            icon: GitCommit
        },
        {
            title: "Permanent QR Verification",
            desc: "Every certificate issued carries an immutable unique ID and QR code, forever authenticated on our official verification portal.",
            icon: QrCode
        },
        {
            title: "Live Mentor Response SLA",
            desc: "Active doubt support via chat and live pairing sessions so students never remain blocked on technical errors.",
            icon: Headphones
        },
        {
            title: "Transparent & Fair Policies",
            desc: "Honest curriculum disclosures, zero predatory loan tactics, and upfront student-first fee structures.",
            icon: Lock
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        Our Quality Commitment
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Student Protection & Quality Guarantee
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        We hold our cohorts to strict engineering and ethical standards to ensure your certificate commands genuine respect in the job market.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {guarantees.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-[#0b101b] p-6 flex flex-col justify-between space-y-4 shadow-md text-left"
                        >
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center">
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-base font-bold text-white">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                <CheckCircle2 size={13} />
                                <span>Guaranteed Standard</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

