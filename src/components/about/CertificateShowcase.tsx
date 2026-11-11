"use client";

import { Award, ArrowRight, ShieldCheck, CheckCircle2, QrCode } from "lucide-react";
import Image from "next/image";

export function CertificateShowcase() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 border-t border-slate-800/80 bg-[#06090e]">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left: Info */}
                    <div className="lg:col-span-5 space-y-6 text-left">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                                Industry Recognized Certification
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-3 mb-3">
                                Official Certificate of Completion
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                                Every graduate from Webory Skills receives a verifiable, industry-recognized certificate validating their hands-on project work and technical proficiency.
                            </p>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                            {[
                                { text: "Scan-to-Verify QR & Unique Certificate ID", icon: QrCode },
                                { text: "Govt. Recognized MSME & Startup India Accredited", icon: ShieldCheck },
                                { text: "Shareable on LinkedIn with One-Click Verification", icon: CheckCircle2 },
                                { text: "Lifetime Verifiable Credential on Webory Portal", icon: Award }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm">
                                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                                        <feature.icon size={15} />
                                    </div>
                                    <span className="font-medium">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actual Certificate Image */}
                    <div className="lg:col-span-7">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 p-2 sm:p-3 shadow-2xl shadow-blue-950/30 group">
                            <div className="relative w-full aspect-[1.414/1] rounded-xl overflow-hidden border border-slate-800 bg-white">
                                <Image
                                    src="/sample-certificate.jpg"
                                    alt="Webory Skills Official Certificate of Completion"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 100vw, 650px"
                                    priority
                                />
                            </div>
                            <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-slate-400">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                    <ShieldCheck size={14} className="text-amber-400" />
                                    Official MSME Certified Credential
                                </span>
                                <span className="text-slate-500 font-mono">MSME: UDYAM-BR-26-0208472</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
