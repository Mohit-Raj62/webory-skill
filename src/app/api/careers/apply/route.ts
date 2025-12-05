import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { JobApplication } from "@/models/JobApplication";
import cloudinary from "@/lib/cloudinary";
import { sendEmail, emailTemplates } from "@/lib/mail";

export const dynamic = "force-dynamic";

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData: any = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resumeFile = formData.get("resume") as File;

    if (!name || !email || !phone || !position || !resumeFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload Resume to Cloudinary
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadToCloudinary(buffer, "resumes");

    // Create Job Application
    const application = await JobApplication.create({
      name,
      email,
      phone,
      position,
      coverLetter,
      resume: uploadResult.secure_url,
      status: "pending",
    });

    // Send Confirmation Email to Applicant
    try {
      await sendEmail(
        email,
        `Application Received - ${position}`,
        emailTemplates.applicationReceived(name, position)
      );
    } catch (emailError) {
      console.error("Failed to send applicant email", emailError);
    }

    // Send Notification to Admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      if (adminEmail) {
        await sendEmail(
          adminEmail,
          `New Job Application - ${position}`,
          `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>New Job Application Received</h2>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Resume:</strong> <a href="${uploadResult.secure_url}">View Resume</a></p>
                </div>
                `
        );
      }
    } catch (emailError) {
      console.error("Failed to send admin email", emailError);
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
