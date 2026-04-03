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
const HackathonPreview = dynamic(() => import('@/components/landing/hackathon-preview').then(mod => mod.HackathonPreview));

import dbConnect from "@/lib/db";
import User from "@/models/User";
import Internship from "@/models/Internship";
import Course from "@/models/Course";

// Force dynamic rendering to ensure the user count is up-to-date
// Alternatively we can use revalidate = 60 (seconds) for performance
export const revalidate = 60;

import { 
    SectionSkeleton, 
    FeatureSkeleton, 
    CoursesPreviewSkeleton, 
    TrustProofSkeleton 
} from "@/components/landing/LandingSkeletons";

export default async function Home() {
    let userCount = 0;
    let internshipCount = 0;
    let courseCount = 0;
    let popularCourses: any[] = [];
    try {
        await dbConnect();
        const [users, internships, courses, popular] = await Promise.all([
            User.countDocuments(),
            Internship.countDocuments(), // Simplified as per logic
            Course.countDocuments({ isAvailable: true }),
            Course.find({ isPopular: true, isAvailable: true }).select('title level studentsCount color icon').limit(4).lean(),
        ]);
        
        userCount = users;
        internshipCount = internships; 
        courseCount = courses;
        popularCourses = JSON.parse(JSON.stringify(popular));

    } catch (error) {
        console.error("Failed to fetch counts for landing page", error);
    }

    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero initialUserCount={userCount} initialInternshipCount={internshipCount} initialCourseCount={courseCount} />
            
            <Suspense fallback={<div className="h-40 bg-white/5 animate-pulse" />}>
                <FreeExperienceHighlight />
            </Suspense>

            <Suspense fallback={<FeatureSkeleton />}>
                <Features />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
                <AIRoadmapFlow />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
                <DevLabPreview />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[800px]" />}>
                <AINexusShowcase />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
                <HackathonPreview />
            </Suspense>

            <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="h-64 bg-white/5 rounded-3xl animate-pulse" /></div>}>
                <EnrolledCourses />
            </Suspense>

            <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="h-64 bg-white/5 rounded-3xl animate-pulse" /></div>}>
                <AppliedInternships />
            </Suspense>

            <Suspense fallback={<CoursesPreviewSkeleton />}>
                <CoursesPreview popularCourses={popularCourses} />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[900px]" />}>
                <Internships />
            </Suspense>

            <Suspense fallback={<TrustProofSkeleton />}>
                <TrustProofSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
                <TestimonialsSection />
            </Suspense>

            <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
                <FAQ />
            </Suspense>

            <Footer />
        </main>
    );
}

