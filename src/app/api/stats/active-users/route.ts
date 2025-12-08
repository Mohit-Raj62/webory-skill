import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Count all registered users (you can modify this to count only recently active users)
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      activeUsers: totalUsers,
      displayText: totalUsers > 0 ? `${totalUsers}+` : "0",
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    return NextResponse.json(
      { error: "Failed to fetch active users" },
      { status: 500 }
    );
  }
}
