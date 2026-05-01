import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import HackathonSubmission from "@/models/HackathonSubmission";
import Hackathon from "@/models/Hackathon"; // Ensure models are registered
import CustomCertificate from "@/models/CustomCertificate";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
        { status: 400 }
      );
    }

    let certificateId = "";
    let certificateKey = "";
    let title = "";
    let userId = "";

    if (type === "course") {
      const enrollment = await Enrollment.findById(id).populate({ path: "course", model: Course });
      if (!enrollment) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
      }

      if (enrollment.certificateId) {
        return NextResponse.json(
          { error: "Certificate already exists" },
          { status: 400 }
        );
      }

      title = enrollment.course.title;
      userId = enrollment.student.toString();

      // Generate ID and Key
      const courseTitleSlug = title
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 4);

      certificateId = `${courseTitleSlug}-${userId
        .substring(0, 6)
        .toUpperCase()}-${Date.now().toString().substring(8)}`;

      certificateKey =
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        Math.random().toString(36).substring(2, 10).toUpperCase();

      enrollment.certificateId = certificateId;
      enrollment.certificateKey = certificateKey;
      await enrollment.save();
    } else if (type === "internship") {
      const application = await Application.findById(id).populate({ path: "internship", model: Internship });
      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      if (application.certificateId) {
        return NextResponse.json(
          { error: "Certificate already exists" },
          { status: 400 }
        );
      }

      title = application.internship.title;
      userId = application.student.toString();

      // Generate ID and Key
      const titleSlug = title
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 4);

      certificateId = `INT-${titleSlug}-${userId
        .substring(0, 6)
        .toUpperCase()}-${Date.now().toString().substring(8)}`;

      certificateKey =
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        Math.random().toString(36).substring(2, 10).toUpperCase();

      application.certificateId = certificateId;
      application.certificateKey = certificateKey;
      application.completedAt = new Date(); // Ensure completedAt is set
      await application.save();
    } else if (type === "hackathon") {
      const { email: targetEmail } = await req.json().catch(() => ({}));
      const submission = await HackathonSubmission.findById(id)
        .populate({ path: "hackathonId", model: Hackathon })
        .populate({ path: "userId", model: User });
      if (!submission) {
        return NextResponse.json(
          { error: "Hackathon submission not found" },
          { status: 404 }
        );
      }

      const hackathon = submission.hackathonId;
      let user = submission.userId;
      let isTeamMember = false;

      // If target email is provided and different from lead, find team member
      if (targetEmail && targetEmail !== submission.userId.email) {
        const teamMember = await User.findOne({ email: targetEmail });
        if (teamMember) {
          user = teamMember;
          isTeamMember = true;
        }
      }

      // Check if certificate already exists for this specific user
      if (isTeamMember) {
        const existing = submission.certificates?.find((c: any) => c.email === user.email);
        if (existing?.certificateId) {
          return NextResponse.json(
            { error: "Certificate already exists for this team member" },
            { status: 400 }
          );
        }
      } else if (submission.certificateId) {
        return NextResponse.json(
          { error: "Certificate already exists for the team lead" },
          { status: 400 }
        );
      }

      title = submission.status === "winner" ? `Hackathon Champion - ${submission.rank}${submission.rank === 1 ? 'st' : submission.rank === 2 ? 'nd' : 'rd'} Place` : "Hackathon Participant";
      
      const description = `Awarded for ${submission.status === "winner" ? 'Outstanding performance' : 'Active participation'} in the ${hackathon.title}. Project: ${submission.projectName}`;
      
      let college = "";
      if (isTeamMember) {
        const detail = submission.teamMemberDetails?.find((m: any) => m.email === user.email);
        college = detail?.college || "";
      } else {
        const leadDetail = submission.teamMemberDetails?.find((m: any) => m.role?.toLowerCase().includes("lead") || m.name === `${user.firstName} ${user.lastName}`);
        college = leadDetail?.college || "";
      }

      // Generate ID and Key
      certificateId = "WEBORY-" + crypto.randomBytes(4).toString("hex").toUpperCase();
      certificateKey = crypto.randomBytes(16).toString("hex");

      const certificate = await CustomCertificate.create({
        studentName: `${user.firstName} ${user.lastName}`,
        title,
        description,
        certificateId,
        certificateKey,
        issuedAt: new Date(),
        type: submission.status === "winner" ? "winner" : "participant",
        rank: submission.status === "winner" ? submission.rank : 0,
        hackathonTitle: hackathon.title,
        projectName: submission.projectName,
        domain: hackathon.theme,
        college,
      });

      if (isTeamMember) {
        if (!submission.certificates) submission.certificates = [];
        submission.certificates.push({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          certificateId: certificate._id
        });
      } else {
        submission.certificateId = certificate._id;
      }
      await submission.save();
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      certificateId,
      certificateKey,
    });
  } catch (error) {
    console.error("Issue certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
