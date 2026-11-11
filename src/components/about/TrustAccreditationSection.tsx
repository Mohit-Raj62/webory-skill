"use client";

import { ShieldCheck, Award, Building, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function TrustAccreditationSection() {
    const accreditations = [
        {
            title: "MSME Registered Startup",
            regNo: "UDYAM-BR-26-0208472",
            desc: "Officially registered under the Ministry of Micro, Small and Medium Enterprises, Govt. of India.",
            image: "/assets/msme-logo.jpg",
            badge: "Ministry of MSME"
        },
        {
            title: "Skill India Aligned",
            regNo: "National Skill Mission",
            desc: "Practical curriculum designed to meet national technical workforce benchmarks and standards.",
            image: "/assets/skill-india.png",
            badge: "Govt. Initiative"
        },
        {
            title: "Academic Partnership",
            regNo: "JBIT College Association",
            desc: "Collaborative training cohorts, campus workshops, and university-recognized project certifications.",
            image: "/assets/webory-official-seal.png",
            badge: "Institutional Partner"
        },
        {
            title: "AICTE Recommended Curriculum",
            regNo: "Technical Education Standards",
            desc: "Aligned with contemporary computer science and emerging AI/Web development engineering frameworks.",
            image: "/assets/aicte.png",
            badge: "Curriculum Aligned"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                        Accreditations & Trust
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mt-3 mb-3">
                        Recognized & Verified Institutional Trust
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                        Webory Skills operates with official government recognitions and institutional alliances ensuring every student credential holds legitimate career value.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {accreditations.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-800 bg-[#0b101b] p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-md group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-lg bg-white p-1.5 flex items-center justify-center border border-slate-700 shadow-sm shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                                        {item.badge}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs font-mono text-blue-400 mb-2">
                                    {item.regNo}
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                                <CheckCircle2 size={13} />
                                <span>Verified & Certified</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

