"use client";

import { motion } from "framer-motion";
import { Award, ArrowRight } from "lucide-react";

export function CertificateShowcase() {
    return (
        <section className="py-20 px-4 md:px-8 relative z-10 bg-gradient-to-b from-transparent to-blue-900/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Award size={12} />
                            <span>Industry Recognized</span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-bold text-white mb-6">Earn a <span className="text-yellow-400">Prestigious Certificate</span></h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Stand out to employers with certificates that validate your skills. Our certifications are recognized by MSME (Govt. of India) and top tech companies.
                        </p>
                        
                        <div className="space-y-4">
                            {[
                                "Verifiable via unique ID",
                                "Shareable on LinkedIn",
                                "Recognized by MSME & ISO",
                                "Lifetime validity"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                        <ArrowRight size={14} />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative perspective-1000 group overflow-hidden md:overflow-visible">
                        <motion.div 
                            initial={{ rotateY: 10, rotateX: 5 }}
                            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 100, damping: 10 }}
                            className="relative w-full aspect-[1.4/1] bg-white text-blue-900 border-4 border-blue-900 p-2 shadow-2xl shadow-blue-900/20 flex flex-col overflow-hidden"
                        >
                            <div className="h-full w-full border-2 border-blue-900 relative p-4 md:p-6 flex flex-col">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-blue-900"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-600 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-600 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-600 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-600 rounded-br-lg"></div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    <Award className="w-96 h-96" />
                                </div>

                                <div className="text-center relative z-10 mb-4">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <Award className="w-8 h-8 text-yellow-600" />
                                        <div className="text-left">
                                            <h3 className="font-serif font-bold text-2xl tracking-wide text-blue-900 leading-none">WEBORY SKILL'S</h3>
                                            <p className="text-[10px] tracking-[0.2em] text-yellow-600 uppercase">Excellence in Education</p>
                                        </div>
                                    </div>
                                    <div className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold">
                                        Govt. of India Recognized Startup<br/>MSME Reg: UDYAM-BR-26-000472
                                    </div>
                                </div>

                                <div className="text-center relative z-10 my-2">
                                    <h1 className="font-serif text-xl md:text-5xl font-bold text-blue-900 mb-2">Certificate of Completion</h1>
                                    <p className="italic text-gray-500 text-lg">This is to certify that</p>
                                </div>

                                <div className="text-center relative z-10 my-4">
                                    <h2 className="font-serif text-lg md:text-4xl font-bold text-blue-900 border-b border-gray-300 pb-2 inline-block px-8">Your Name</h2>
                                </div>

                                <div className="text-center relative z-10 mb-6">
                                    <p className="italic text-gray-500 text-sm mb-2">has successfully completed the course</p>
                                    <h3 className="font-bold text-sm md:text-2xl text-black mb-4">Full Stack Development with Gen AI</h3>
                                    
                                    <div className="flex justify-center gap-8 text-[10px] uppercase tracking-wider text-gray-600 border-y border-gray-100 py-2 max-w-sm mx-auto">
                                        <div><span className="block font-bold">Duration</span>90hr</div>
                                        <div><span className="block font-bold">Enrolled</span>Dec 8, 2025</div>
                                        <div><span className="block font-bold">Completed</span>Dec 28, 2025</div>
                                    </div>
                                </div>

                                <div className="text-center relative z-10 mb-auto">
                                    <p className="font-serif text-sm text-gray-500">demonstrating proficiency and dedication, achieving an overall grade of 100%.</p>
                                </div>

                                <div className="flex justify-between items-end relative z-10 mt-4 px-4">
                                    <div className="text-center">
                                        <div className="text-base md:text-2xl text-blue-900 mb-1">Mohit Sinha</div>
                                        <div className="w-32 h-px bg-blue-900 mb-1"></div>
                                        <p className="text-[8px] font-bold text-blue-900 uppercase">Founder & CEO</p>
                                    </div>
                                    <div className="text-center flex flex-col items-center">
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-white border border-gray-200 p-1 mb-1"><div className="w-full h-full bg-black/80"></div></div>
                                        <p className="text-[6px] font-bold text-green-600 uppercase">Scan to Verify</p>
                                    </div>
                                    <div className="text-center relative">
                                        <div className="absolute -top-12 -right-4 w-20 h-20 border-2 border-blue-900 rounded-full flex items-center justify-center rotate-[-15deg] opacity-80">
                                            <div className="text-[6px] font-bold text-blue-900 text-center leading-tight">WEBORY<br/>SKILLS<br/>VERIFIED &<br/>AUTHORIZED</div>
                                        </div>
                                        <div className="text-base md:text-2xl text-blue-900 mb-1">Weboryskills</div>
                                        <div className="w-32 h-px bg-blue-900 mb-1"></div>
                                        <p className="text-[8px] font-bold text-blue-900 uppercase">Director of Education</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-900"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
