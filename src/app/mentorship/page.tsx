"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { UserCheck, Rocket, Shield, MessageCircle, Check, Mic, Video, Calendar, MessageSquare, Code2, Users, ArrowRight, Star, Zap, Trophy, Target } from "lucide-react";
import { toast } from "sonner";
import { MentorshipPaymentModal } from "@/components/mentorship/mentorship-payment-modal";
import { motion } from "framer-motion";

export default function MentorshipPage() {
    const [mentorshipEnabled, setMentorshipEnabled] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const plans = [
        {
            id: "standard",
            name: "Standard",
            price: 999,
            features: "1 Session / Month",
            description: "Perfect for getting started",
            color: "white"
        },
        {
            id: "pro",
            name: "Pro",
            price: 2999,
            features: "4 Sessions / Month",
            description: "Most popular choice",
            popular: true,
            color: "purple"
        },
        {
            id: "elite",
            name: "Elite",
            price: 5999,
            features: "Weekly + Chat Support",
            description: "Maximum growth",
            color: "white"
        }
    ];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setMentorshipEnabled(data.mentorshipEnabled);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    const handleButtonClick = () => {
        if (!mentorshipEnabled) {
            toast.info("Mentorship is coming soon! Stay tuned.");
        } else {
            setIsModalOpen(true);
        }
    };

    const scrollToPlans = () => {
        const plansSection = document.getElementById('plans');
        plansSection?.scrollIntoView({ behavior: 'smooth' });
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan) || plans[1];

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:px-8 bg-gradient-to-b from-purple-900/20 to-transparent overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2 text-left relative z-10">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Master Your Craft with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Expert Guidance</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
                                Get personalized mentorship from industry veterans who have walked the path you're on. 
                                <span className="block mt-2 text-gray-300">
                                    Simulating a real workplace environment with daily code reviews, 1:1 sessions, and career mapping.
                                </span>
                            </p>
                            <div className="flex gap-4">
                                <Button 
                                    className={`text-lg px-8 py-6 rounded-full shadow-lg shadow-purple-900/20 ${mentorshipEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                                    onClick={mentorshipEnabled ? scrollToPlans : handleButtonClick}
                                    disabled={!mentorshipEnabled}
                                >
                                    {mentorshipEnabled ? "Find a Mentor" : "Coming Soon"}
                                </Button>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-gray-700"></div>
                                        ))}
                                    </div>
                                    <span>Joined by 500+ devs</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative z-10">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl"
                            >
                                {/* Browser/App Header */}
                                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                     <div className="flex gap-1.5">
                                         <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                         <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                         <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                     </div>
                                     <div className="flex items-center gap-2 text-xs text-gray-500 font-mono ml-auto">
                                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                         Live Session
                                     </div>
                                </div>

                                {/* Video Call UI Mockup */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="aspect-video bg-gray-900 rounded-xl relative overflow-hidden border border-white/5 group">
                                         <div className="absolute inset-0 flex items-center justify-center">
                                             <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">M</div>
                                         </div>
                                         <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                             <span className="text-[10px] text-white font-medium">Mentor (Ex-Google)</span>
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
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">M</div>
                                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-3 text-sm text-gray-300 border border-white/5">
                                            Let's optimize this API call. Adding a caching layer here would reduce latency by 40%. ⚡
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">Y</div>
                                        <div className="bg-blue-600/20 rounded-2xl rounded-tr-none p-3 text-sm text-blue-100 border border-blue-500/20">
                                            Makes sense! Do you recommend Redis or just in-memory for now?
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-4 top-20 bg-[#151515] p-3 rounded-xl border border-green-500/20 shadow-xl flex items-center gap-3 z-20"
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-400">Next Review</div>
                                        <div className="text-xs font-bold text-white">Tomorrow, 10 AM</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                            
                            {/* Abstract Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/10 blur-[80px] pointer-events-none -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works - Connected Steps */}
            <section className="py-24 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Rocket size={12} />
                            <span>Three Simple Steps</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How It <span className="text-blue-500">Works</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            We have streamlined the process to get you from "stuck" to "unstoppable" in no time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                         {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 border-t border-dashed border-white/10 z-0"></div>

                        {[
                            { title: "Match", desc: "Share your goals. We pair you with a mentor who has walked your exact path.", icon: Users, color: "blue" },
                            { title: "Plan", desc: "Get a custom roadmap. No more guessing what to learn next.", icon: Target, color: "purple" },
                            { title: "Grow", desc: "Weekly 1:1s and code reviews to accelerate your career velocity.", icon: Zap, color: "green" }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 group">
                                <div className="text-center">
                                    <div className={`w-24 h-24 mx-auto bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-${step.color}-900/20`}>
                                        <div className={`absolute inset-0 bg-${step.color}-500/10 rounded-full blur-xl group-hover:bg-${step.color}-500/20 transition-all`}></div>
                                        <step.icon size={32} className={`text-${step.color}-400 ml-1`} />
                                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-${step.color}-600 border-4 border-[#0a0a0a] flex items-center justify-center text-white font-bold text-sm`}>
                                            {i + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed px-4">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits - Bento Grid */}
             <section className="py-24 px-4 md:px-8 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why You Need a <span className="text-purple-500">Mentor</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Self-learning is great, but guided learning is 10x faster. Break through plateaus.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
                        {/* Large Card 1 */}
                        <div className="md:col-span-2 glass-card p-8 rounded-3xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                             <div className="relative z-10">
                                 <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                     <Rocket size={24} />
                                 </div>
                                 <h3 className="text-2xl font-bold text-white mb-3">Accelerate Your Learning Curve</h3>
                                 <p className="text-gray-400 text-lg max-w-md">
                                     Don't waste months on tutorials that don't stick. Get a structured path and learn the "why" behind the code, not just the syntax.
                                 </p>
                             </div>
                        </div>

                        {/* Tall Card */}
                        <div className="md:row-span-2 glass-card p-8 rounded-3xl relative overflow-hidden group bg-gradient-to-b from-white/[0.03] to-purple-500/[0.05] border-purple-500/20">
                             <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <div className="relative z-10 flex flex-col h-full">
                                 <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                                     <Trophy size={24} />
                                 </div>
                                 <h3 className="text-2xl font-bold text-white mb-3">Career Fast-Track</h3>
                                 <p className="text-gray-400 mb-8 flex-grow">
                                     From optimizing your LinkedIn to salary negotiation, we guide you through every step of landing your dream job.
                                 </p>
                                 <div className="mt-auto p-4 bg-black/40 rounded-xl border border-white/5">
                                     <div className="flex items-center gap-3 mb-2">
                                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                         <span className="text-xs text-gray-400 uppercase tracking-widest">Success Story</span>
                                     </div>
                                     <p className="text-sm text-gray-300 italic">"I doubled my salary in 4 months after joining the mentorship program."</p>
                                     <div className="mt-3 flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                                         <span className="text-xs text-gray-500">Rahul, SDE-2</span>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
                                     <Shield size={24} />
                                 </div>
                                 <h3 className="text-xl font-bold text-white mb-2">Code Quality Accountability</h3>
                                 <p className="text-gray-400">
                                     Write production-ready code from day one. Get strict code reviews that fix bad habits.
                                 </p>
                            </div>
                        </div>

                         {/* Card 4 */}
                        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6">
                                     <UserCheck size={24} />
                                 </div>
                                 <h3 className="text-xl font-bold text-white mb-2">Network with Insiders</h3>
                                 <p className="text-gray-400">
                                     Get internal referrals. Your mentor becomes your advocate in the industry.
                                 </p>
                            </div>
                        </div>
                    </div>
                </div>
             </section>

            {/* Pricing Section */}
            <section id="plans" className="py-24 px-4 md:px-8 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Pricing</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Invest in yourself. No hidden fees. Cancel anytime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id}
                                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                                    plan.popular 
                                    ? 'bg-[#0f0f0f] border-2 border-purple-500 shadow-2xl shadow-purple-900/20 scale-105 z-10' 
                                    : 'bg-[#0a0a0a] border border-white/10 hover:border-white/20'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-lg">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white">₹{plan.price.toLocaleString('en-IN')}</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-4">{plan.description}</p>
                                </div>

                                <div className="w-full h-px bg-white/10 mb-8"></div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <Check className={`w-5 h-5 ${plan.popular ? 'text-purple-400' : 'text-gray-500'}`} />
                                        <span>{plan.features}</span>
                                    </li>
                                     {/* Mock additional features to make the list look full */}
                                     <li className="flex items-center gap-3 text-gray-300">
                                        <Check className={`w-5 h-5 ${plan.popular ? 'text-purple-400' : 'text-gray-500'}`} />
                                        <span>Access to Community</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <Check className={`w-5 h-5 ${plan.popular ? 'text-purple-400' : 'text-gray-500'}`} />
                                        <span>Curated Resources</span>
                                    </li>
                                    {plan.id !== 'standard' && (
                                         <li className="flex items-center gap-3 text-gray-300">
                                            <Check className={`w-5 h-5 ${plan.popular ? 'text-purple-400' : 'text-gray-500'}`} />
                                            <span>Career Roadmap</span>
                                        </li>
                                    )}
                                     {plan.id === 'elite' && (
                                         <li className="flex items-center gap-3 text-gray-300">
                                            <Check className={`w-5 h-5 text-purple-400`} />
                                            <span>Direct WhatsApp Access</span>
                                        </li>
                                    )}
                                </ul>

                                <Button 
                                    className={`w-full py-6 text-lg rounded-xl ${
                                        plan.popular 
                                        ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/40' 
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                    } ${!mentorshipEnabled && 'opacity-50 cursor-not-allowed'}`}
                                    onClick={() => {
                                        if(mentorshipEnabled) {
                                            setSelectedPlan(plan.id);
                                            setIsModalOpen(true);
                                        } else {
                                            handleButtonClick();
                                        }
                                    }}
                                    disabled={!mentorshipEnabled}
                                >
                                    {mentorshipEnabled ? "Choose Plan" : "Coming Soon"}
                                </Button>
                            </div>
                        ))}
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
                        <Button 
                            className={`text-lg px-8 py-6 rounded-xl ${mentorshipEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                            onClick={mentorshipEnabled ? scrollToPlans : handleButtonClick}
                            disabled={!mentorshipEnabled}
                        >
                            {mentorshipEnabled ? "Find a Mentor" : "Coming Soon"}
                        </Button>
                        <Button 
                            variant="outline" 
                            className={`text-lg px-8 py-6 rounded-xl ${mentorshipEnabled ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-600 text-gray-400 cursor-not-allowed'}`}
                            onClick={mentorshipEnabled ? scrollToPlans : handleButtonClick}
                            disabled={!mentorshipEnabled}
                        >
                            {mentorshipEnabled ? "Become a Mentor" : "Coming Soon"}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />

            <MentorshipPaymentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={selectedPlanData.id}
                amount={selectedPlanData.price}
            />
        </main>
    );
}
