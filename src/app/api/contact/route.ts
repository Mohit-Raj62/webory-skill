import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ContactRequest } from "@/models/ContactRequest";
import { sendEmail, emailTemplates } from "@/lib/mail";

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
      message,
    });

    // Send email notification to admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL ||
          process.env.EMAIL_USER ||
          "admin@example.com",
        `New Contact Request: ${subject}`,
        emailTemplates.contactFormSubmission(name, email, subject, message)
      );
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      requestId: contactRequest._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact request" },
      { status: 500 }
    );
  }
}
