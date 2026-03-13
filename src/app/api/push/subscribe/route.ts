import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await dbConnect();

    // Try to get user from cookie if logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.id;
      } catch (err) {
        // Token invalid, proceed as anonymous or just log the device
      }
    }

    // Update user's push subscriptions if userId exists
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Check if subscription already exists to avoid duplicates
        const exists = user.pushSubscriptions.some(
          (sub: any) => sub.endpoint === subscription.endpoint
        );
        if (!exists) {
          user.pushSubscriptions.push(subscription);
          await user.save();
        }
      }
    }

    // Note: In a more robust system, we might want a separate PushSubscription model
    // to handle anonymous users or users on multiple devices before they log in.
    // For now, we associate it with the logged-in user.

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Push subscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
