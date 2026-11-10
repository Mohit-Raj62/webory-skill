import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Payout from "@/models/Payout";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId)
      .select("firstName lastName email role teacherProfile")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Payouts history for this teacher
    const payouts = await Payout.find({ teacher: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      profile: user.teacherProfile || {
        commissionRate: 70,
        walletBalance: 0,
        totalWithdrawn: 0,
      },
      payouts,
    });
  } catch (error: any) {
    console.error("Fetch teacher wallet error:", error);
    return NextResponse.json(
      { error: "Failed to load wallet data" },
      { status: 500 }
    );
  }
}

// PUT: Update payout settings (UPI ID / Bank details)
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId || decoded.id;

    const body = await req.json();
    const { upiId, bankDetails } = body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "teacherProfile.upiId": upiId || null,
          "teacherProfile.bankDetails": bankDetails || {},
        },
      },
      { new: true }
    ).select("teacherProfile");

    return NextResponse.json({
      success: true,
      message: "Payout details updated successfully",
      teacherProfile: user?.teacherProfile,
    });
  } catch (error: any) {
    console.error("Update teacher payout details error:", error);
    return NextResponse.json(
      { error: "Failed to update details" },
      { status: 500 }
    );
  }
}

