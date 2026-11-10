import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payout from "@/models/Payout";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const callerId = decoded.userId || decoded.id;
    let role = decoded.role;

    const caller = await User.findById(callerId).select("role email").lean();
    if (
      caller?.role === "superadmin" ||
      caller?.email?.toLowerCase() === "mohitraj7321@gmail.com"
    ) {
      role = "superadmin";
    }

    if (role !== "superadmin") {
      return NextResponse.json(
        { error: "Only Superadmin can reject payouts" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { adminNote } = body;

    const payout = await Payout.findById(id);
    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    if (payout.status !== "pending") {
      return NextResponse.json(
        { error: `Payout is already ${payout.status}` },
        { status: 400 }
      );
    }

    payout.status = "rejected";
    payout.adminNote = adminNote || "Rejected by administration";
    payout.processedBy = callerId;
    payout.processedAt = new Date();
    await payout.save();

    // Refund amount back to teacher's wallet balance
    await User.findByIdAndUpdate(payout.teacher, {
      $inc: { "teacherProfile.walletBalance": payout.amount },
    });

    return NextResponse.json({
      success: true,
      message: `Payout of ₹${payout.amount} rejected and funds restored to teacher wallet`,
      payout,
    });
  } catch (error: any) {
    console.error("Reject payout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject payout" },
      { status: 500 }
    );
  }
}

