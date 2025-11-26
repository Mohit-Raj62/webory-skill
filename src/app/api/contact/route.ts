import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactRequest } from "@/models/ContactRequest";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { name, email, subject, message } = await req.json();

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Create contact request
        const contactRequest = await ContactRequest.create({
            name,
            email,
            subject,
            message
        });

        // Send email notification to admin
        try {
            await sendEmail(
                process.env.ADMIN_EMAIL || "admin@skillwebory.com",
                `New Contact Request: ${subject}`,
                `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
                `
            );
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            success: true,
            message: "Thank you for contacting us! We'll get back to you soon.",
            requestId: contactRequest._id
        });

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to submit contact request" },
            { status: 500 }
        );
    }
}
