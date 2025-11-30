import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import "@/models/Assignment"; // Register Assignment model
import "@/models/Course"; // Register Course model
import "@/models/Internship"; // Register Internship model

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params; // Await params for Next.js 15

        // 1. Fetch User Profile & Skills
        const user = await User.findById(id).select("-password -loginOtp -loginOtpExpires -loginOtpAttempts -currentSessionId");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Fetch Completed Courses (Certificates)
        const enrollments = await Enrollment.find({ 
            student: id, 
            completed: true 
        }).populate("course", "title description thumbnail");

        // 3. Fetch Internships (Accepted/Completed)
        const internships = await Application.find({
            student: id,
            status: { $in: ["accepted", "completed"] }
        }).populate("internship", "title company location type");

        // 4. Fetch Projects (Submitted Assignments)
        const submissions = await AssignmentSubmission.find({
            userId: id,
            status: { $in: ["submitted", "graded"] }
        }).populate({
            path: "assignmentId",
            select: "title description"
        }).populate("courseId", "title");

        const portfolioData = {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email, // Maybe hide email for public? keeping for now
                bio: user.bio,
                skills: user.skills,
                avatar: user.avatar,
            },
            certificates: enrollments.map((e: any) => ({
                id: e._id,
                courseTitle: e.course.title,
                courseThumbnail: e.course.thumbnail,
                completedAt: e.updatedAt,
            })),
            internships: internships.map((i: any) => ({
                id: i._id,
                title: i.internship.title,
                company: i.internship.company,
                status: i.status,
                startDate: i.startDate,
                duration: i.duration,
            })),
            projects: submissions.map((s: any) => ({
                id: s._id,
                title: s.assignmentId.title,
                description: s.assignmentId.description,
                courseTitle: s.courseId.title,
                submissionUrl: s.attachments?.[0]?.url || "",
                submissionText: s.submissionText,
            }))
        };

        return NextResponse.json({ portfolio: portfolioData });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
