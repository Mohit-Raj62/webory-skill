import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { JobApplication } from "@/models/JobApplication";
import Job from "@/models/Job";
import { sendEmail, emailTemplates } from "@/lib/mail";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();

    const jobId = formData.get("jobId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const coverLetter = formData.get("coverLetter") as string;

    const resumeFile = formData.get("resume") as File;

    // Fallback variables matching exact model names previously destructured
    const linkedin = (formData.get("linkedin") as string) || "";
    const portfolio = (formData.get("portfolio") as string) || "";
    const currentSalary = (formData.get("currentSalary") as string) || "";
    const expectedSalary = (formData.get("expectedSalary") as string) || "";
    const noticePeriod = (formData.get("noticePeriod") as string) || "";
    const whyHireYou = (formData.get("whyHireYou") as string) || "";
    const resumeType = (formData.get("resumeType") as string) || "file";

    if (!jobId || !name || !email || !phone || !resumeFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Upload resume to Cloudinary
    let resumeUrl = "";
    try {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes/careers",
            type: "authenticated",
            public_id: `${Date.now()}-${resumeFile.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}.txt`, // Force txt extension for security workaround
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(buffer);
      });

      // Generate Signed URL
      const signedUrl = cloudinary.url(result.public_id, {
        resource_type: "raw",
        type: "authenticated",
        sign_url: true,
        version: result.version,
      });

      // Generate Proxy URL
      let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!baseUrl || !baseUrl.startsWith("http")) {
        const host = request.headers.get("host");
        const protocol = request.headers.get("x-forwarded-proto") || "http";
        baseUrl = `${protocol}://${host}`;
      }
      resumeUrl = `${baseUrl}/api/view-pdf?url=${encodeURIComponent(signedUrl)}&filename=${encodeURIComponent(resumeFile.name)}`;
    } catch (uploadError: any) {
      console.error("Resume upload failed:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload resume document" },
        { status: 500 },
      );
    }

    const application = await JobApplication.create({
      jobId,
      name,
      email,
      phone,
      position: job.title, // Backup
      resume: resumeUrl,
      resumeType,
      coverLetter,
      linkedin,
      portfolio,
      currentSalary,
      expectedSalary,
      noticePeriod,
      whyHireYou,
    });

    // Send confirmation email
    await sendEmail(
      email,
      `Application Received: ${job.title}`,
      emailTemplates.jobApplicationReceived(name, job.title),
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
          resumeUrl,
        ),
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
