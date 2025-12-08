import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/mail";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
      // personalized message if needed, but for broadcast, maybe just raw message
      // We can inject name if we want, but let's keep it simple as the user might paste HTML.
      // If we want to support personalized greetings, we can do replacement.

      let personalizedMessage = message;
      if (message.includes("{{name}}")) {
        personalizedMessage = message.replace(
          "{{name}}",
          user.firstName || "User"
        );
      } else {
        // If no placeholder, maybe prepend greeting?
        // Better not to force it if the admin writes a full newsletter.
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

    return NextResponse.json({
      success: true,
      message: `Emails sent successfully to ${sentCount} users. Failed: ${errors.length}`,
      sentCount,
      failedCount: errors.length,
    });
  } catch (error: any) {
    console.error("Broadcast error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
