"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Users, Target, Heart, Globe } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Next Generation</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        We are on a mission to bridge the gap between education and industry by providing real-world skills, mentorship, and opportunities.
                    </p>
                    <div className="mt-8 flex justify-center">
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
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-white/5 bg-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
                            <div className="text-gray-400">Students</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
                            <div className="text-gray-400">Mentors</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
                            <div className="text-gray-400">Partners</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
                            <div className="text-gray-400">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                            <Target size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            To democratize access to high-quality tech education and career opportunities, ensuring that talent meets opportunity regardless of background or geography.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                        <p className="text-gray-400 leading-relaxed">
                            A world where every aspiring developer, designer, and creator has the tools, guidance, and platform they need to build the future.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section (Placeholder) */}
            {/* <section className="py-20 px-4 md:px-8 bg-white/5"> */}
                {/* <div className="max-w-7xl mx-auto"> */}
                    {/* <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The passionate individuals driving our mission forward.
                        </p>
                    </div> */}

                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1].map((i) => (
                            <div key={i} className="glass-card p-6 rounded-2xl text-center">
                                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
                                <h3 className="text-xl font-bold text-white mb-1">Team Member {i}</h3>
                                <p className="text-blue-400 text-sm mb-3">Position</p>
                                <p className="text-gray-400 text-sm">
                                    Passionate about education and technology. Dedicated to helping students succeed.
                                </p>
                            </div>
                        ))}
                    </div> */}
                {/* </div> */}
            {/* </section> */}

            <Footer />
        </main>
    );
}
