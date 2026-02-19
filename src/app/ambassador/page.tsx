"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { ArrowRight, Trophy, Users, Gift, Star, Rocket, Target, Zap, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AmbassadorPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10"></div>

        <div className="container mx-auto px-4 text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6">
              🚀 Join the Elite Community
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-tight">
              Lead the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">Future</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Become the face of Webory at your campus. Gain leadership skills, earn exclusive rewards, and build a powerful network with industry experts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/ambassador/register">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 text-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
               </Link>
               <Link href="#benefits">
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg font-medium backdrop-blur-sm">
                      Learn More
                  </Button>
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <StatItem number="50+" label="Colleges" />
                <StatItem number="500+" label="Ambassadors" />
                <StatItem number="10k+" label="Students Impacted" />
                <StatItem number="₹5L+" label="Rewards Distributed" />
            </div>
        </div>
      </section>

      {/* Partner Campuses Marquee */}
      <section className="py-10 border-b border-white/5 bg-black/40 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
        
        <div className="flex gap-12 animate-scroll w-max">
            {[...CAMPUSES, ...CAMPUSES].map((campus, index) => (
                <span key={index} className="text-xl md:text-2xl font-bold text-white/20 whitespace-nowrap uppercase tracking-widest hover:text-white/40 transition-colors cursor-default">
                    {campus}
                </span>
            ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
         <div className="container mx-auto px-4">
            <SectionHeader title="How It Works" subtitle="Your journey from application to leadership in 4 simple steps." />
            
            <div className="relative max-w-4xl mx-auto">
                {/* Connecting Line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:left-1/2 md:-ml-[1px]"></div>

                <TimelineItem 
                    step="01"
                    title="Submit Application"
                    description="Fill out the form with your details and tell us why you'd be a great leader."
                    align="left"
                    color="text-blue-400"
                    bg="bg-blue-500"
                />
                <TimelineItem 
                    step="02"
                    title="Profile Review"
                    description="Our team reviews your profile. We look for passion, not just experience."
                    align="right"
                    color="text-purple-400"
                    bg="bg-purple-500"
                />
                <TimelineItem 
                    step="03"
                    title="Onboarding Call"
                    description="Get briefed on your roles, access the dashboard, and meet your mentor."
                    align="left"
                    color="text-pink-400"
                    bg="bg-pink-500"
                />
                <TimelineItem 
                    step="04"
                    title="Start Leading"
                    description="The campus is yours! Host events, share codes, and start earning rewards."
                    align="right"
                    color="text-green-400"
                    bg="bg-green-500"
                />
            </div>
         </div>
      </section>





      {/* Benefits Section */}
      <section id="benefits" className="py-24 relative">
        <div className="container mx-auto px-4">
            <SectionHeader title="Why Join Us?" subtitle="Unlock exclusive perks tailored for your growth." />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BenefitCard 
                    icon={<Trophy className="text-yellow-400" size={32} />}
                    title="Official Certificate"
                    description="Get a recognized Campus Ambassador certificate from a Govt. (MSME) registered platform."
                    color="bg-yellow-500/10 border-yellow-500/20"
                />
                 <BenefitCard 
                    icon={<Gift className="text-pink-400" size={32} />}
                    title="Rewards & Swag"
                    description="Earn points to redeem Amazon Vouchers, T-shirts, Hoodies, Notebooks, and more."
                    color="bg-pink-500/10 border-pink-500/20"
                />
                 <BenefitCard 
                    icon={<Users className="text-blue-400" size={32} />}
                    title="Mentorship"
                    description="Direct access to mentors from IITs and top tech companies for career guidance."
                    color="bg-blue-500/10 border-blue-500/20"
                />
                 <BenefitCard 
                    icon={<Zap className="text-purple-400" size={32} />}
                    title="Free Courses"
                    description="Top performers get premium courses for free. Plus, your friends get a 5% discount!"
                    color="bg-purple-500/10 border-purple-500/20"
                />
                 <BenefitCard 
                    icon={<Target className="text-green-400" size={32} />}
                    title="Leadership Role"
                    description="Lead workshops and events in your college. Build your personal brand."
                    color="bg-green-500/10 border-green-500/20"
                />
                 <BenefitCard 
                    icon={<Globe className="text-cyan-400" size={32} />}
                    title="Networking"
                    description="Connect with like-minded student leaders from colleges across the country."
                    color="bg-cyan-500/10 border-cyan-500/20"
                />
            </div>
        </div>
      </section>


      {/* Roles & Responsibilities */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] opacity-30"></div>

        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-16 items-center">
                <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Role as a <br/><span className="text-blue-500">Leader</span></h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        As a Campus Ambassador, you are the bridge between Webory and your college. You will be responsible for creating awareness and building a community of tech enthusiasts.
                    </p>
                    
                    <ul className="space-y-6">
                        <RoleItem title="Represent Webory" description="Be the official face of Webory Skills in your campus." />
                        <RoleItem title="Organize Events" description="Conduct workshops, hackathons, and seminars with our support." />
                        <RoleItem title="Social Media Branding" description="Promote our initiatives on your social media channels." />
                        <RoleItem title="Build Community" description="Help students learn about our courses and internships." />
                    </ul>
                </div>
                <div className="flex-1 relative">
                    <div className="relative z-10 grid grid-cols-2 gap-4">
                        <div className="space-y-4 mt-8">
                             <div className="h-48 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 flex flex-col justify-end transform hover:-translate-y-2 transition-transform">
                                <Users className="text-blue-500 mb-4" size={32} />
                                <span className="font-bold text-xl">Community</span>
                             </div>
                             <div className="h-64 bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-end transform hover:-translate-y-2 transition-transform">
                                <Rocket className="text-purple-500 mb-4" size={32} />
                                <span className="font-bold text-xl">Growth</span>
                             </div>
                        </div>
                        <div className="space-y-4">
                             <div className="h-64 bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-2xl p-6 flex flex-col justify-end transform hover:-translate-y-2 transition-transform">
                                <Star className="text-yellow-500 mb-4" size={32} />
                                <span className="font-bold text-xl">Leadership</span>
                             </div>
                             <div className="h-48 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 flex flex-col justify-end transform hover:-translate-y-2 transition-transform">
                                <Sparkles className="text-pink-500 mb-4" size={32} />
                                <span className="font-bold text-xl">Impact</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden backdrop-blur-sm">
                
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10"></div>

                <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Start Your Journey?</h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Join thousands of other student leaders. Apply now and take the first step towards a rewarding career.
                </p>
                
                <Link href="/ambassador/register">
                    <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105">
                        Apply for Free <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StatItem({ number, label }: { number: string, label: string }) {
    return (
        <div>
            <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600 mb-2">
                {number}
            </div>
            <div className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-wider">
                {label}
            </div>
        </div>
    )
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>
    )
}

function BenefitCard({ icon, title, description, color }: any) {
    return (
        <div className={`p-8 rounded-3xl border ${color} bg-black/40 backdrop-blur-sm hover:-translate-y-2 transition-all duration-300 group`}>
            <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function RoleItem({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="mt-1 p-1 rounded-full bg-blue-500/20 text-blue-400">
                <CheckCircle2 size={20} />
            </div>
            <div>
                <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
        </div>
    )
}

const CAMPUSES = [
    "IIT Bombay", "BITS Pilani", "IIT Delhi", "NIT Trichy", "DTU", 
    "VIT Vellore", "SRM University", "Manipal", "IIIT Hyderabad", 
    "Anna University", "Jadavpur University", "Thapar University",
    "NIT Warangal", "IIT Kharagpur", "IIIT Delhi", "NSUT"
];

function TimelineItem({ step, title, description, align, color, bg }: any) {
    return (
        <div className={`relative flex items-center justify-between md:justify-normal gap-8 mb-12 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
             
             {/* Text Content */}
             <div className={`flex-1 ml-12 md:ml-0 ${align === 'right' ? 'md:text-right' : 'text-left'}`}>
                <h3 className={`text-2xl font-bold mb-2 ${color}`}>{title}</h3>
                <p className="text-gray-400">{description}</p>
             </div>

             {/* Center Nob */}
             <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full border-4 border-[#050505] bg-[#111] flex items-center justify-center z-10 shadow-xl shadow-purple-500/20">
                <div className={`w-3 h-3 rounded-full ${bg} animate-pulse`}></div>
             </div>

             {/* Number (Empty space for balance on desktop) */}
             <div className="hidden md:block flex-1 text-center opacity-10 font-black text-6xl select-none">
                {step}
             </div>
        </div>
    )
}
