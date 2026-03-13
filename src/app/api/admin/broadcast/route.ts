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

    const { subject, message, mode = "both", pushImage } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    let sentCount = 0;
    const errors = [];
    let pushSentCount = 0;
    let pushFailedCount = 0;

    // Send emails IF mode is 'email' or 'both'
    if (mode === "email" || mode === "both") {
      // Fetch all users with valid emails
      const users = await User.find(
        { email: { $exists: true, $ne: null } },
        "email firstName"
      );

      console.log(`Found ${users.length} users for email broadcast.`);

      for (const user of users) {
        let personalizedMessage = message;
        if (message.includes("{{name}}")) {
          personalizedMessage = message.replace(
            "{{name}}",
            user.firstName || "User"
          );
        }

        try {
          const success = await sendEmail(
            user.email,
            subject,
            personalizedMessage
          );
          if (success) sentCount++;
          else errors.push(user.email);
        } catch (error: any) {
          console.error(`Failed to email ${user.email}:`, error);
          errors.push(user.email);
        }
      }
    }

    // Send Push Notifications IF mode is 'push' or 'both'
    if (mode === "push" || mode === "both") {
      const allPushSubs = await PushSubscription.find({});
      console.log(`Push: Found ${allPushSubs.length} total push subscriptions.`);

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.weboryskills.in";
      const payloadObj: any = {
        title: subject,
        body: message.replace(/<[^>]*>?/gm, '').substring(0, 200),
        icon: `/icons/icon-192x192.png`,
        url: `/`,
        tag: 'webory-broadcast'
      };
      if (pushImage) {
        payloadObj.image = pushImage;
      }
      const pushPayload = JSON.stringify(payloadObj);

      for (const sub of allPushSubs) {
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
          console.error(`Failed to send push to sub ${sub._id}:`, error);
          pushFailedCount++;
          // If 410 or 404, subscription is expired/invalid, should remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
             await PushSubscription.findByIdAndDelete(sub._id);
             console.log(`Push: Removed expired subscription ${sub._id}`);
          }
        }
      }
    }

    let resultMessage = "";
    if (mode === "email") resultMessage = `Emails: ${sentCount} sent, ${errors.length} failed.`;
    else if (mode === "push") resultMessage = `Push: ${pushSentCount} sent, ${pushFailedCount} failed.`;
    else resultMessage = `Emails: ${sentCount} sent, ${errors.length} failed. Push: ${pushSentCount} sent, ${pushFailedCount} failed.`;

    return NextResponse.json({
      success: true,
      message: resultMessage,
      sentCount,
      failedCount: errors.length,
      pushSentCount,
      pushFailedCount
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
