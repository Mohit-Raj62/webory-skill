import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch all ambassadors who have a testimonial
    const ambassadors = await Ambassador.find({
      testimonial: { $exists: true, $ne: "" },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "firstName lastName email profilePicture",
        model: User,
      })
      .lean();

    return NextResponse.json({
      success: true,
      testimonials: ambassadors,
    });
  } catch (error: any) {
    console.error("Error fetching ambassador testimonials for admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch ambassador testimonials" },
      { status: 500 },
    );
  }
}
