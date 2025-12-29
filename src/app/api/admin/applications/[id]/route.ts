import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendEmail, emailTemplates } from "@/lib/mail";

// PATCH - Update application status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const {
      status,
      startDate,
      duration,
      interviewDate,
      interviewLink,
      resume,
    } = await req.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = startDate;
    if (duration) updateData.duration = duration;
    if (interviewDate) updateData.interviewDate = interviewDate;
    if (interviewLink) updateData.interviewLink = interviewLink;
    if (resume) updateData.resume = resume;

    if (
      status &&
      ![
        "pending",
        "accepted",
        "rejected",
        "interview_scheduled",
        "completed",
      ].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Generate Certificate ID if completing
    if (status === "completed") {
      updateData.completedAt = new Date();
      updateData.certificateId = `CERT-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
    }

    const application = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("student")
      .populate("internship");

    if (application && status) {
      const { student, internship } = application;

      if (status === "interview_scheduled" && interviewDate) {
        await sendEmail(
          student.email,
          `Interview Scheduled: ${internship.title}`,
          emailTemplates.interviewScheduled(
            student.firstName,
            internship.title,
            interviewDate,
            interviewLink
          )
        );
      } else if (status === "accepted") {
        const offerLink = `${process.env.NEXT_PUBLIC_APP_URL}/internships/applications/${application._id}/offer-letter`;
        await sendEmail(
          student.email,
          `Congratulations! Offer for ${internship.title}`,
          emailTemplates.applicationAccepted(
            student.firstName,
            internship.title,
            offerLink
          )
        );
      } else if (status === "rejected") {
        await sendEmail(
          student.email,
          `Application Update: ${internship.title}`,
          emailTemplates.applicationRejected(
            student.firstName,
            internship.title
          )
        );
      }
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
