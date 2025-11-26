import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { EnrolledCourses } from "@/components/landing/enrolled-courses";
import { AppliedInternships } from "@/components/landing/applied-internships";
import { CoursesPreview } from "@/components/landing/courses-preview";
import { Internships } from "@/components/landing/internships";
import { Footer } from "@/components/ui/footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <EnrolledCourses />
            <AppliedInternships />
            <CoursesPreview />
            <Internships />
            <Footer />
        </main>
    );
}
