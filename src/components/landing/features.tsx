"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, LayoutDashboard, ShieldCheck, Trophy, Zap } from "lucide-react";

const features = [
    {
        title: "For Students",
        items: [
            {
                icon: BookOpen,
                title: "Skill Courses",
                description: "Access curated courses with video lessons, assignments, and mini-projects.",
            },
            {
                icon: Briefcase,
                title: "Real Internships",
                description: "Apply for internships, track status, and gain real-world experience.",
            },
            {
                icon: Trophy,
                title: "Certificate Engine",
                description: "Earn verifiable certificates with QR codes upon course completion.",
            },
        ],
    },
    {
        title: "For Admins",
        items: [
            {
                icon: LayoutDashboard,
                title: "Comprehensive Dashboard",
                description: "Track student activity, course progress, and platform analytics.",
            },
            {
                icon: ShieldCheck,
                title: "Task Approval",
                description: "Review and approve student tasks and projects efficiently.",
            },
            {
                icon: Zap,
                title: "Automated Workflows",
                description: "Streamline internship management and certificate generation.",
            },
        ],
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Why Choose <span className="text-blue-400">Webory?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A complete ecosystem designed to bridge the gap between learning and earning.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {features.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-8">
                            <h3 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">
                                {group.title}
                            </h3>
                            <div className="grid gap-6">
                                {group.items.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: groupIndex === 0 ? -20 : 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="glass-card p-6 rounded-xl flex items-start space-x-4"
                                    >
                                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
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
