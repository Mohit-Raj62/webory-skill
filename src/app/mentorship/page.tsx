"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { UserCheck, Rocket, Shield, MessageCircle, Check } from "lucide-react";

export default function MentorshipPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 md:px-8 bg-gradient-to-b from-purple-900/20 to-transparent">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Master Your Craft with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Expert Guidance</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                        Get personalized mentorship from industry veterans who have walked the path you're on. Accelerate your career growth today.
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 rounded-full">
                        Find a Mentor
                    </Button>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            A simple, proven process to help you reach your goals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-card p-8 rounded-2xl text-center relative">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 text-2xl font-bold border border-blue-500/30">1</div>
                            <h3 className="text-xl font-bold text-white mb-3">Match</h3>
                            <p className="text-gray-400">Tell us your goals and we'll match you with a mentor who has the exact expertise you need.</p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl text-center relative">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400 text-2xl font-bold border border-purple-500/30">2</div>
                            <h3 className="text-xl font-bold text-white mb-3">Plan</h3>
                            <p className="text-gray-400">Work with your mentor to create a personalized roadmap and set achievable milestones.</p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl text-center relative">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400 text-2xl font-bold border border-green-500/30">3</div>
                            <h3 className="text-xl font-bold text-white mb-3">Grow</h3>
                            <p className="text-gray-400">Regular sessions, code reviews, and feedback to help you level up your skills rapidly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 px-4 md:px-8 bg-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why You Need a Mentor</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0 text-blue-400">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Accelerate Learning</h3>
                                    <p className="text-gray-400">Avoid common pitfalls and learn best practices faster than self-study.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0 text-purple-400">
                                    <UserCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Career Guidance</h3>
                                    <p className="text-gray-400">Get advice on resume, interviews, and salary negotiation from insiders.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0 text-green-400">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Accountability</h3>
                                    <p className="text-gray-400">Stay on track with regular check-ins and goal setting.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">Mentorship Plans</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Standard</h4>
                                    <p className="text-sm text-gray-400">1 Session / Month</p>
                                </div>
                                <span className="text-xl font-bold text-white">₹999/mo</span>
                            </div>
                            <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">POPULAR</div>
                                <div>
                                    <h4 className="font-bold text-white">Pro</h4>
                                    <p className="text-sm text-gray-300">4 Sessions / Month</p>
                                </div>
                                <span className="text-xl font-bold text-white">₹2,999/mo</span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Elite</h4>
                                    <p className="text-sm text-gray-400">Weekly + Chat Support</p>
                                </div>
                                <span className="text-xl font-bold text-white">₹5,999/mo</span>
                            </div>
                        </div>
                        <Button className="w-full mt-8 bg-white text-black hover:bg-gray-200">
                            Get Started
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 md:px-8 text-center">
                <div className="max-w-3xl mx-auto glass-card p-12 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Level Up?</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Join hundreds of developers who have transformed their careers through mentorship.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl">
                            Find a Mentor
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl">
                            Become a Mentor
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
