import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/mail";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import webpush from "web-push";

// VAPID keys should ideally be in env variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BM4PSdCG1LJdwXFU7CV7BLNKvhelTFXZGgs_yhpu4yH_kJKpVXt4FDIzznjLW5lLmU1vxXlaOcdYLQDikgM1CMbs";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "fAfI3sv3_nrtoxYg2PNstRKNTl_6bJvzJJeg0MIV6j4";

webpush.setVapidDetails(
  "mailto:admin@weboryskills.in",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(req: Request) {
  try {
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

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    // Fetch all users with valid emails
    const users = await User.find(
      { email: { $exists: true, $ne: null } },
      "email firstName"
    );

    console.log(`Found ${users.length} users to broadcast to.`);

    let sentCount = 0;
    const errors = [];

    // Send emails
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

    // Send Push Notifications
    const usersWithPush = await User.find(
      { "pushSubscriptions.0": { $exists: true } },
      "pushSubscriptions firstName"
    );

    let pushSentCount = 0;
    let pushFailedCount = 0;

    const pushPayload = JSON.stringify({
      title: subject,
      body: message.replace(/<[^>]*>?/gm, '').substring(0, 200), // Plain text snippet
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      url: "/",
    });

    for (const user of usersWithPush) {
      for (const sub of user.pushSubscriptions) {
        try {
          await webpush.sendNotification(sub, pushPayload);
          pushSentCount++;
        } catch (error: any) {
          console.error(`Failed to send push to user ${user._id}:`, error);
          pushFailedCount++;
          // If 410 or 404, subscription is expired/invalid, should remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
             // Optional: remove expired subscription
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Emails: ${sentCount} sent, ${errors.length} failed. Push: ${pushSentCount} sent, ${pushFailedCount} failed.`,
      sentCount,
      failedCount: errors.length,
      pushSentCount,
      pushFailedCount
    });
  } catch (error: any) {
    console.error("Broadcast error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
