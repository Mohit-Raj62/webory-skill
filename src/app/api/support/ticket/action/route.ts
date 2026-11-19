import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SupportTicket } from "@/models/SupportTicket";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const ticketId = searchParams.get("ticketId");
        const action = searchParams.get("action");

        if (!ticketId) {
            return new Response("Missing Ticket ID", { status: 400 });
        }

        const ticket = await SupportTicket.findOne({
            ticketId: { $regex: new RegExp(`^${ticketId.trim()}$`, "i") }
        });

        if (!ticket) {
            return new Response(`Ticket ${ticketId} not found in system.`, { status: 404 });
        }

        let newStatus = ticket.status;
        let actionMessage = "";

        if (action === "resolve" || !action) {
            newStatus = "resolved";
            ticket.status = "resolved";
            ticket.resolvedAt = new Date();
            if (!ticket.adminNotes) {
                ticket.adminNotes = "Issue investigated and marked as resolved by Webory Support Desk.";
            }
            await ticket.save();
            actionMessage = "Ticket has been successfully marked as RESOLVED & CLOSED.";

            // Send notification to student
            try {
                await sendEmail({
                    to: ticket.email,
                    subject: `[Resolved] Support Ticket ${ticket.ticketId} - Webory Skills`,
                    html: emailTemplates.supportTicketResolved(ticket.name, ticket.ticketId, ticket.subject, ticket.adminNotes),
                    from: "support@weboryskills.in",
                    replyTo: "support@weboryskills.in",
                    category: "support",
                });
            } catch (mailErr) {
                console.error("Failed to send student resolution email:", mailErr);
            }
        } else if (action === "progress") {
            newStatus = "in_progress";
            ticket.status = "in_progress";
            await ticket.save();
            actionMessage = "Ticket marked as UNDER REVIEW / IN PROGRESS.";
        }

        // Return a clean, responsive confirmation page
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket Status Updated - Webory Skills</title>
            <style>
                body {
                    margin: 0;
                    padding: 40px 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background: #060a12;
                    color: #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 80vh;
                }
                .card {
                    max-width: 500px;
                    width: 100%;
                    background: #0d1526;
                    border: 1px solid #1e293b;
                    border-radius: 20px;
                    padding: 35px 25px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                }
                .badge {
                    display: inline-block;
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #34d399;
                    font-size: 11px;
                    font-weight: bold;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 9999px;
                    margin-bottom: 15px;
                }
                .ticket-id {
                    font-family: monospace;
                    font-size: 24px;
                    font-weight: 800;
                    color: #60a5fa;
                    margin: 10px 0;
                }
                h1 {
                    font-size: 20px;
                    color: #ffffff;
                    margin: 0 0 10px 0;
                }
                p {
                    font-size: 14px;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin: 0 0 20px 0;
                }
                .meta-box {
                    background: #060a12;
                    border: 1px solid #1e293b;
                    border-radius: 12px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: left;
                    font-size: 13px;
                }
                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 6px 0;
                }
                .meta-label { color: #64748b; }
                .meta-val { color: #f1f5f9; font-weight: 600; }
                .btn {
                    display: inline-block;
                    background: #2563eb;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: bold;
                    margin: 6px;
                    transition: background 0.2s;
                }
                .btn:hover { background: #1d4ed8; }
                .btn-secondary {
                    background: #1e293b;
                    color: #cbd5e1;
                }
                .btn-secondary:hover { background: #334155; }
            </style>
        </head>
        <body>
            <div class="card">
                <span class="badge">✓ Live Status Updated</span>
                <h1>Ticket Resolution Saved!</h1>
                <div class="ticket-id">${ticket.ticketId}</div>
                <p>${actionMessage}</p>

                <div class="meta-box">
                    <div class="meta-row">
                        <span class="meta-label">Student:</span>
                        <span class="meta-val">${ticket.name}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Email:</span>
                        <span class="meta-val">${ticket.email}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Live Status:</span>
                        <span class="meta-val" style="color: #34d399; text-transform: uppercase;">${ticket.status}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Portal Tracker:</span>
                        <span class="meta-val" style="color: #60a5fa;">Updated Immediately</span>
                    </div>
                </div>

                <p style="font-size: 12px; color: #64748b;">
                    When the student searches their Ticket ID on the <a href="/support" style="color: #60a5fa; text-decoration: none;">/support</a> page, it will now display as <strong>RESOLVED & CLOSED</strong>.
                </p>

                <div>
                    <a href="/admin/support" class="btn">Open Admin Support Desk</a>
                    <a href="/support" class="btn btn-secondary">View Live Tracker</a>
                </div>
            </div>
        </body>
        </html>
        `;

        return new Response(html, {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    } catch (err: any) {
        console.error("Action error:", err);
        return new Response(`Server error: ${err.message}`, { status: 500 });
    }
}
