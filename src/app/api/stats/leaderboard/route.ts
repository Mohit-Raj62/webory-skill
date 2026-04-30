import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Fetch top 50 learners with XP > 0
    const topLearners = await User.find({ role: "student", xp: { $gt: 0 } })
      .sort({ xp: -1 })
      .limit(50)
      .select("firstName lastName avatar xp")
      .lean();

    return NextResponse.json({ success: true, leaderboard: topLearners });
  } catch (error: any) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
