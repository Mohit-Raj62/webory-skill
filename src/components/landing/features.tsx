"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, LayoutDashboard, ShieldCheck, Trophy, Zap, HeartHandshake ,  BriefcaseBusiness,FileUser, Users, Building2, PlayCircle, BrainCircuit } from "lucide-react";

const features = [
    {
        title: "Why students choose Webory Skills",
        items: [
            {
                icon: BookOpen,
                title: "AI-Powered Personalized Roadmap",
                description: "Get a clear, custom learning path tailored to your career goals using AI.",
            },
            {
                icon: Briefcase,
                title: "Industry-Relevant Skills",
                description: "Learn what companies are actually hiring for, not outdated syllabus.",
            },
            {
                icon: HeartHandshake,
                title: "Real-World Projects",
                description: "Build your portfolio by solving real-world problems, not dummy projects.",
            },
             {
                icon: Users,
                title: "Mentor Support",
                description: "Get guidance from IIT Mandi faculty and industry experts at every stage of your learning journey.",
            },
             {
                icon: Trophy,
                title: "Career-Focused Results",
                description: "We focus on making you employable and career-ready, not just collecting certificates.",
            },
            {
                icon: PlayCircle,
                title: "Risk-Free Learning",
                description: "Experience our teaching quality firsthand. The first module of every course is unlocked for free.",
            }
        ],
    },
    {
        title: "Benefits for Students",
        items: [
             {
                icon: ShieldCheck,
                title: "Verified Startup",
                description: "Trust in a registered tech startup dedicated to bringing you the best in project-based learning.",
            },
             {
                icon: Trophy,
                title: "Certification",
                description: "Earn verifiable certificates with QR codes that confirm your achievements and course completions.",
            },
            {
                icon: BriefcaseBusiness,
                title: "Portfolio Builder",
                description: "Build a personal portfolio that presents your projects and skills in a clear and impressive way.",
            },
            {
                icon: FileUser,
                title: "Resume Builder",
                description: "Create polished, professional resumes with smart templates that highlight your strengths.",
            },
            {
                icon: Building2,
                title: "Internship Assistance",
                description: "Get dedicated support and guidance to land top internship opportunities after mastering your skills.",
            },
            {
                icon: BrainCircuit,
                title: "Webory AI Nexus",
                description: "Master interviews and aptitude tests with our advanced AI-powered practice simulations.",
            }
        ],
    },
];

export function Features() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        
        const totalItems = features.reduce((acc, group) => acc + group.items.length, 0);
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % totalItems);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <section id="features" className="py-20 relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 font-outfit tracking-tighter">
                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Webory Skills?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto font-medium">
                        A complete ecosystem designed to bridge the gap between learning and earning.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {features.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-8">
                            <h3 className="text-2xl font-black text-white border-l-4 border-indigo-500 pl-4 font-outfit tracking-tight">
                                {group.title}
                            </h3>
                            <div className="grid gap-6 ">
                                {group.items.map((feature, index) => {
                                    const currentGlobalIndex = (groupIndex === 0 ? 0 : features[0].items.length) + index;
                                    const isActive = activeIndex === currentGlobalIndex;
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: groupIndex === 0 ? -20 : 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, margin: "100px" }}
                                            transition={{ delay: index * 0.1 }}
                                            onMouseEnter={() => setActiveIndex(currentGlobalIndex)}
                                            className={`glass-card p-4 md:p-6 rounded-2xl flex items-start space-x-4 will-change-transform will-change-opacity cursor-pointer transition-all duration-500 ${isActive ? 'bg-white/[0.04] border-indigo-500/30 shadow-[0_10px_40px_-15px_rgba(99,102,241,0.3)] scale-[1.02] -translate-y-1' : 'border-white/5 hover:bg-white/5 hover:-translate-y-0.5'}`}
                                        >
                                            <div className={`p-3 rounded-xl transition-colors duration-500 ${isActive ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/[0.02] text-gray-400'}`}>
                                                <feature.icon size={24} className={isActive ? 'animate-pulse' : ''} />
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-bold mb-2 tracking-tight transition-colors duration-500 ${isActive ? 'text-indigo-300 drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]' : 'text-white'}`}>{feature.title}</h4>
                                                <p className="text-gray-400 text-sm font-medium leading-relaxed">{feature.description}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
