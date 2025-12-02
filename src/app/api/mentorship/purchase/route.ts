import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import MentorshipPayment from "@/models/MentorshipPayment";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { plan, amount, transactionId, screenshot } = await req.json();

    if (!plan || !amount || !transactionId || !screenshot) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate plan and amount
    const validPlans = {
      standard: 999,
      pro: 2999,
      elite: 5999,
    };

    if (!validPlans[plan as keyof typeof validPlans]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (amount !== validPlans[plan as keyof typeof validPlans]) {
      return NextResponse.json(
        { error: "Invalid amount for selected plan" },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await MentorshipPayment.create({
      user: decoded.userId,
      plan,
      amount,
      transactionId,
      paymentProof: screenshot,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message:
        "Payment proof submitted successfully! You'll get access within 1-2 hours after verification.",
      payment: {
        id: payment._id,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Mentorship purchase error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
