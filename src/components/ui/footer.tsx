import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] opacity-20 transform -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] opacity-20 transform translate-y-1/2"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-5 lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-flex items-center space-x-3 group">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                <span className="font-black text-xl bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent">W</span>
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
                                Webory Skills
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Empowering the next generation of developers with AI-driven learning, real-world projects, and expert mentorship. Build your future with Webory.
                        </p>
                        
                        <div className="pt-2">
                             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors group/msme">
                                <div className="text-orange-500 font-black text-xl tracking-tighter group-hover/msme:scale-110 transition-transform">
                                    MSME
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registered Enterprise</span>
                                    <span className="text-[10px] text-orange-400/80 font-mono">UDYAM-BR-26-0208472</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="col-span-1 md:col-span-7 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Platform
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link href="/courses" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">All Courses</Link></li>
                                <li><Link href="/internships" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Internships <span className="text-[9px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/20">New</span></Link></li>
                                <li><Link href="/mentorship" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Mentorship</Link></li>
                                <li><Link href="/playground" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">DevLab IDE</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Company
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">About Us</Link></li>
                                <li><Link href="/careers" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Careers</Link></li>
                                <li><Link href="/blog" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Blog</Link></li>
                                <li><Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                Connect
                            </h4>
                            <div className="flex gap-3 mb-6">
                                <SocialLink href="#" icon={<Github size={18} />} color="hover:bg-gray-800" />
                                <SocialLink href="#" icon={
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                    </svg>
                                } color="hover:bg-black hover:border-white/20 hover:text-white" />
                                <SocialLink href="#" icon={<Linkedin size={18} />} color="hover:bg-blue-700" />
                                <SocialLink href="#" icon={<Instagram size={18} />} color="hover:bg-pink-600" />
                            </div>
                            <p className="text-xs text-gray-500">
                                Follow us for the latest updates and coding challenges.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Webory Technologies. Made with <span className="text-red-500 animate-pulse">❤</span> in India.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, color }: { href: string; icon: React.ReactNode; color: string }) {
    return (
        <Link 
            href={href} 
            className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${color}`}
        >
            {icon}
        </Link>
    );
}
