import { NextResponse } from "next/server";
import crypto from "crypto";
import { logger } from "@/lib/logger";

// Helper function to verify the webhook signature
function verifySignature(payload: string, signatureHeader: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;

  if (!secret) {
    logger.warn("WHATSAPP_APP_SECRET is not set. Skipping signature verification.");
    return true; // If not configured, we might skip, but in prod it should be enforced
  }

  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }

  const signature = signatureHeader.substring(7);
  
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// GET method is used for Webhook Verification by Meta
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    logger.info("WhatsApp webhook verified successfully");
    // Meta requires the challenge to be returned as a plain string
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } else {
    logger.warn("WhatsApp webhook verification failed. Token mismatch.");
    return NextResponse.json({ error: "Invalid verification token" }, { status: 403 });
  }
}

// POST method is used to receive messages and status updates
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Verify payload signature
    if (!verifySignature(rawBody, signature)) {
      logger.error("Invalid WhatsApp webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Make sure this is a WhatsApp status update
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            // Handle incoming message
            for (const message of change.value.messages) {
              const sender = message.from;
              const text = message.text?.body;
              
              logger.info(`Received WhatsApp message from ${sender}: ${text}`);
              
              // TODO: Implement custom logic to handle incoming messages
              // e.g. Route to an AI chatbot, save to DB, or notify teachers
            }
          }

          if (change.value.statuses) {
            // Handle message status updates (sent, delivered, read, failed)
            for (const status of change.value.statuses) {
              logger.info(`WhatsApp message ${status.id} status changed to: ${status.status}`);
              
              if (status.status === "failed") {
                logger.error(`WhatsApp message failed to deliver: ${JSON.stringify(status.errors)}`);
              }
            }
          }
        }
      }
      
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Return a 404 if the object is not what we expect
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (error) {
    logger.error("Error processing WhatsApp webhook", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
