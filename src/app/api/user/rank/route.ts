import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Get current user to get their XP and createdAt
    const currentUser = await User.findById(userId).select("xp createdAt");
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userXP = currentUser.xp || 0;
    const userCreatedAt = currentUser.createdAt;

    // Calculate rank: count users with more XP, or same XP but registered earlier (tiebreaker)
    const rank =
      (await User.countDocuments({
        role: "student",
        _id: { $ne: userId },
        $or: [
          { xp: { $gt: userXP } },
          { xp: userXP, createdAt: { $lt: userCreatedAt } },
        ],
      })) + 1;

    const totalStudents = await User.countDocuments({ role: "student" });

    // Percentile calculation
    const topPercentage =
      totalStudents > 0
        ? Math.max(1, Math.round(((rank - 1) / totalStudents) * 100))
        : 100;

    return NextResponse.json(
      {
        xp: userXP,
        rank: rank,
        totalStudents,
        topPercentage: rank === 1 ? 1 : topPercentage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Rank calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
