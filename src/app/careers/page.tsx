"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Zap, Coffee, ArrowRight } from "lucide-react";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-600">Mission</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                        We're looking for passionate individuals who want to shape the future of education and technology.
                    </p>
                    <Button className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full">
                        View Open Positions
                    </Button>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 md:px-8 bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Work With Us?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We offer more than just a job. We offer a community, growth, and purpose.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6 text-red-400">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Health & Wellness</h3>
                            <p className="text-gray-400">Comprehensive health coverage and wellness programs to keep you at your best.</p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Fast Growth</h3>
                            <p className="text-gray-400">Accelerated career growth with mentorship and learning opportunities.</p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 text-orange-400">
                                <Coffee size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Flexible Work</h3>
                            <p className="text-gray-400">Remote-first culture with flexible hours to maintain work-life balance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Open Positions</h2>

                    <div className="space-y-4">
                        {[
                            { title: "Senior Frontend Engineer", dept: "Engineering", type: "Remote", color: "blue" },
                            { title: "Product Designer", dept: "Design", type: "Remote", color: "purple" },
                            { title: "Content Marketing Manager", dept: "Marketing", type: "Hybrid", color: "green" },
                            { title: "Student Success Lead", dept: "Operations", type: "Remote", color: "orange" },
                        ].map((job, i) => (
                            <div key={i} className="glass-card p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-white/20 transition-all cursor-pointer group">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{job.title}</h3>
                                    <div className="flex gap-3 text-sm text-gray-400">
                                        <span>{job.dept}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-gray-400 group-hover:text-white group-hover:bg-white/10">
                                    Apply Now <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
