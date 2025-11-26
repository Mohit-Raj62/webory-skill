import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { JobApplication } from "@/models/JobApplication";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { name, email, phone, position, resume, coverLetter } = await req.json();

        // Validation
        if (!name || !email || !phone || !position || !resume) {
            return NextResponse.json(
                { error: "All required fields must be filled" },
                { status: 400 }
            );
        }

        // Create job application
        const application = await JobApplication.create({
            name,
            email,
            phone,
            position,
            resume,
            coverLetter: coverLetter || ""
        });

        // Send confirmation email to applicant
        try {
            await sendEmail(
                email,
                "Application Received - Skill Webory",
                `
                    <h2>Thank You for Your Application!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your application for the <strong>${position}</strong> position.</p>
                    <p>Our team will review your application and get back to you within 5-7 business days.</p>
                    <br>
                    <p>Best regards,<br>Skill Webory Team</p>
                `
            );

            // Send notification to admin
            await sendEmail(
                process.env.ADMIN_EMAIL || "admin@skillwebory.com",
                `New Job Application: ${position}`,
                `
                    <h2>New Job Application Received</h2>
                    <p><strong>Position:</strong> ${position}</p>
                    <p><strong>Applicant:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Resume:</strong> <a href="${resume}">View Resume</a></p>
                    ${coverLetter ? `<p><strong>Cover Letter:</strong><br>${coverLetter.replace(/\n/g, '<br>')}</p>` : ''}
                    <hr>
                    <p><small>Applied at: ${new Date().toLocaleString()}</small></p>
                `
            );
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully! We'll be in touch soon.",
            applicationId: application._id
        });

    } catch (error) {
        console.error("Job application error:", error);
        return NextResponse.json(
            { error: "Failed to submit application" },
            { status: 500 }
        );
    }
}
