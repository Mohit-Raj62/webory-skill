import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import dynamic from 'next/dynamic';

const WhyWeboryAndTrust = dynamic(() => import('@/components/landing/why-webory-trust').then(mod => mod.WhyWeboryAndTrust));
const EnrolledCourses = dynamic(() => import('@/components/landing/enrolled-courses').then(mod => mod.EnrolledCourses));
const AppliedInternships = dynamic(() => import('@/components/landing/applied-internships').then(mod => mod.AppliedInternships));
const CoursesPreview = dynamic(() => import('@/components/landing/courses-preview').then(mod => mod.CoursesPreview));
const VideoTestimonialsSection = dynamic(() => import('@/components/landing/video-testimonials').then(mod => mod.VideoTestimonialsSection));
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection').then(mod => mod.TestimonialsSection));
const Footer = dynamic(() => import('@/components/ui/footer').then(mod => mod.Footer));
const DevLabPreview = dynamic(() => import('@/components/landing/devlab-preview').then(mod => mod.DevLabPreview));
const AINexusShowcase = dynamic(() => import('@/components/landing/ai-nexus-showcase').then(mod => mod.AINexusShowcase));
const HackathonPreview = dynamic(() => import('@/components/landing/hackathon-preview').then(mod => mod.HackathonPreview));
const LeaderboardSection = dynamic(() => import('@/components/home/LeaderboardSection').then(mod => mod.LeaderboardSection));
const LiveStudentActivity = dynamic(() => import('@/components/ui/LiveStudentActivity').then(mod => mod.LiveStudentActivity));

import dbConnect from "@/lib/db";
import User from "@/models/User";
import Internship from "@/models/Internship";
import Course from "@/models/Course";

// Force dynamic rendering to ensure the user count is up-to-date
// Alternatively we can use revalidate = 60 (seconds) for performance
export const revalidate = 60;

import { Suspense } from "react";
import { 
    SectionSkeleton, 
    FeatureSkeleton, 
    CoursesPreviewSkeleton 
} from "@/components/landing/LandingSkeletons";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default async function Home() {
    let userCount = 0;
    let internshipCount = 0;
    let courseCount = 0;
    let popularCourses: any[] = [];
    let leaderboardData: any[] = [];
    let dynamicCourses: any[] = [];
    let dynamicInternships: any[] = [];

    try {
        await dbConnect();
        const [users, internships, courses, popular, topLearners, latestCourses, latestInternships] = await Promise.all([
            User.countDocuments(),
            Internship.countDocuments({ isActive: { $ne: false } }),
            Course.countDocuments({ isAvailable: true }),
            Course.find({ isPopular: true, isAvailable: true }).select('title level studentsCount color icon').limit(4).lean(),
            User.find({ role: "student", xp: { $gt: 0 } }).sort({ xp: -1 }).limit(50).select("firstName lastName avatar xp").lean(),
            Course.find({ isAvailable: true }).select('title slug').sort({ createdAt: -1 }).limit(4).lean(),
            Internship.find({ isActive: { $ne: false } }).select('title slug').sort({ createdAt: -1 }).limit(4).lean(),
        ]);
        
        userCount = users;
        internshipCount = internships; 
        courseCount = courses;
        popularCourses = JSON.parse(JSON.stringify(popular));
        leaderboardData = JSON.parse(JSON.stringify(topLearners));
        dynamicCourses = JSON.parse(JSON.stringify(latestCourses || []));
        dynamicInternships = JSON.parse(JSON.stringify(latestInternships || []));

    } catch (error) {
        console.error("Failed to fetch counts for landing page", error);
    }

    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar />
            <Hero 
                initialUserCount={userCount} 
                initialInternshipCount={internshipCount} 
                initialCourseCount={courseCount}
                courses={dynamicCourses}
                internships={dynamicInternships}
            />
            

            <ScrollReveal style="3d-tilt">
                <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="h-64 bg-white/5 rounded-3xl animate-pulse" /></div>}>
                    <LeaderboardSection initialLearners={leaderboardData} />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="fade-up">
                <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
                    <VideoTestimonialsSection />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="fade-up">
                <Suspense fallback={<FeatureSkeleton />}>
                    <WhyWeboryAndTrust />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="3d-tilt">
                <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
                    <DevLabPreview />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="fade-up">
                <Suspense fallback={<SectionSkeleton height="h-[800px]" />}>
                    <AINexusShowcase />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="scale-up">
                <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
                    <HackathonPreview />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="3d-tilt">
                <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="h-64 bg-white/5 rounded-3xl animate-pulse" /></div>}>
                    <EnrolledCourses />
                </Suspense>
            </ScrollReveal>

            <ScrollReveal style="fade-up">
                <Suspense fallback={<div className="container mx-auto px-4 py-12"><div className="h-64 bg-white/5 rounded-3xl animate-pulse" /></div>}>
                    <AppliedInternships />
                </Suspense>
            </ScrollReveal>



            <ScrollReveal style="fade-up">
                <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
                    <TestimonialsSection />
                </Suspense>
            </ScrollReveal>


            <LiveStudentActivity />
            <Footer />
        </main>
    );
}

