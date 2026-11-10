import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Payout from "@/models/Payout";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { amount, paymentMethod, upiId, bankDetails } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) {
      return NextResponse.json(
        { error: "Minimum payout withdrawal is ₹100" },
        { status: 400 }
      );
    }

    const currentBalance = user.teacherProfile?.walletBalance || 0;
    if (currentBalance < numAmount) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Available: ₹${currentBalance}, Requested: ₹${numAmount}`,
        },
        { status: 400 }
      );
    }

    // Check if there is already a pending payout
    const existingPending = await Payout.findOne({
      teacher: userId,
      status: "pending",
    });

    if (existingPending) {
      return NextResponse.json(
        {
          error:
            "You already have a payout request pending approval. Please wait until it is processed.",
        },
        { status: 400 }
      );
    }

    // Deduct from balance
    user.teacherProfile.walletBalance -= numAmount;
    await user.save();

    // Create payout
    const payout = await Payout.create({
      teacher: userId,
      amount: numAmount,
      status: "pending",
      paymentMethod: paymentMethod || "upi",
      upiId: upiId || user.teacherProfile?.upiId,
      bankDetails: bankDetails || user.teacherProfile?.bankDetails,
    });

    return NextResponse.json({
      success: true,
      message: `Payout request for ₹${numAmount} submitted successfully! Superadmin will review and disburse soon.`,
      payout,
      remainingBalance: user.teacherProfile.walletBalance,
    });
  } catch (error: any) {
    console.error("Payout request error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit payout request" },
      { status: 500 }
    );
  }
}

