import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { JobApplication } from "@/models/JobApplication";
import Job from "@/models/Job";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applications = await JobApplication.find()
      .populate("jobId", "title type location")
      .sort({ appliedAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reqBody = await request.json();
    const { id, status, interviewDate, interviewLink, offerLink } = reqBody;

    const application = await JobApplication.findById(id).populate("jobId");
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    application.status = status;
    await application.save();

    // Send Email based on status
    if (status === "interview") {
      await sendEmail(
        application.email,
        `Interview Scheduled: ${application.jobId.title}`,
        emailTemplates.jobInterviewScheduled(
          application.name,
          application.jobId.title,
          interviewDate,
          interviewLink
        )
      );
    } else if (status === "selected") {
      await sendEmail(
        application.email,
        `Job Offer: ${application.jobId.title}`,
        emailTemplates.jobOffer(
          application.name,
          application.jobId.title,
          offerLink || "#"
        )
      );
    } else if (status === "rejected") {
      await sendEmail(
        application.email,
        `Application Update: ${application.jobId.title}`,
        emailTemplates.jobRejection(application.name, application.jobId.title)
      );
    }

    return NextResponse.json({
      message: "Application updated and email sent",
      success: true,
      data: application,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
