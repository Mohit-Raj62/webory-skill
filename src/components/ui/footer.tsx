import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black/40 border-t border-white/10 pt-16 pb-8 backdrop-blur-xl">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">W</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                WEBORY
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Webory Skills is a career-focused learning platform that combines AI, mentorship, and real projects to make students industry-ready.
                        </p>
                        <div className="mt-4 flex items-center space-x-2">
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
                                <span className="text-orange-400 text-xs font-medium">
                                    MSME Registered: UDYAM-BR-26-0208472
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 bg-white px-3 py-2 rounded-lg">
                            <div className="text-orange-600 font-bold text-lg leading-none tracking-tighter">
                                MSME
                            </div>
                            <div className="w-px h-6 bg-gray-300"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-800 font-bold uppercase leading-none">Micro, Small & Medium</span>
                                <span className="text-[10px] text-gray-800 font-bold uppercase leading-none">Enterprises</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/courses" className="hover:text-blue-400 transition-colors">Courses</Link></li>
                            <li><Link href="/internships" className="hover:text-blue-400 transition-colors">Internships</Link></li>
                            <li><Link href="/mentorship" className="hover:text-blue-400 transition-colors">Mentorship</Link></li>
                            {/* <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Connect</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                <Github size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all">
                                <Linkedin size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram size={20} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Webory Technologies. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
