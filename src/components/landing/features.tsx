"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, LayoutDashboard, ShieldCheck, Trophy, Zap, HeartHandshake ,  BriefcaseBusiness,FileUser, Users, Building2, PlayCircle, BrainCircuit } from "lucide-react";

const features = [
    {
        title: "Why students choose Webory Skills",
        items: [
            {
                icon: BookOpen,
                title: "AI-Generated Personalized Roadmap",
                description: "Get a clear, custom learning path tailored to your career goals using AI.",
            },
            {
                icon: Briefcase,
                title: "Industry-Relevant Skills",
                description: "Learn what companies are actually hiring for, not outdated syllabus.",
            },
            {
                icon: HeartHandshake,
                title: "Real Projects & Problems",
                description: "Build your portfolio by solving real-world problems, not dummy projects.",
            },
             {
                icon: Users,
                title: "Mentor Support",
                description: "Get guidance from IIT Mandi faculty and industry experts at every stage of your learning journey.",
            },
             {
                icon: Trophy,
                title: "Career-Focused Outcomes",
                description: "We focus on making you employable and career-ready, not just collecting certificates.",
            },
            {
                icon: PlayCircle,
                title: "Zero-Risk Exploration",
                description: "Experience our teaching quality firsthand. The first module of every course is unlocked for free.",
            }
        ],
    },
    {
        title: "Benefits for Students",
        items: [
             {
                icon: ShieldCheck,
                title: "Government Recognized",
                description: "Trust in a platform that is officially registered and recognized by the Ministry of MSME, Govt. of India.",
            },
             {
                icon: Trophy,
                title: "Certificate",
                description: "Earn verifiable certificates with QR codes that confirm your achievements and course completions.",
            },
            {
                icon: BriefcaseBusiness,
                title: "Portfolio Builder",
                description: "Build a personal portfolio that presents your projects and skills in a clear and impressive way.",
            },
            {
                icon: FileUser,
                title: "Resume Build",
                description: "Create polished, professional resumes with smart templates that highlight your strengths.",
            },
            {
                icon: Building2,
                title: "Internship Support",
                description: "Unlock exclusive internship opportunities to gain work experience while you learn.",
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
    return (
        <section id="features" className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Why <span className="text-emerald-400">Webory Skills?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A complete ecosystem designed to bridge the gap between learning and earning.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {features.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-8">
                            <h3 className="text-2xl font-bold text-white border-l-4 border-emerald-500 pl-4">
                                {group.title}
                            </h3>
                            <div className="grid gap-6 ">
                                {group.items.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: groupIndex === 0 ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-card p-4 md:p-6 rounded-xl flex items-start space-x-4"
                                    >
                                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                                            <feature.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                            <p className="text-gray-400 text-sm">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
