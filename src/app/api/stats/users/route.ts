import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Count total registered users
    const totalUsers = await User.countDocuments();

    return NextResponse.json(
      {
        totalUsers,
        activeUsers: totalUsers, // For now, all registered users are considered "active"
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          "Vercel-CDN-Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}
