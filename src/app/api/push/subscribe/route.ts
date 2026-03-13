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

    // Also keep sync with User model if userId exists (optional but keeps backward compatibility)
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const exists = user.pushSubscriptions.some(
          (sub: any) => sub.endpoint === subscription.endpoint
        );
        if (!exists) {
          user.pushSubscriptions.push(subscription);
          await user.save();
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Push subscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
