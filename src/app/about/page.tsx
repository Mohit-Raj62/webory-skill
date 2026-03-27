"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { HeroSection } from "@/components/about/HeroSection";
import { TechStack } from "@/components/about/TechStack";
import { Code2, Layout, PenTool, Hash } from "lucide-react";

// Lazy load sections below the fold
const StatsSection = dynamic(() => import("@/components/about/StatsSection").then(mod => mod.StatsSection), { ssr: false });
const LearningPath = dynamic(() => import("@/components/about/LearningPath").then(mod => mod.LearningPath), { ssr: false });
const CertificateShowcase = dynamic(() => import("@/components/about/CertificateShowcase").then(mod => mod.CertificateShowcase), { ssr: false });
const MissionVision = dynamic(() => import("@/components/about/MissionVision").then(mod => mod.MissionVision), { ssr: false });
const MentorshipSection = dynamic(() => import("@/components/about/MentorshipSection").then(mod => mod.MentorshipSection), { ssr: false });
const CoreValues = dynamic(() => import("@/components/about/CoreValues").then(mod => mod.CoreValues), { ssr: false });
const LeadershipSection = dynamic(() => import("@/components/about/LeadershipSection").then(mod => mod.LeadershipSection), { ssr: false });
const FaqSection = dynamic(() => import("@/components/about/FaqSection").then(mod => mod.FaqSection), { ssr: false });
const CtaSection = dynamic(() => import("@/components/about/CtaSection").then(mod => mod.CtaSection), { ssr: false });

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#050505] selection:bg-blue-500/30 font-sans overflow-x-hidden">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <HeroSection />
            <TechStack />
            <StatsSection />
            <LearningPath />
            <CertificateShowcase />
            <MissionVision />
            <MentorshipSection />
            <CoreValues />
            <LeadershipSection />
            <FaqSection />
            <CtaSection />

            <Footer />
        </main>
    );
}

// Icon Components for Tech Stack (Simple Wrappers)
function SnakeIcon({ className }: { className?: string }) { // Python
    return (
        <div className={className}>
             <Hash size={24} />
        </div>
    );
}

function PenToolIcon({ className }: { className?: string }) { // Figma
    return (
        <div className={className}>
             <PenTool size={24} />
        </div>
    );
}
