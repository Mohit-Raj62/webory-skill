import Link from "next/link"; // Not needed but avoiding removing unused imports if any
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { EnrolledCourses } from "@/components/landing/enrolled-courses";
import { AppliedInternships } from "@/components/landing/applied-internships";
import { CoursesPreview } from "@/components/landing/courses-preview";
import { Internships } from "@/components/landing/internships";
import { TrustProofSection } from "@/components/landing/trust-proof";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/ui/footer";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Internship from "@/models/Internship";
import Course from "@/models/Course";

// Force dynamic rendering to ensure the user count is up-to-date
// Alternatively we can use revalidate = 60 (seconds) for performance
export const revalidate = 60;

import { AIRoadmapFlow } from "@/components/landing/ai-roadmap-flow";
import { DevLabPreview } from "@/components/landing/devlab-preview";



import { FreeExperienceHighlight } from "@/components/landing/free-experience";
import { AINexusShowcase } from "@/components/landing/ai-nexus-showcase";


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
