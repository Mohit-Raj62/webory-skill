import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { SupportTicket } from "@/models/SupportTicket";
import { sendEmail, emailTemplates } from "@/lib/mail";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

const SYSTEM_KNOWLEDGE_PROMPT = `
You are a Senior Technical Support Specialist at Webory Skills (weboryskills.in) Resolution Desk.
Your role is to actively listen, diagnose problems, ask necessary clarifying questions, gather all user details, and guide students step-by-step.

CORE BEHAVIOR & INTAKE PROTOCOL:
1. NEVER IMMEDIATELY JUMP TO RAISING OR OFFERING A TICKET ON THE FIRST MESSAGE!
   - A premier tech support specialist NEVER throws a ticket form at the user right away.
   - You MUST first understand the exact problem, ask clarifying questions, and collect necessary details before considering an escalation.

2. WHAT SPECIFIC DETAILS TO ASK FOR BASED ON THE ISSUE:
   • For Payments / Course Still Locked After Debit:
     - Ask: 1) What is their registered Webory account email? 2) Which exact course did they enroll in? 3) What is their 12-digit UPI UTR / Bank Reference Number and payment date? 4) Guide them: "Have you submitted payment proof under Student Dashboard > Submit Payment Proof?"
   • For Certificates & Credentials:
     - Ask: 1) Which course or internship certificate? 2) Are all video chapters and quizzes showing 100% completed? 3) If it's a name spelling correction, ask: "What is the exact correct legal name that should be printed, and what is your registered email or Certificate ID?"
   • For LMS, Videos & Chapter Access:
     - Ask: 1) Which specific course and chapter is buffering or locked? 2) What device (mobile/PC) and browser are they using? 3) Suggest trying Chrome incognito, clearing cache, or setting video quality to 720p.
   • For Internships & Tasks:
     - Ask: 1) Which domain/batch are they enrolled in? 2) What is the task week or GitHub PR submission link? 3) Remind them that mentor code reviews take 48 to 72 business hours.
   • For Other / Custom Queries:
     - Ask for a clear explanation of what they are experiencing, any error messages displayed, and their registered email.

3. COMMUNICATION STYLE & CLEAN FORMATTING:
   - Speak naturally, warmly, and politely in English, Hindi, or Hinglish depending on how the user speaks to you.
   - Use clean bullets (•) and bold text (**text**) for easy reading.
   - STRICT RULE: NEVER output raw asterisks (*) for bullet points. Always use standard bullet points (•) or numbers (1., 2.).
   - NEVER use robotic phrases like "As an AI language model" or sound automated. Sound like a genuine, high-caliber tech support engineer.

4. WHEN AND ONLY WHEN TO ESCALATE TO AN OFFICIAL TICKET:
   - ONLY offer/escalate to a support ticket IF:
     a) You have already asked for details, the user has provided their details, and self-service steps did not resolve it.
     OR
     b) The user explicitly says "raise a ticket", "ticket create kar do", "escalate to human team", "agent se baat karni hai".
   - When offering an official ticket escalation, explain clearly what will happen, and append this machine block at the VERY END on a new line:
<<<TICKET_OFFER:{"category":"certificate|payment|lms|internship|other","subject":"Clear descriptive title","message":"Detailed summary of the user issue including the details provided by the user"}>>>
   - If the user has NOT provided details yet, DO NOT append the ticket offer block. Ask them for the details first!

### OFFICIAL WEBORY SKILLS PLATFORM KNOWLEDGE BASE:

1. CERTIFICATES & CREDENTIALS:
- How to download: Course / Internship must be 100% completed (all video chapters, assignments, and quizzes completed). Go to Student Dashboard > Certificates tab to download official verified PDF.
- Verification: Every Webory Skills certificate carries a cryptographic 16-character alphanumeric key and scan-to-verify QR code. Anyone can verify it anytime at https://weboryskills.in/verify-certificate without login.
- Name/Metadata Corrections: If the student's legal name is printed incorrectly, they must raise a support ticket with their government ID proof and Certificate ID. We manually re-issue it.

2. PAYMENTS, INVOICES & REFUNDS:
- UPI QR / Netbanking settlement: Gateways usually take 10-15 minutes to confirm. If course remains locked after account debit, student should go to Student Dashboard > "Submit Payment Proof" and enter their 12-digit UPI UTR / Transaction ID for automated matching.
- Tax Invoices: GST/Tax invoices are automatically emailed upon enrollment and can also be downloaded from Course details page.
- Refunds: 7-day refund policy from the date of purchase as per official Refund Policy (weboryskills.in/refund-policy). Support evaluates requests within 2 business days. Direct billing desk is support@weboryskills.in.

3. LMS, VIDEOS & COURSE ACCESS:
- Adaptive Streaming: We use adaptive HLS video streaming. If video buffers or shows black screen: clear browser cache, disable ad-blockers, or switch resolution to 720p.
- Locked Chapters / Quizzes: Chapters and quizzes unlock sequentially. Make sure previous video is marked 100% watched and mandatory quiz has been submitted.
- Code & Files: Downloadable starter code and GitHub repositories are in the "Attachments & Code" tab below each video player.

4. INTERNSHIPS, TASKS & OFFERS:
- Offer Letters: Available on the internship tracking page once application moves to "Accepted". Carries official MSME registration UDYAM-BR-26-0208472.
- Weekly Tasks: Students push their code to a public GitHub repository and submit the commit/PR link in Internship Workspace > Tasks section.
- Mentor Review SLA: Industry mentors review submissions within 48 to 72 business hours with line-by-line feedback.

5. ACCOUNTS & SECURITY:
- OTPs & 2FA: Login OTP and 2FA codes are valid for 10 minutes and sent strictly from no-reply@weboryskills.in.
- Password Reset: Reset links expire in 1 hour.

6. HACKATHONS & DEVARENA:
- Access hackathons at arena.weboryskills.in. Winner and participation certificates are distributed automatically upon hackathon completion.

7. COLLEGE & SCHOOL PARTNERSHIPS:
- For college MoUs, campus bootcamps, and TPO training: write to info@weboryskills.in or visit weboryskills.in/contact.

8. OTHER DIGITAL SERVICES & CUSTOM ISSUES:
- Anything not falling in the above categories is handled under "other". Support SLA is 4 to 6 business hours.
- Direct email: support@weboryskills.in.
`;

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { action = "chat" } = body;

        // ==========================================
        // ACTION 1: TRACK EXISTING TICKET
        // ==========================================
        if (action === "track_ticket") {
            const { ticketId } = body;
            if (!ticketId) {
                return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
            }

            const cleanId = String(ticketId).trim();
            const ticket = await SupportTicket.findOne({
                ticketId: { $regex: new RegExp(`^${cleanId}$`, "i") }
            }).select("ticketId name email category subject message status priority adminNotes createdAt resolvedAt");

            if (!ticket) {
                return NextResponse.json({
                    found: false,
                    message: `No ticket found for reference ID: "${cleanId}". Please check the ID or raise a new ticket.`
                });
            }

            return NextResponse.json({
                found: true,
                ticket: {
                    ticketId: ticket.ticketId,
                    name: ticket.name,
                    category: ticket.category.toUpperCase(),
                    subject: ticket.subject,
                    status: ticket.status.toUpperCase(),
                    priority: ticket.priority.toUpperCase(),
                    adminNotes: ticket.adminNotes || "Under investigation by engineering support team.",
                    createdAt: ticket.createdAt,
                    resolvedAt: ticket.resolvedAt || null
                }
            });
        }

        // ==========================================
        // ACTION 2: CREATE SUPPORT TICKET DIRECTLY
        // ==========================================
        if (action === "create_ticket") {
            const { name, email, phone, category = "other", subject, message, attachments = [] } = body;

            if (!name || !email || !subject || !message) {
                return NextResponse.json({ error: "Name, email, subject, and message are required" }, { status: 400 });
            }

            const randomNum = Math.floor(100000 + Math.random() * 900000);
            const ticketId = `WS-TICK-${randomNum}`;
            const validCategory = ["certificate", "payment", "lms", "internship", "other"].includes(category)
                ? category
                : "other";

            const newTicket = await SupportTicket.create({
                ticketId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone ? phone.trim() : "",
                category: validCategory,
                subject: subject.trim(),
                message: message.trim(),
                status: "open",
                priority: validCategory === "payment" ? "high" : "medium",
                attachments: Array.isArray(attachments) ? attachments : []
            });

            // 1. Send Student Confirmation Email from support@weboryskills.in
            try {
                await sendEmail({
                    to: email.trim().toLowerCase(),
                    subject: `[${ticketId}] Support Request Received - Webory Skills`,
                    html: emailTemplates.supportTicketCreated(name, ticketId, validCategory, subject),
                    from: "support@weboryskills.in",
                    replyTo: "support@weboryskills.in",
                    category: "support",
                });
            } catch (mailErr) {
                console.error("Failed to send student confirmation email:", mailErr);
            }

            // 2. Alert Support Desk
            try {
                const supportDeskEmail = process.env.SUPPORT_EMAIL || "support@weboryskills.in";
                await sendEmail({
                    to: supportDeskEmail,
                    subject: `[Priority Support Ticket] ${ticketId} - ${subject}`,
                    html: emailTemplates.adminSupportTicketNotification(
                        ticketId,
                        name,
                        email,
                        phone || "",
                        validCategory,
                        subject,
                        message,
                        Array.isArray(attachments) ? attachments : []
                    ),
                    from: "support@weboryskills.in",
                    replyTo: `"${name}" <${email}>`,
                    category: "support",
                });
            } catch (adminMailErr) {
                console.error("Failed to send admin notification email:", adminMailErr);
            }

            return NextResponse.json({
                success: true,
                ticketId,
                category: validCategory,
                status: "open",
                message: `Ticket ${ticketId} created successfully. Our team will resolve it within 4-6 hours.`
            });
        }

        // ==========================================
        // ACTION 3: CHAT WITH AI BOT
        // ==========================================
        const { message, history = [], userContext = {} } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Quick Check: Did user provide a Ticket ID in their message? (e.g. WS-TICK-123456)
        const ticketIdMatch = message.match(/WS-TICK-\d{5,8}/i);
        if (ticketIdMatch) {
            const foundTicketId = ticketIdMatch[0].toUpperCase();
            const ticket = await SupportTicket.findOne({
                ticketId: { $regex: new RegExp(`^${foundTicketId}$`, "i") }
            });

            if (ticket) {
                return NextResponse.json({
                    reply: `Found your support ticket **${ticket.ticketId}**! 🎫\n\n` +
                        `• **Category:** ${ticket.category.toUpperCase()}\n` +
                        `• **Subject:** ${ticket.subject}\n` +
                        `• **Current Status:** \`${ticket.status.toUpperCase()}\`\n` +
                        `• **Priority:** ${ticket.priority.toUpperCase()}\n` +
                        `• **Created At:** ${new Date(ticket.createdAt).toLocaleString("en-IN")}\n` +
                        (ticket.adminNotes ? `• **Support Resolution Note:** ${ticket.adminNotes}\n` : `• **Support Note:** Currently queued with our engineering desk.\n\n`) +
                        `You can track or follow up anytime by replying directly to the confirmation email sent from **support@weboryskills.in**.`,
                    isTicketLookup: true,
                    ticketDetails: {
                        ticketId: ticket.ticketId,
                        status: ticket.status,
                        category: ticket.category,
                        subject: ticket.subject,
                    }
                });
            }
        }

        // Format conversation history for Gemini:
        // Rules:
        // 1. Must alternate between user and model
        // 2. Must start with 'user'
        // 3. Must not end with 'user' before sendMessage
        const rawHistory: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];
        
        if (Array.isArray(history)) {
            for (const h of history) {
                const text = String(h.content || h.text || "").trim();
                if (!text) continue;
                const role = h.role === "assistant" || h.role === "bot" || h.role === "support" ? "model" : "user";
                
                // Avoid consecutive turns with identical role
                if (rawHistory.length > 0 && rawHistory[rawHistory.length - 1].role === role) {
                    rawHistory[rawHistory.length - 1].parts[0].text += `\n${text}`;
                } else {
                    rawHistory.push({ role, parts: [{ text }] });
                }
            }
        }

        // Ensure history starts with 'user'
        while (rawHistory.length > 0 && rawHistory[0].role !== "user") {
            rawHistory.shift();
        }

        // Ensure history ends with 'model' so next turn sent by sendMessage is 'user'
        while (rawHistory.length > 0 && rawHistory[rawHistory.length - 1].role === "user") {
            rawHistory.pop();
        }

        const formattedHistory = rawHistory.slice(-8);

        let replyText = "";
        let contextualUserMessage = message;
        if (userContext?.name || userContext?.email) {
            contextualUserMessage += `\n[User info: name="${userContext.name || ''}", email="${userContext.email || ''}"]`;
        }

        // Tier 1 & 2: Gemini Models (gemini-3.5-flash-lite, gemini-3.5-flash, gemini-flash-lite-latest)
        const geminiModels = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-flash-lite-latest"];
        for (const modelName of geminiModels) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: SYSTEM_KNOWLEDGE_PROMPT
                });

                const chat = model.startChat({
                    history: formattedHistory
                });

                const chatPromise = chat.sendMessage(contextualUserMessage);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 12000)
                );

                const result: any = await Promise.race([chatPromise, timeoutPromise]);
                const text = result.response.text();
                if (text && text.trim()) {
                    replyText = text;
                    break;
                }
            } catch (geminiErr: any) {
                console.warn(`Gemini model ${modelName} failed/quota:`, geminiErr.message);
            }
        }

        // Tier 3: Groq High-Speed Models (openai/gpt-oss-120b, qwen/qwen3.8-27b)
        if (!replyText && process.env.GROQ_API_KEY) {
            const groqModels = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
            const groqMessages = [
                { role: "system" as const, content: SYSTEM_KNOWLEDGE_PROMPT },
                ...history.slice(-6).map(h => ({
                    role: (h.role === "assistant" || h.role === "bot" || h.role === "support" ? "assistant" : "user") as "user" | "assistant",
                    content: String(h.content || h.text || "")
                })),
                { role: "user" as const, content: contextualUserMessage }
            ];

            for (const modelName of groqModels) {
                try {
                    const completion = await groq.chat.completions.create({
                        model: modelName,
                        messages: groqMessages,
                        max_tokens: 1024,
                        temperature: 0.7
                    });
                    const text = completion.choices[0]?.message?.content;
                    if (text && text.trim()) {
                        replyText = text;
                        break;
                    }
                } catch (groqErr: any) {
                    console.warn(`Groq model ${modelName} fallback failed:`, groqErr.message);
                }
            }
        }

        // Tier 4: Fallback intake response if all AI endpoints fail/timeout
        if (!replyText) {
            replyText = "Hello! Aapki inquiry receive ho gayi hai. Main is problem ko jaldi diagnose aur solve karne ke liye aapki help kar raha hoon.\n\n" +
                "Kripya mujhe yeh details share kar dijiye:\n" +
                "• Aapka **registered email ID** kya hai?\n" +
                "• Exact **course ya issue** ka naam kya hai?\n" +
                "• Problem ke baare me thoda detail me batayein (jaise transaction UTR ya error message).\n\n" +
                "Jaise hi aap details denge, main instant troubleshoot kar dunga ya direct support team ko escalate kar dunga.";
        }

        // Parse any ticket offer block embedded by AI
        let ticketOfferData = null;
        const offerMatch = replyText.match(/<<<TICKET_OFFER:(.*?)>>>/s);
        if (offerMatch) {
            try {
                ticketOfferData = JSON.parse(offerMatch[1]);
                replyText = replyText.replace(/<<<TICKET_OFFER:(.*?)>>>/s, "").trim();
            } catch (parseErr) {
                console.error("Failed to parse ticket offer JSON:", parseErr);
            }
        }

        // Clean any stray asterisk bullets into clean unicode bullet points
        replyText = replyText
            .replace(/^(\s*)\*\s+/gm, "$1• ")
            .replace(/^(\s*)-\s+/gm, "$1• ");

        return NextResponse.json({
            reply: replyText,
            ticketOffer: ticketOfferData,
            timestamp: new Date().toISOString()
        });

    } catch (err: any) {
        console.error("Support AI Bot API Error:", err);
        return NextResponse.json({ error: "Internal support bot error", details: err.message }, { status: 500 });
    }
}
