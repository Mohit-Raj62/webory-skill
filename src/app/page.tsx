import Link from "next/link"; // Not needed but avoiding removing unused imports if any
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import { FreeExperienceHighlight } from "@/components/landing/free-experience";
import dynamic from 'next/dynamic';

const Features = dynamic(() => import('@/components/landing/features').then(mod => mod.Features));
const EnrolledCourses = dynamic(() => import('@/components/landing/enrolled-courses').then(mod => mod.EnrolledCourses));
const AppliedInternships = dynamic(() => import('@/components/landing/applied-internships').then(mod => mod.AppliedInternships));
const CoursesPreview = dynamic(() => import('@/components/landing/courses-preview').then(mod => mod.CoursesPreview));
const Internships = dynamic(() => import('@/components/landing/internships').then(mod => mod.Internships));
const TrustProofSection = dynamic(() => import('@/components/landing/trust-proof').then(mod => mod.TrustProofSection));
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection').then(mod => mod.TestimonialsSection));
const FAQ = dynamic(() => import('@/components/landing/faq').then(mod => mod.FAQ));
const Footer = dynamic(() => import('@/components/ui/footer').then(mod => mod.Footer));
const AIRoadmapFlow = dynamic(() => import('@/components/landing/ai-roadmap-flow').then(mod => mod.AIRoadmapFlow));
const DevLabPreview = dynamic(() => import('@/components/landing/devlab-preview').then(mod => mod.DevLabPreview));
const AINexusShowcase = dynamic(() => import('@/components/landing/ai-nexus-showcase').then(mod => mod.AINexusShowcase));

import dbConnect from "@/lib/db";
import User from "@/models/User";
import Internship from "@/models/Internship";
import Course from "@/models/Course";

// Force dynamic rendering to ensure the user count is up-to-date
// Alternatively we can use revalidate = 60 (seconds) for performance
export const revalidate = 60;

export default async function Home() {
    let userCount = 0;
    let internshipCount = 0;
    let courseCount = 0;
    let popularCourses: any[] = [];
    try {
        await dbConnect();
        // Fetch all data in parallel
        const [users, internships, courses, popular] = await Promise.all([
            User.countDocuments(),
            Internship.countDocuments({ status: 'active' }),
            Course.countDocuments({ isAvailable: true }),
            Course.find({ isPopular: true, isAvailable: true }).select('title level studentsCount color icon').limit(4).lean(),
        ]);
        
        userCount = users;
        // internshipCount = internships; 
        // Logic: specific count.
        internshipCount = await Internship.countDocuments(); // Keeping total count for now as per previous step
        courseCount = courses;
        popularCourses = JSON.parse(JSON.stringify(popular)); // Serialize mongo objects

    } catch (error) {
        console.error("Failed to fetch counts for landing page", error);
    }

    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero initialUserCount={userCount} initialInternshipCount={internshipCount} initialCourseCount={courseCount} />
            <FreeExperienceHighlight />
            <Features />
            <AIRoadmapFlow />
            <DevLabPreview />
            <AINexusShowcase />

            <EnrolledCourses />
            <AppliedInternships />
            <CoursesPreview popularCourses={popularCourses} />
            <Internships />
            <TrustProofSection />
            <TestimonialsSection />
            <FAQ />
            <Footer />
        </main>
    );
}
