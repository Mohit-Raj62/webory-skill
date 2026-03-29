import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import PushSubscription from "@/models/PushSubscription";
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

    // Save or update subscription in the new model (handles anonymous users)
    const existingSub = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    
    if (existingSub) {
      // Update userId if it's now known but wasn't before
      if (userId && !existingSub.userId) {
        existingSub.userId = userId;
        await existingSub.save();
      }
    } else {
      await PushSubscription.create({
        ...subscription,
        userId: userId || null
      });
    }

    // Also keep sync with User model if userId exists
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Ensure pushSubscriptions array exists
        if (!user.pushSubscriptions) {
          user.pushSubscriptions = [];
        }

        // Deduplicate: Compare endpoints
        const isDuplicate = user.pushSubscriptions.some(
          (sub: any) => sub.endpoint === subscription.endpoint
        );

        if (!isDuplicate) {
          // Keep only the most recent subscriptions to prevent bloat over years of device changes
          // Most users have < 5 active devices. Here we can limit to 10 for safety.
          if (user.pushSubscriptions.length >= 10) {
            user.pushSubscriptions.shift(); // Remove oldest
          }
          
          user.pushSubscriptions.push(subscription);
          await user.save();
          console.log(`Push: New subscription synced for user ${userId}`);
        } else {
          console.log(`Push: Endpoint already exists for user ${userId} (skipping sync)`);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Subscription updated" });
  } catch (error: any) {
    console.error("Push subscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
