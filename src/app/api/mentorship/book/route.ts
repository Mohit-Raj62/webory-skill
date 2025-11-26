import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { MentorshipRequest } from "@/models/MentorshipRequest";
import { sendEmail } from "@/lib/mail";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Get user from token
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Please login to book mentorship" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const { plan, goals, preferredTime } = await req.json();

        // Validation
        if (!plan || !goals) {
            return NextResponse.json(
                { error: "Plan and goals are required" },
                { status: 400 }
            );
        }

        if (!["standard", "pro", "elite"].includes(plan)) {
            return NextResponse.json(
                { error: "Invalid plan selected" },
                { status: 400 }
            );
        }

        // Create mentorship request
        const mentorshipRequest = await MentorshipRequest.create({
            student: decoded.userId,
            plan,
            goals,
            preferredTime: preferredTime || "Flexible"
        });

        // Populate student details for email
        await mentorshipRequest.populate("student", "firstName lastName email");

        // Send confirmation email
        try {
            const student = mentorshipRequest.student as any;
            await sendEmail(
                student.email,
                "Mentorship Request Received - Skill Webory",
                `
                    <h2>Mentorship Request Confirmed!</h2>
                    <p>Dear ${student.firstName},</p>
                    <p>We have received your request for the <strong>${plan.toUpperCase()}</strong> mentorship plan.</p>
                    <p><strong>Your Goals:</strong><br>${goals.replace(/\n/g, '<br>')}</p>
                    <p>Our team will match you with the perfect mentor and get back to you within 2-3 business days.</p>
                    <br>
                    <p>Best regards,<br>Skill Webory Mentorship Team</p>
                `
            );

            // Notify admin
            await sendEmail(
                process.env.ADMIN_EMAIL || "admin@skillwebory.com",
                `New Mentorship Request: ${plan.toUpperCase()}`,
                `
                    <h2>New Mentorship Request</h2>
                    <p><strong>Student:</strong> ${student.firstName} ${student.lastName}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Plan:</strong> ${plan.toUpperCase()}</p>
                    <p><strong>Goals:</strong><br>${goals.replace(/\n/g, '<br>')}</p>
                    <p><strong>Preferred Time:</strong> ${preferredTime || 'Flexible'}</p>
                    <hr>
                    <p><small>Requested at: ${new Date().toLocaleString()}</small></p>
                `
            );
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }

        return NextResponse.json({
            success: true,
            message: "Mentorship request submitted! We'll match you with a mentor soon.",
            requestId: mentorshipRequest._id
        });

    } catch (error) {
        console.error("Mentorship request error:", error);
        return NextResponse.json(
            { error: "Failed to submit mentorship request" },
            { status: 500 }
        );
    }
}
