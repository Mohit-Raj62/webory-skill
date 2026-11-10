import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Payout from "@/models/Payout";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const callerId = decoded.userId || decoded.id;
    let role = decoded.role;

    if (role !== "admin" && role !== "superadmin") {
      const user = await User.findById(callerId).select("role email").lean();
      if (
        user?.role === "admin" ||
        user?.role === "superadmin" ||
        user?.email?.toLowerCase() === "mohitraj7321@gmail.com"
      ) {
        role = user.role || "superadmin";
      }
    }

    if (role !== "admin" && role !== "superadmin") return null;
    return { callerId, role };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await dbConnect();
    const auth = await verifySuperAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all payouts
    const payouts = await Payout.find()
      .populate("teacher", "firstName lastName email avatar teacherProfile")
      .populate("processedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate analytics
    const pendingTotal = payouts
      .filter((p: any) => p.status === "pending")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    const paidTotal = payouts
      .filter((p: any) => p.status === "approved")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    // Fetch all teachers for commission/wallet management
    const allTeachers = await User.find({ role: "teacher" })
      .select("firstName lastName email avatar teacherProfile createdAt")
      .sort({ "teacherProfile.walletBalance": -1, createdAt: -1 })
      .lean();

    const teachersWithBalance = allTeachers.filter(
      (t: any) => (t.teacherProfile?.walletBalance || 0) > 0
    );

    return NextResponse.json({
      success: true,
      payouts,
      teachers: allTeachers,
      stats: {
        pendingCount: payouts.filter((p: any) => p.status === "pending").length,
        pendingAmount: pendingTotal,
        paidCount: payouts.filter((p: any) => p.status === "approved").length,
        paidAmount: paidTotal,
        teachersWithBalanceCount: teachersWithBalance.length,
        totalTeachersCount: allTeachers.length,
      },
    });
  } catch (error: any) {
    console.error("Fetch payouts error:", error);
    return NextResponse.json(
      { error: "Failed to load payouts data" },
      { status: 500 }
    );
  }
}

