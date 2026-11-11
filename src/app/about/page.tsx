

import nextDynamic from "next/dynamic";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { HeroSection } from "@/components/about/HeroSection";
import { TechStack } from "@/components/about/TechStack";
import { Code2, Layout, PenTool, Hash } from "lucide-react";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Internship from "@/models/Internship";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Webory Skills | Govt. Recognized EdTech by Mohit Sinha",
    description: "Webory Skills is a Govt. Recognized MSME EdTech startup (UDYAM-BR-26-0208472) founded by Mohit Sinha. Explore our mission, leadership, verifiable certificates, live mentorship, and practical engineering cohorts.",
    keywords: [
        "Webory Skills",
        "Mohit Sinha",
        "Mohit Sinha Webory",
        "Govt Recognized EdTech Startup",
        "MSME UDYAM-BR-26-0208472",
        "Full Stack Development Internship",
        "Industrial Training India",
        "Webory Certificate Verification",
        "IIT Mandi Faculty Mentorship",
        "Software Engineering Courses"
    ],
    authors: [{ name: "Mohit Sinha", url: "https://www.linkedin.com/in/mohit0sinha" }],
    creator: "Mohit Sinha",
    publisher: "Webory Skills",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Webory Skills | Govt. Recognized EdTech by Mohit Sinha",
        description: "Bridging the gap between engineering theory and high-impact industrial careers. Founded by Mohit Sinha, Webory Skills is an MSME-certified technical education startup.",
        url: "/about",
        siteName: "Webory Skills",
        images: [
            {
                url: "/sample-certificate.jpg",
                width: 1200,
                height: 630,
                alt: "Webory Skills Official Certificate & Accreditation",
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Webory Skills | Govt. Recognized EdTech by Mohit Sinha",
        description: "Bridging academic theory with real engineering. Founded by Mohit Sinha.",
        images: ["/sample-certificate.jpg"],
    },
};

async function getAboutStats() {
    try {
        await dbConnect();
        const [usersCount, enrollmentsCount, applicationsCount, teachersCount, companies] = await Promise.all([
            User.countDocuments().catch(() => 0),
            Enrollment.countDocuments().catch(() => 0),
            Application.countDocuments().catch(() => 0),
            User.countDocuments({ role: { $in: ["teacher", "admin", "superadmin"] } }).catch(() => 0),
            Internship.distinct("company").catch(() => [])
        ]);

        const totalStudents = Math.max(usersCount, enrollmentsCount + applicationsCount, 100);
        const totalMentors = Math.max(teachersCount, 10);
        const totalPartners = Math.max((companies || []).length, 5);

        return {
            studentsCount: totalStudents,
            mentorsCount: totalMentors,
            partnersCount: totalPartners,
            successRate: 90
        };
    } catch (err) {
        console.error("Failed to load real-time about stats:", err);
        return {
            studentsCount: 100,
            mentorsCount: 10,
            partnersCount: 5,
            successRate: 90
        };
    }
}

// Lazy load sections below the fold
const StatsSection = nextDynamic(() => import("@/components/about/StatsSection").then(mod => mod.StatsSection));
const TrustAccreditationSection = nextDynamic(() => import("@/components/about/TrustAccreditationSection").then(mod => mod.TrustAccreditationSection));
const LearningPath = nextDynamic(() => import("@/components/about/LearningPath").then(mod => mod.LearningPath));
const CertificateShowcase = nextDynamic(() => import("@/components/about/CertificateShowcase").then(mod => mod.CertificateShowcase));
const JourneyTimeline = nextDynamic(() => import("@/components/about/JourneyTimeline").then(mod => mod.JourneyTimeline));
const MissionVision = nextDynamic(() => import("@/components/about/MissionVision").then(mod => mod.MissionVision));
const MentorshipSection = nextDynamic(() => import("@/components/about/MentorshipSection").then(mod => mod.MentorshipSection));
const CoreValues = nextDynamic(() => import("@/components/about/CoreValues").then(mod => mod.CoreValues));
const LeadershipSection = nextDynamic(() => import("@/components/about/LeadershipSection").then(mod => mod.LeadershipSection));
const FaqSection = nextDynamic(() => import("@/components/about/FaqSection").then(mod => mod.FaqSection));
const CtaSection = nextDynamic(() => import("@/components/about/CtaSection").then(mod => mod.CtaSection));

const aboutSchemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "EducationalOrganization",
            "@id": "https://weboryskills.com/#organization",
            "name": "Webory Skills",
            "url": "https://weboryskills.com",
            "logo": "https://weboryskills.com/assets/webory-official-seal.png",
            "description": "Govt. Recognized EdTech Startup (MSME: UDYAM-BR-26-0208472) providing production-grade software engineering, industrial internships, and career mentorship.",
            "founder": {
                "@type": "Person",
                "@id": "https://weboryskills.com/#mohit-sinha",
                "name": "Mohit Sinha",
                "jobTitle": "Founder & CEO",
                "image": "https://weboryskills.com/mohit-sinha.jpg",
                "sameAs": [
                    "https://www.linkedin.com/in/mohit0sinha",
                    "https://github.com/Mohit-Raj62"
                ]
            },
            "sameAs": [
                "https://www.linkedin.com/in/mohit0sinha",
                "https://github.com/Mohit-Raj62"
            ]
        },
        {
            "@type": "Person",
            "@id": "https://weboryskills.com/#mohit-sinha",
            "name": "Mohit Sinha",
            "jobTitle": "Founder & CEO, Webory Skills",
            "image": "https://weboryskills.com/mohit-sinha.jpg",
            "worksFor": {
                "@id": "https://weboryskills.com/#organization"
            },
            "sameAs": [
                "https://www.linkedin.com/in/mohit0sinha",
                "https://github.com/Mohit-Raj62"
            ]
        },
        {
            "@type": "FAQPage",
            "@id": "https://weboryskills.com/about#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Who is the founder of Webory Skills?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Webory Skills was founded by Mohit Sinha, a software engineer and tech entrepreneur passionate about transforming practical technical education in India."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Is Webory Skills government recognized?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, Webory Skills is an officially registered MSME EdTech startup recognized by the Government of India (Registration: UDYAM-BR-26-0208472) with university partnerships like JBIT College."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do students receive verifiable certificates from Webory Skills?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, every graduate receives an official, industry-recognized Certificate of Completion with a unique scan-to-verify QR code and certificate ID that can be verified online and shared on LinkedIn."
                    }
                }
            ]
        }
    ]
};

export default async function AboutPage() {
    const stats = await getAboutStats();

    return (
        <main className="min-h-screen bg-[#050505] selection:bg-blue-500/30 font-sans overflow-x-hidden">
            {/* Structured Data for SEO / Knowledge Graph */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchemaJsonLd) }}
            />

            <Navbar />

            {/* Subtle Professional Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <HeroSection />
            <TrustAccreditationSection />
            <TechStack />
            <StatsSection stats={stats} />
            <JourneyTimeline />
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
