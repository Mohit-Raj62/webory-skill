import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SupportTicket } from "@/models/SupportTicket";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, phone, category, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Name, email, subject, and message are required." },
                { status: 400 }
            );
        }

        // Generate Human-friendly Ticket Reference ID (e.g. WS-TICK-582914)
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const ticketId = `WS-TICK-${randomNum}`;

        const validCategory = ["certificate", "payment", "lms", "internship", "other"].includes(category) 
            ? category 
            : "other";

        // Save Ticket in DB
        const ticket = await SupportTicket.create({
            ticketId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : "",
            category: validCategory,
            subject: subject.trim(),
            message: message.trim(),
            status: "open",
            priority: validCategory === "payment" ? "high" : "medium"
        });

        // 1. Send Student Confirmation Email
        try {
            await sendEmail(
                email.trim().toLowerCase(),
                `[${ticketId}] Support Request Received - Webory Skills`,
                emailTemplates.supportTicketCreated(name, ticketId, validCategory, subject)
            );
        } catch (emailErr) {
            console.error("Failed to send student ticket confirmation email:", emailErr);
        }

        // 2. Send Support Desk / Admin Alert
        try {
            const supportDeskEmail = process.env.SUPPORT_EMAIL || "support@weboryskills.in";
            await sendEmail(
                supportDeskEmail,
                `[Priority Support Ticket] ${ticketId} - ${subject}`,
                emailTemplates.adminSupportTicketNotification(
                    ticketId,
                    name,
                    email,
                    phone || "",
                    validCategory,
                    subject,
                    message
                )
            );
        } catch (adminEmailErr) {
            console.error("Failed to notify support desk:", adminEmailErr);
        }

        return NextResponse.json({
            success: true,
            ticketId,
            message: `Your ticket has been logged with ID ${ticketId}. Our team will respond within 4-6 hours.`
        });
    } catch (err: any) {
        console.error("Support Ticket Submission Error:", err);
        return NextResponse.json(
            { error: "Failed to submit support ticket. Please try again or email support@weboryskills.in directly." },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const ticketId = searchParams.get("ticketId");

        if (!ticketId) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
        }

        const ticket = await SupportTicket.findOne({ 
            ticketId: { $regex: new RegExp(`^${ticketId.trim()}$`, "i") } 
        }).select("ticketId name email category subject message status priority adminNotes createdAt resolvedAt");

        if (!ticket) {
            return NextResponse.json({ error: "No ticket found with this Reference ID." }, { status: 404 });
        }

        return NextResponse.json({ success: true, ticket });
    } catch (err: any) {
        return NextResponse.json({ error: "Failed to fetch ticket status." }, { status: 500 });
    }
}
