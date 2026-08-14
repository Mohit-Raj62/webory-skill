import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PushSubscription from "@/models/PushSubscription";
import { sendEmail } from "@/lib/mail";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import webpush from "web-push";

// VAPID keys configuration
const getVapidDetails = () => {
  const public_key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BPCR1FOsyB5_iI2SCgndkhgzd8AIdRsaUFx-Bi-22bf8bzxIeSVT9IY_W6TSiWLLx5qmzRb0B21QI0RraQe1lAE";
  const private_key = process.env.VAPID_PRIVATE_KEY || "hRgo74UgwT3rPkJlzlbkMro-IEZE6wMdVOqLdPYuvIs";
  
  return {
    publicKey: public_key,
    privateKey: private_key,
    subject: "mailto:admin@weboryskills.in"
  };
};

export async function POST(req: Request) {
  try {
    const vapid = getVapidDetails();
    webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);

    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { subject, message, mode = "both", pushImage, templateName, targetAudience = "all", customEmails = [] } = await req.json();

    if (mode !== "whatsapp" && (!subject || !message)) {
      return NextResponse.json(
        { error: "Subject and message are required for email/push" },
        { status: 400 }
      );
    }

    if (mode === "whatsapp" && !templateName) {
      return NextResponse.json(
        { error: "Template name is required for WhatsApp broadcast" },
        { status: 400 }
      );
    }

    let sentCount = 0;
    const errors = [];
    let pushSentCount = 0;
    let pushFailedCount = 0;

    // Parallel Delivery - Emails
    if (mode === "email" || mode === "both") {
      let emailTargets: { email: string; firstName: string }[] = [];

      if (targetAudience === "all") {
        const users = await User.find(
          { email: { $exists: true, $ne: null } },
          "email firstName"
        );
        emailTargets = users.map(u => ({ email: u.email, firstName: u.firstName || "User" }));
      } else if (targetAudience === "custom") {
        emailTargets = customEmails.map((email: string) => ({ email: email.trim(), firstName: "User" }));
      }

      // Remove duplicates
      const uniqueTargets = [];
      const seenEmails = new Set();
      for (const target of emailTargets) {
          if (!seenEmails.has(target.email) && target.email) {
              seenEmails.add(target.email);
              uniqueTargets.push(target);
          }
      }

      console.log(`Found ${uniqueTargets.length} targets for email broadcast. Parallelizing...`);

      const emailPromises = uniqueTargets.map(async (user) => {
        let personalizedMessage = message;
        if (message.includes("{{name}}")) {
          personalizedMessage = message.replace(
            "{{name}}",
            user.firstName || "User"
          );
        }

        try {
          const success = await sendEmail(user.email, subject, personalizedMessage);
          if (success) sentCount++;
          else errors.push(user.email);
        } catch (error) {
          console.error(`Failed to email ${user.email}:`, error);
          errors.push(user.email);
        }
      });

      await Promise.all(emailPromises);
    }

    // Parallel Delivery - Push Notifications
    if (mode === "push" || mode === "both") {
      const allPushSubs = await PushSubscription.find({});
      console.log(`Push: Found ${allPushSubs.length} subscriptions. Parallelizing...`);

      const payloadObj: any = {
        title: subject,
        body: message.replace(/<[^>]*>?/gm, '').substring(0, 200),
        icon: `/icons/icon-192x192.png`,
        url: `/`,
        tag: 'webory-broadcast'
      };
      if (pushImage) payloadObj.image = pushImage;
      const pushPayload = JSON.stringify(payloadObj);

      const pushPromises = allPushSubs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
              }
            }, 
            pushPayload
          );
          pushSentCount++;
        } catch (error: any) {
          pushFailedCount++;
          if (error.statusCode === 410 || error.statusCode === 404) {
             await PushSubscription.findByIdAndDelete(sub._id);
          }
        }
      });

      await Promise.all(pushPromises);
    }

    let waSentCount = 0;
    let waFailedCount = 0;

    // Parallel Delivery - WhatsApp
    if (mode === "whatsapp") {
      const { sendWhatsAppTemplateMessage } = await import("@/lib/whatsapp");
      
      const users = await User.find(
        { phone: { $exists: true, $ne: null, $ne: "" } },
        "phone firstName"
      );

      console.log(`Found ${users.length} users with phone numbers for WhatsApp broadcast.`);

      const waPromises = users.map(async (user) => {
        try {
          let cleanPhone = user.phone.replace(/\D/g, "");
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`; 
          
          await sendWhatsAppTemplateMessage(
            cleanPhone,
            templateName,
            "en",
            [
              {
                type: "body",
                parameters: [
                  { type: "text", text: user.firstName || "Student" }
                ]
              }
            ]
          );
          waSentCount++;
        } catch (error) {
          waFailedCount++;
        }
      });

      await Promise.all(waPromises);
    }

    let resultMessage = "";
    if (mode === "email") resultMessage = `Emails: ${sentCount} sent, ${errors.length} failed.`;
    else if (mode === "push") resultMessage = `Push: ${pushSentCount} sent, ${pushFailedCount} failed.`;
    else if (mode === "whatsapp") resultMessage = `WhatsApp: ${waSentCount} sent, ${waFailedCount} failed.`;
    else resultMessage = `Emails: ${sentCount} sent, ${errors.length} failed. Push: ${pushSentCount} sent, ${pushFailedCount} failed.`;

    return NextResponse.json({
      success: true,
      message: resultMessage,
      sentCount,
      failedCount: errors.length,
      pushSentCount,
      pushFailedCount,
      waSentCount,
      waFailedCount
    });
  } catch (error: any) {
    console.error("Broadcast error detail:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
