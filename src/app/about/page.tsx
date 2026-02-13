"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Users, Target, Heart, Globe, Zap, Shield, Rocket, ArrowRight, Code2, Cpu, Database, Server, Smartphone, Layout, Cloud, FileJson, Container, GitBranch, ChevronDown, HelpCircle, Award, MessageSquare, Video, Mic, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };
    return (
        <main className="min-h-screen bg-[#050505] selection:bg-blue-500/30 font-sans">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 md:px-8 z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Rocket size={12} />
                            <span>Innovating Education</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Empowering the <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">Next Generation</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                            We are bridging the gap between academic learning and industry demands. Join us to master the skills that define the future of technology.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href="/courses">
                                <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-100 font-bold transition-transform hover:scale-105">
                                    Explore Courses
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" className="h-12 px-8 rounded-full border-white/10 text-white hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
                                    Partner With Us
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <div className="inline-flex items-center space-x-2 bg-green-500/5 border border-green-500/20 rounded-full px-5 py-2.5 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:bg-green-500/10 transition-all cursor-default group">
                                <span className="relative flex h-2.5 w-2.5 mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-gray-200 text-sm font-medium tracking-wide">
                                    Recognized by <span className="text-white font-bold">Govt. of India</span> (MSME)
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

             {/* Tech Stack Infinite Scroll */}
             <section className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden whitespace-nowrap relative z-10">
                <div className="text-center mb-8">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Powering Next-Gen Applications</p>
                </div>
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-12 inline-flex"
                >
                    {[
                        { name: "React", icon: Code2, color: "text-blue-400" },
                        { name: "Next.js", icon: Layout, color: "text-white" },
                        { name: "JavaScript", icon: FileJson, color: "text-yellow-400" },
                        { name: "Node.js", icon: Server, color: "text-green-500" },
                        { name: "Python", icon: SnakeIcon, color: "text-yellow-400" },
                        { name: "TypeScript", icon: Code2, color: "text-blue-500" },
                        { name: "Docker", icon: Container, color: "text-blue-400" },
                        { name: "MongoDB", icon: Database, color: "text-green-400" },
                        { name: "AWS", icon: Cloud, color: "text-orange-400" },
                        { name: "Git", icon: GitBranch, color: "text-red-500" },
                        { name: "Figma", icon: PenToolIcon, color: "text-purple-400" },
                        
                        // Duplicates for infinite scroll
                        { name: "React", icon: Code2, color: "text-blue-400" },
                        { name: "Next.js", icon: Layout, color: "text-white" },
                        { name: "JavaScript", icon: FileJson, color: "text-yellow-400" },
                        { name: "Node.js", icon: Server, color: "text-green-500" },
                        { name: "Python", icon: SnakeIcon, color: "text-yellow-400" },
                        { name: "TypeScript", icon: Code2, color: "text-blue-500" },
                        { name: "Docker", icon: Container, color: "text-blue-400" },
                        { name: "MongoDB", icon: Database, color: "text-green-400" },
                        { name: "AWS", icon: Cloud, color: "text-orange-400" },
                        { name: "Git", icon: GitBranch, color: "text-red-500" },
                        { name: "Figma", icon: PenToolIcon, color: "text-purple-400" },
                    ].map((tech, i) => (
                        <div key={i} className="flex items-center gap-3 text-2xl font-bold px-4">
                            {/* For Lucid icons that act as component, Render them directly */}
                            {/* Note: I'm using placeholder custom components for ones not in Lucide imports above or generic ones */}
                            <tech.icon className={`w-8 h-8 ${tech.color}`} />
                            <span className="text-gray-400">{tech.name}</span>
                        </div>
                    ))}
                </motion.div>
            </section>


            {/* Stats Section with Glassmorphism */}
            <section className="py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                        {/* Decorative gradient inside stats card */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-transparent to-purple-500 opacity-50"></div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
                            {[
                                { label: "Students Enrolled", value: "100+", icon: Users, color: "text-blue-400" },
                                { label: "Expert Mentors (incl. IIT Faculty)", value: "10+", icon: Target, color: "text-purple-400" },
                                { label: "Hiring Partners", value: "5+", icon: Globe, color: "text-pink-400" },
                                { label: "Success Rate", value: "90%", icon: Heart, color: "text-green-400" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className={`mb-3 flex justify-center transform group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                                        <stat.icon size={32} />
                                    </div>
                                    <div className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tighter">{stat.value}</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Path Section */}
            <section className="py-20 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Your Path to <span className="text-blue-500">Success</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We have designed a proven roadmap to take you from beginner to industry-ready professional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 border-t border-dashed border-white/20 z-0"></div>

                        {[
                            { title: "Learn", desc: "Master concepts with premium video lectures and interactive docs.", icon: Zap, step: "01", color: "blue" },
                            { title: "Build", desc: "Apply what you learn by building real-world projects.", icon: Code2, step: "02", color: "purple" },
                            { title: "Review", desc: "Get your code reviewed by expert mentors from top tech companies.", icon: Users, step: "03", color: "pink" },
                            { title: "Launch", desc: "Land internships and full-time roles with our hiring partners.", icon: Rocket, step: "04", color: "green" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative z-10 text-center group"
                            >
                                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center relative group-hover:border-${item.color}-500/50 transition-colors shadow-lg shadow-black/50`}>
                                     <div className={`absolute inset-0 bg-${item.color}-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500`}></div>
                                     <item.icon className={`w-8 h-8 text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                                     <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-${item.color}-500 text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                                         {item.step}
                                     </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed px-2">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Certificate Showcase Section */}
             <section className="py-20 px-4 md:px-8 relative z-10 bg-gradient-to-b from-transparent to-blue-900/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <Award size={12} />
                                <span>Industry Recognized</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Earn a <span className="text-yellow-400">Prestigious Certificate</span></h2>
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

                        <div className="relative perspective-1000 group">
                             {/* 3D Tilt Effect */}
                            <motion.div 
                                initial={{ rotateY: 10, rotateX: 5 }}
                                whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                                className="relative w-full aspect-[1.4/1] bg-white text-blue-900 border-4 border-blue-900 p-2 shadow-2xl shadow-blue-900/20 flex flex-col overflow-hidden"
                            >
                                <div className="h-full w-full border-2 border-blue-900 relative p-6 flex flex-col">
                                    {/* Top Blue Bar */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-blue-900"></div>

                                    {/* Corners */}
                                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-600 rounded-tl-lg"></div>
                                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-600 rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-600 rounded-bl-lg"></div>
                                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-600 rounded-br-lg"></div>

                                    {/* Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        <Award className="w-96 h-96" />
                                    </div>

                                    {/* Header */}
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

                                    {/* Title */}
                                    <div className="text-center relative z-10 my-2">
                                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-blue-900 mb-2">Certificate of Completion</h1>
                                        <p className="font-great-vibes text-gray-500 italic text-lg">This is to certify that</p>
                                    </div>

                                    {/* Name */}
                                    <div className="text-center relative z-10 my-4">
                                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-blue-900 border-b border-gray-300 pb-2 inline-block px-8">Your Name</h2>
                                    </div>

                                    {/* Course Details */}
                                    <div className="text-center relative z-10 mb-6">
                                        <p className="font-dancing text-gray-500 italic text-sm mb-2">has successfully completed the course</p>
                                        <h3 className="font-bold text-xl md:text-2xl text-black mb-4">Full Stack Development with Gen AI</h3>
                                        
                                        <div className="flex justify-center gap-8 text-[10px] uppercase tracking-wider text-gray-600 border-y border-gray-100 py-2 max-w-sm mx-auto">
                                            <div>
                                                <span className="block font-bold">Duration</span>
                                                90hr
                                            </div>
                                            <div>
                                                <span className="block font-bold">Enrolled</span>
                                                Dec 8, 2025
                                            </div>
                                            <div>
                                                <span className="block font-bold">Completed</span>
                                                Dec 28, 2025
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body Text */}
                                    <div className="text-center relative z-10 mb-auto">
                                        <p className="font-serif text-sm text-gray-500">demonstrating proficiency and dedication, achieving an overall grade of 100%.</p>
                                    </div>

                                    {/* Footer / Signatures */}
                                    <div className="flex justify-between items-end relative z-10 mt-4 px-4">
                                        <div className="text-center">
                                            <div className="font-dancing text-2xl text-blue-900 mb-1">Mohit Sinha</div>
                                            <div className="w-32 h-px bg-blue-900 mb-1"></div>
                                            <p className="text-[8px] font-bold text-blue-900 uppercase">Founder & CEO</p>
                                        </div>

                                        <div className="text-center flex flex-col items-center">
                                            <div className="w-16 h-16 bg-white border border-gray-200 p-1 mb-1">
                                                <div className="w-full h-full bg-black/80"></div> 
                                            </div>
                                            <p className="text-[6px] font-bold text-green-600 uppercase">Scan to Verify</p>
                                            <p className="text-[6px] font-bold text-gray-400 uppercase">Govt. Recognized</p>
                                        </div>

                                        <div className="text-center relative">
                                            <div className="absolute -top-12 -right-4 w-20 h-20 border-2 border-blue-900 rounded-full flex items-center justify-center rotate-[-15deg] opacity-80">
                                                <div className="text-[6px] font-bold text-blue-900 text-center leading-tight">
                                                    WEBORY<br/>SKILLS<br/>VERIFIED &<br/>AUTHORIZED
                                                </div>
                                            </div>
                                            <div className="font-dancing text-2xl text-blue-900 mb-1">Weboryskills</div>
                                            <div className="w-32 h-px bg-blue-900 mb-1"></div>
                                            <p className="text-[8px] font-bold text-blue-900 uppercase">Director of Education</p>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Blue Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-900"></div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision - Premium Redesign */}
            <section className="py-24 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Vision Card */}
                         <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="glass-card p-10 md:p-12 rounded-3xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                                
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    <Target size={32} />
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Mission</span></h2>
                                <p className="text-gray-400 leading-relaxed text-lg mb-6">
                                    To democratize access to elite tech education. We believe talent is universal, but opportunity is not. We are building the bridge that connects ambitious learners with world-class careers, regardless of their background.
                                </p>
                                <div className="flex items-center gap-2 text-blue-400 font-semibold uppercase tracking-wider text-xs">
                                    <span className="w-8 h-[1px] bg-blue-500"></span>
                                    Bridging the Gap
                                </div>
                            </div>
                        </motion.div>

                        {/* Mission Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                             <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                             <div className="glass-card p-10 md:p-12 rounded-3xl border border-white/10 bg-[#0a0a0a] relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

                                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 text-purple-400 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                                    <Globe size={32} />
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Vision</span></h2>
                                <p className="text-gray-400 leading-relaxed text-lg mb-6">
                                    To become the global launchpad for the next generation of tech leaders. We envision a future where every aspiring developer has the mentorship, tools, and community needed to build technology that shapes the world.
                                </p>
                                <div className="flex items-center gap-2 text-purple-400 font-semibold uppercase tracking-wider text-xs">
                                    <span className="w-8 h-[1px] bg-purple-500"></span>
                                    Empowering Creators
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mentorship Program Section */}
            <section className="py-24 px-4 md:px-8 relative z-10 overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                         {/* Visual UI Side */}
                        <div className="w-full md:w-1/2 relative">
                             {/* Abstract Decorative Elements */}
                             <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                             {/* Main Card */}
                             <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl"
                            >
                                {/* Browser/App Header */}
                                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                     <div className="flex gap-1.5">
                                         <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                         <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                         <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                     </div>
                                     <div className="text-xs text-gray-500 font-mono">mentorship_session.tsx</div>
                                </div>

                                {/* Video Call UI Mockup */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="aspect-video bg-gray-900 rounded-xl relative overflow-hidden border border-white/5 group">
                                         <div className="absolute inset-0 flex items-center justify-center">
                                             <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">VK</div>
                                         </div>
                                         <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                             <span className="text-[10px] text-white font-medium">Vijay Kumar - IIT Mandi</span>
                                         </div>
                                         <div className="absolute top-2 right-2 flex gap-1">
                                             <div className="p-1 rounded bg-black/50 text-white"><Mic size={10} /></div>
                                         </div>
                                    </div>
                                    <div className="aspect-video bg-gray-800 rounded-xl relative overflow-hidden border border-white/5">
                                         <div className="absolute inset-0 flex items-center justify-center">
                                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">Y</div>
                                         </div>
                                         <div className="absolute bottom-3 left-3 text-[10px] text-white font-medium">You</div>
                                    </div>
                                </div>

                                {/* Chat / Review Snippet */}
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">VK</div>
                                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-sm text-gray-300 border border-white/5">
                                            Great work on the useEffect hook! Just one optimization: try to add the dependency array to prevent infinite loops. 🚀
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">Y</div>
                                        <div className="bg-blue-600/20 rounded-2xl rounded-tr-none p-3 text-sm text-blue-100 border border-blue-500/20">
                                            Got it! Fixing it right now. Thanks for the quick review!
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-8 top-20 bg-[#151515] p-4 rounded-xl border border-green-500/20 shadow-xl flex items-center gap-3 z-20"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Next Session</div>
                                        <div className="text-sm font-bold text-white">Tomorrow, 10 AM</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <MessageSquare size={12} />
                                <span>1:1 Guidance</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Master Code with <span className="text-purple-500">Expert Mentorship</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Learning to code is hard. Doing it alone is harder. Our mentorship program simulates a real workplace environment where you get daily feedback.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Unlimited Code Reviews", desc: "Never get stuck for long. Get your code reviewed by pros.", icon: Code2, color: "blue" },
                                    { title: "Weekly Live Connects", desc: "Discuss architecture, debugging, and career advice live.", icon: Video, color: "purple" },
                                    { title: "Mock Interviews", desc: "Practice with engineers from top tech companies.", icon: Users, color: "green" }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex gap-4 group cursor-default"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 group-hover:bg-${item.color}-500 group-hover:text-white transition-all duration-300`}>
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values / Why Choose Us */}
            <section className="py-20 px-4 md:px-8 relative z-10 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose <span className="text-blue-500">Webory?</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We don't just teach code; we build careers. Here is what sets us apart from the rest.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Project-Based Learning", desc: "Learn by doing. Build real-world applications that you can showcase in your portfolio.", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { title: "Industry Mentorship", desc: "Get guidance from IIT faculty and engineers working at top tech companies like Google, Amazon, and Microsoft.", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                            { title: "Career Support", desc: "From resume reviews to mock interviews, we are with you until you land your dream job.", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 rounded-3xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group"
                            >
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20 px-4 md:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Heart size={12} />
                                <span>Our DNA</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Core <span className="text-orange-500">Values</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                These principles guide every decision we make, from the curriculum we design to the community we cultivate. They are the heartbeat of Webory.
                            </p>
                        </div>

                        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Innovation", desc: "We constantly push boundaries to bring the latest tech to our students.", icon: Zap, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/10" },
                                { title: "Community First", desc: "We believe in the power of collaboration and peer-to-peer learning.", icon: Users, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/10" },
                                { title: "Transparency", desc: "We are open, honest, and accountable in everything we do.", icon: Shield, color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/10" },
                                { title: "Excellence", desc: "We strive for the highest quality in our content and mentorship.", icon: Target, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/10" }
                            ].map((value, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className={`glass-card p-6 rounded-2xl border ${value.border} bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all`}
                                >
                                    <div className={`w-10 h-10 ${value.bg} rounded-lg flex items-center justify-center mb-4 ${value.color}`}>
                                        <value.icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {value.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 md:px-8 relative z-10 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <HelpCircle size={12} />
                            <span>Common Questions</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Frequently <span className="text-blue-500">Asked</span></h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Who are the mentors?", a: "Our mentors include distinguished IIT Mandi faculty and industry veterans from top tech companies like Google, Microsoft, Amazon, and Adobe. They bring real-world experience and academic excellence to your learning journey." },
                            { q: "Is this suitable for beginners?", a: "Absolutely! Our curriculum is designed to take you from zero to hero. We start with the basics and progressively move to advanced topics." },
                            { q: "Do I get a certificate?", a: "Yes, you will earn a verifiable certificate upon successful completion of the course and projects, which you can add to your LinkedIn and resume." },
                            { q: "How does the placement support work?", a: "We provide dedicated career support, including resume building, mock interviews, and direct referrals to our network of hiring partners." }
                        ].map((faq, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
                            >
                                <button 
                                    onClick={() => toggleFaq(i)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                                >
                                    <span className={`text-lg font-medium transition-colors ${openFaq === i ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}`}>
                                        {faq.q}
                                    </span>
                                    <ChevronDown 
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-blue-400' : 'group-hover:text-gray-300'}`} 
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* CTA Section */}
            <section className="py-24 px-4 md:px-8 relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto relative glass-card p-12 md:p-16 rounded-3xl text-center border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            Join thousands of students who have transformed their careers with Webory Skills.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-bold shadow-xl shadow-white/5">
                                Get Started Today <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Icon Components for Tech Stack (Simple Wrappers)
function SnakeIcon({ className }: { className?: string }) { // Python
    return <Code2 className={className} />
}

function PenToolIcon({ className }: { className?: string }) { // Figma
    return <Layout className={className} />
}
