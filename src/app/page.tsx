import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { EnrolledCourses } from "@/components/landing/enrolled-courses";
import { AppliedInternships } from "@/components/landing/applied-internships";
import { CoursesPreview } from "@/components/landing/courses-preview";
import { Internships } from "@/components/landing/internships";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/ui/footer";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// Force dynamic rendering to ensure the user count is up-to-date
// Alternatively we can use revalidate = 60 (seconds) for performance
export const dynamic = 'force-dynamic';

export default async function Home() {
    let userCount = 0;
    try {
        await dbConnect();
        userCount = await User.countDocuments();
    } catch (error) {
        console.error("Failed to fetch user count for landing page", error);
    }

    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero initialUserCount={userCount} />
            <Features />
            <EnrolledCourses />
            <AppliedInternships />
            <CoursesPreview />
            <Internships />
            <TestimonialsSection />
            <FAQ />
            <Footer />
        </main>
    );
}
