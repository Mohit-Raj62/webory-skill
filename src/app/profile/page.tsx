import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import Ambassador from "@/models/Ambassador";
import HackathonSubmission from "@/models/HackathonSubmission";
import "@/models/Course";
import "@/models/Internship"; 
import "@/models/Hackathon";
import "@/models/CustomCertificate";
import { ProfileClientContent } from "@/components/profile/ProfileClientContent";

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect("/login?redirect=/profile");
    }

    await dbConnect();

    // Fetch initial data on server for better LCP and performance
    const [enrollments, applications, hackathons] = await Promise.all([
        Enrollment.find({ student: user._id })
            .populate("course", "title level videos thumbnail description")
            .lean(),
        Application.find({ student: user._id, status: { $ne: "rejected" } })
            .populate("internship", "title company location type stipend tags")
            .populate("student", "firstName lastName email")
            .lean(),
        HackathonSubmission.find({
            $or: [
                { userId: user._id },
                { teamMembers: user._id },
                { "certificates.email": user.email }
            ]
        })
            .populate("hackathonId", "title theme bannerImage startDate status collaborations signatures")
            .populate("certificateId")
            .populate("certificates.certificateId")
            .lean(),
    ]);

    const serializedUser = JSON.parse(JSON.stringify(user));
    const serializedEnrollments = JSON.parse(JSON.stringify(enrollments));
    const serializedApplications = JSON.parse(JSON.stringify(applications));
    
    // Process hackathons to ensure team members see their own certificates
    const processedHackathons = hackathons.map((sub: any) => {
        let personalCert = null;
        
        // 1. Check if user is in team certificates list
        if (sub.certificates && sub.certificates.length > 0) {
            const teamMatch = sub.certificates.find((c: any) => c.email === user.email);
            if (teamMatch) {
                personalCert = teamMatch.certificateId;
            }
        }
        
        // 2. Fallback to primary certificate if user is lead and not in team list
        if (!personalCert && sub.userId.toString() === user._id.toString()) {
            personalCert = sub.certificateId;
        }

        return {
            ...sub,
            certificateId: personalCert
        };
    });

    const serializedHackathons = JSON.parse(JSON.stringify(processedHackathons));

    return (
        <main className="min-h-screen bg-[#020617] relative overflow-hidden font-sans">
             {/* Subtle Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-600/10 via-purple-900/5 to-transparent blur-[120px] -z-10" />
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <ProfileClientContent 
                    initialUser={serializedUser} 
                    initialEnrollments={serializedEnrollments} 
                    initialApplications={serializedApplications} 
                    initialHackathons={serializedHackathons} 
                />
            </div>

            <Footer />
        </main>
    );
}
