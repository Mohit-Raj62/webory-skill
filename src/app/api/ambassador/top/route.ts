import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Fetch top 5 active ambassadors sorted by totalSignups to reflect total earned points
    // Populate the userId to get the user's name
    const topAmbassadors = await Ambassador.find({ status: "active" })
      .sort({ totalSignups: -1, points: -1 })
      .limit(5)
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture",
        model: User,
      })
      .lean();

    return NextResponse.json({
      success: true,
      data: topAmbassadors,
    });
  } catch (error: any) {
    console.error("Error fetching top ambassadors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top ambassadors" },
      { status: 500 },
    );
  }
}
