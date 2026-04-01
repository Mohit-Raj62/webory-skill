import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import "@/models/Assignment"; // Register Assignment model
import "@/models/Course"; // Register Course model
import "@/models/Internship"; // Register Internship model
import { getDataFromToken } from "@/helpers/getDataFromToken";
import HackathonSubmission from "@/models/HackathonSubmission";
import "@/models/Hackathon";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch User Profile & Skills
    const user = await User.findById(userId).select(
      "-password -loginOtp -loginOtpExpires -loginOtpAttempts",
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Completed Courses (Certificates)
    const enrollments = await Enrollment.find({
      student: userId,
      completed: true,
    }).populate("course", "title description thumbnail");

    // 3. Fetch Internships (Accepted/Completed)
    const internships = await Application.find({
      student: userId,
      status: { $in: ["accepted", "completed"] },
    }).populate("internship", "title company location type");

    // 4. Fetch Internal Hackathons
    const internalHackathons = await HackathonSubmission.find({
      userId: userId,
      status: { $in: ["submitted", "reviewing", "shortlisted", "winner", "participated"] },
    })
    .populate("hackathonId", "title description")
    .lean();

    // 5. Fetch Projects (Submitted Assignments)
    // We assume assignments with attachments or text are projects
    const submissions = await AssignmentSubmission.find({
      userId: userId,
      status: { $in: ["submitted", "graded"] },
    })
      .populate({
        path: "assignmentId",
        select: "title description",
      })
      .populate("courseId", "title");

    const portfolioData = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        avatar: user.avatar,
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        twitter: user.socialLinks?.twitter || "",
        website: user.socialLinks?.website || "",
        phone: user.phone || "",
      },
      certificates: enrollments
        .filter((e: any) => e.course != null)
        .map((e: any) => ({
          id: e._id,
          courseTitle: e.course.title,
          courseThumbnail: e.course.thumbnail,
          completedAt: e.updatedAt,
          type: "academic",
        })),
      education: (user.education || []).map((e: any) => ({
        id: e._id,
        degree: e.degree,
        institution: e.institution,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
        learnings: e.learnings,
        achievements: e.achievements,
      })),
      internships: [
        ...internships
          .filter((i: any) => i.internship != null)
          .map((i: any) => ({
            id: i._id,
            title: i.internship.title,
            company: i.internship.company,
            status: i.status,
            startDate: i.startDate,
            duration: i.duration,
            type: "academic",
          })),
        ...(user.experience || []).map((e: any) => ({
          id: e._id,
          title: e.title,
          company: e.company,
          status: "completed",
          startDate: e.startDate,
          duration: `${new Date(e.startDate).getFullYear()} - ${e.current ? "Present" : new Date(e.endDate).getFullYear()}`,
          type: "manual_experience",
        })),
      ],
      projects: [
        ...submissions
          .filter((s: any) => s.assignmentId != null && s.courseId != null)
          .map((s: any) => ({
            id: s._id,
            title: s.assignmentId.title,
            description: s.assignmentId.description,
            courseTitle: s.courseId.title,
            submissionUrl: s.attachments?.[0]?.url || "",
            submissionText: s.submissionText,
            type: "academic",
          })),
        ...(user.projects || []).map((p: any) => ({
          id: p._id,
          title: p.title,
          description: p.description,
          submissionUrl: p.url,
          technologies: p.technologies,
          type: "personal", // Distinguish manual
        })),
      ],
      hackathons: [
        ...internalHackathons.map((h: any) => ({
          id: h._id,
          title: h.hackathonId?.title || "Platform Hackathon",
          projectName: h.projectName,
          description: h.projectDescription,
          role: h.teamMemberDetails?.find((m: any) => m.email === user.email)?.role || "Participant",
          status: h.status,
          date: h.createdAt,
          type: "internal",
        })),
        ...(user.externalHackathons || []).map((h: any) => ({
          id: h._id,
          title: h.title,
          projectName: h.projectName,
          description: h.description,
          role: h.role,
          date: h.date,
          type: "external",
        })),
      ],
    };

    return NextResponse.json({ portfolio: portfolioData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
