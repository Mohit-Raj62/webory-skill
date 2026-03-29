"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter, ExternalLink, Youtube } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";

export function Footer() {
    const { user } = useAuth();
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const isApp = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
        setIsStandalone(isApp);
    }, []);

    return (
        <footer className={`relative bg-[#050505] border-t border-white/5 pt-12 md:pt-20 ${isStandalone ? 'pb-4' : 'pb-10'} overflow-hidden`}>
             {/* Background Effects */}
             <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] opacity-20 transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] opacity-20 transform translate-y-1/2"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="inline-flex items-center space-x-3 group">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                <span className="font-black text-xl text-white">W</span>
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                WEBORY <span className="relative inline-block">
                                    <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                    </span>
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">SKILLS</span>
                                </span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm sm:max-w-xs md:max-w-sm">
                            Empowering the next generation of developers with AI-driven learning, real-world projects, and expert mentorship. Build your future with Webory.
                        </p>
                        
                        <div className="pt-2">
                             <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors group/msme">
                                <div className="text-orange-500 font-black text-xl tracking-tighter group-hover/msme:scale-110 transition-transform">
                                    MSME
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                 <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Registered Enterprise</span>
                                    <span className="text-[10px] text-orange-400/80 font-mono break-all">UDYAM-BR-26-0208472</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 text-center sm:text-left">
                        
                        {/* Column 1: Learning */}
                        <div className="col-span-1 h-full">
                            <div className="w-full h-full p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:border-blue-500/10 transition-colors duration-500">
                                <h4 className="text-white font-semibold mb-5 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Learning
                                </h4>
                                <ul className="space-y-3 text-[13px] sm:text-sm text-gray-400">
                                    <li><Link href="/courses" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">All Courses</Link></li>
                                    <li><Link href="/internships" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Internships <span className="text-[9px] px-1 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/20">New</span></Link></li>
                                    <li><Link href="/hackathons" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Hackathons <span className="text-[9px] px-1 py-0.5 bg-orange-500/20 text-orange-400 rounded border border-orange-500/20">New</span></Link></li>
                                    <li><Link href="/mentorship" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Mentorship <span className="text-[9px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 italic">Pro</span></Link></li>
                                    <li><Link href="/ai-prep" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">AI Nexus <span className="text-[9px] px-1 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/20 italic">Pro</span></Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 2: Labs */}
                        <div className="col-span-1 h-full">
                            <div className="w-full h-full p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:border-emerald-500/10 transition-colors duration-500">
                                <h4 className="text-white font-semibold mb-5 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Labs
                                </h4>
                                <ul className="space-y-3 text-[13px] sm:text-sm text-gray-400">
                                    <li><Link href="/playground" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">DevLab IDE</Link></li>
                                    {user && (
                                        <>
                                            <li><Link href="/simulator" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 text-left leading-tight">WeboryOS <span className="text-[9px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 italic font-bold shrink-0">New</span></Link></li>
                                            <li><Link href="/viz" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 text-left leading-tight">LogicRoom <span className="text-[9px] px-1 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 italic font-bold shrink-0">Beta</span></Link></li>
                                            <li><Link href="/resume-checker" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 text-left leading-tight">Resume AI <span className="text-[9px] px-1 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 italic font-bold shrink-0">Free</span></Link></li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Column 3: Company */}
                        <div className="col-span-1 h-full">
                            <div className="w-full h-full p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:border-purple-500/10 transition-colors duration-500">
                                <h4 className="text-white font-semibold mb-5 flex items-center justify-center sm:justify-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                    Company
                                </h4>
                                <ul className="space-y-3 text-[13px] sm:text-sm text-gray-400">
                                    <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">About Us</Link></li>
                                    <li><Link href="/careers" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Careers</Link></li>
                                    <li><Link href="/blog" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Blog</Link></li>
                                    <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Contact</Link></li>
                                    <li><Link href="/ambassador" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">Ambassador</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 4: Connect */}
                        <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1 lg:col-span-2 pt-8 md:pt-0 border-t border-white/5 md:border-0 h-full">
                            <div className="w-full h-full p-4 sm:p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm group/connect-box hover:border-blue-500/10 transition-colors duration-500">
                                <h4 className="text-white font-bold mb-5 sm:mb-6 flex items-center justify-center md:justify-start gap-2 group/title">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)] group-hover/title:scale-125 transition-transform duration-300"></span>
                                    <span className="tracking-tight text-lg">Connect</span>
                                </h4>
                                
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 w-full mb-6">
                                    <SocialLink href="#" icon={<Github size={18} />} brandColor="hover:text-white hover:bg-gray-800" />
                                    <SocialLink href="#" icon={
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                        </svg>
                                    } brandColor="hover:text-white hover:bg-black" />
                                    <SocialLink href="https://www.linkedin.com/in/webory-skills-01244b3a9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" icon={<Linkedin size={18} />} brandColor="hover:text-white hover:bg-[#0077b5]" />
                                    <SocialLink href="https://www.instagram.com/weboryskills?igsh=anJ2Zmc0MmdjdmEy&utm_source=qr" icon={<Instagram size={18} />} brandColor="hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7]" />
                                    <SocialLink href="https://www.youtube.com/@CodeWithWebory" icon={<Youtube size={18} />} brandColor="hover:text-white hover:bg-[#ff0000]" />
                                </div>

                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed text-center md:text-left bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                                    Join our community for latest tech insights.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
                        <p className="text-gray-500 text-sm order-2 md:order-1">
                            © {new Date().getFullYear()} Webory Technologies. Made with <span className="text-red-500 animate-pulse">❤</span> in India.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 order-1 md:order-2">
                            <LegalLink href="/privacy" label="Privacy" />
                            <LegalLink href="/terms" label="Terms" />
                            <LegalLink href="/refund-policy" label="Refunds" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, brandColor }: { href: string; icon: React.ReactNode; brandColor: string }) {
    return (
        <Link 
            href={href} 
            className={`aspect-square sm:w-12 sm:h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-105 active:scale-95 ${brandColor} group/icon overflow-hidden relative shadow-lg shadow-black/20`}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/icon:opacity-20 blur-xl transition-opacity duration-300"></div>
            <div className="relative z-10 transition-transform duration-300 group-hover/icon:scale-110">
                {icon}
            </div>
            
            {/* Corner Decorative Element */}
            <div className="absolute top-0 right-0 w-4 h-4 bg-white/5 rounded-bl-lg transform translate-x-1 -translate-y-1 group-hover/icon:translate-x-0 group-hover/icon:translate-y-0 transition-transform duration-300" />
        </Link>
    );
}

function LegalLink({ href, label }: { href: string; label: string }) {
    return (
        <Link 
            href={href}
            className="px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-bold text-gray-500 hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 relative overflow-hidden group/legal"
        >
            <span className="relative z-10">{label}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover/legal:opacity-100 transition-opacity duration-300" />
        </Link>
    );
}
