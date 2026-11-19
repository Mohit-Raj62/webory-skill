import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import { SupportTicket } from "@/models/SupportTicket";
import User from "@/models/User";
import { sendEmail, emailTemplates } from "@/lib/mail";

async function verifyAdmin(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const user = await User.findById(decoded.userId).select("role firstName lastName email");
        if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
            return null;
        }
        return user;
    } catch {
        return null;
    }
}

// GET: Fetch all support tickets & stats
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const adminUser = await verifyAdmin(req);
        if (!adminUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        const query: any = {};
        if (status && status !== "all") query.status = status;
        if (category && category !== "all") query.category = category;
        if (search) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { ticketId: regex },
                { name: regex },
                { email: regex },
                { subject: regex }
            ];
        }

        const [tickets, totalCount, openCount, inProgressCount, resolvedCount] = await Promise.all([
            SupportTicket.find(query).sort({ createdAt: -1 }).limit(100),
            SupportTicket.countDocuments(),
            SupportTicket.countDocuments({ status: "open" }),
            SupportTicket.countDocuments({ status: "in_progress" }),
            SupportTicket.countDocuments({ status: "resolved" })
        ]);

        return NextResponse.json({
            success: true,
            tickets,
            stats: {
                total: totalCount,
                open: openCount,
                in_progress: inProgressCount,
                resolved: resolvedCount
            }
        });
    } catch (err: any) {
        console.error("Admin Support GET error:", err);
        return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
    }
}

// PATCH: Update ticket status and admin notes
export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const adminUser = await verifyAdmin(req);
        if (!adminUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { ticketId, status, adminNotes, priority, notifyStudent } = body;

        if (!ticketId) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
        }

        const ticket = await SupportTicket.findOne({
            ticketId: { $regex: new RegExp(`^${ticketId.trim()}$`, "i") }
        });

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        if (status) {
            ticket.status = status;
            if (status === "resolved" && !ticket.resolvedAt) {
                ticket.resolvedAt = new Date();
            }
        }
        if (adminNotes !== undefined) ticket.adminNotes = adminNotes;
        if (priority) ticket.priority = priority;

        await ticket.save();

        // If ticket was resolved and notifyStudent is requested (or default true when resolved)
        if (status === "resolved" && notifyStudent) {
            try {
                await sendEmail(
                    ticket.email,
                    `[Resolved] Support Ticket ${ticket.ticketId} - Webory Skills`,
                    emailTemplates.supportTicketResolved(ticket.name, ticket.ticketId, ticket.subject, ticket.adminNotes)
                );
            } catch (mailErr) {
                console.error("Failed to notify student of resolution:", mailErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Ticket ${ticket.ticketId} status updated to ${ticket.status}.`,
            ticket
        });
    } catch (err: any) {
        console.error("Admin Support PATCH error:", err);
        return NextResponse.json({ error: "Failed to update support ticket" }, { status: 500 });
    }
}

// DELETE: Delete ticket
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const adminUser = await verifyAdmin(req);
        if (!adminUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const ticketId = searchParams.get("ticketId");

        if (!ticketId) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
        }

        await SupportTicket.deleteOne({ ticketId: { $regex: new RegExp(`^${ticketId.trim()}$`, "i") } });

        return NextResponse.json({ success: true, message: `Ticket ${ticketId} deleted.` });
    } catch (err: any) {
        console.error("Admin Support DELETE error:", err);
        return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
    }
}
