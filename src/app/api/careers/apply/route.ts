import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { JobApplication } from "@/models/JobApplication";
import Job from "@/models/Job";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const { jobId, name, email, phone, resume, coverLetter } = reqBody;

    if (!jobId || !name || !email || !phone || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const application = await JobApplication.create({
      jobId,
      name,
      email,
      phone,
      position: job.title, // Backup
      resume,
      coverLetter,
    });

    // Send confirmation email
    await sendEmail(
      email,
      `Application Received: ${job.title}`,
      emailTemplates.jobApplicationReceived(name, job.title)
    );

    // Send notification to Admin
    if (process.env.EMAIL_USER) {
      await sendEmail(
        process.env.EMAIL_USER,
        `New Job Application: ${name} for ${job.title}`,
        emailTemplates.adminJobApplicationNotification(
          name,
          job.title,
          email,
          phone,
          resume
        )
      );
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      success: true,
      data: application,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
