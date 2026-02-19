import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ambassador = await Ambassador.findOne({ userId }).populate(
      "userId",
      "firstName lastName email avatar",
    );

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador profile not found", notRegistered: true },
        { status: 404 },
      );
    }

    // Rank Calculation (Simplified: Count how many have more points)
    const rank =
      (await Ambassador.countDocuments({
        points: { $gt: ambassador.points },
      })) + 1;

    return NextResponse.json({
      success: true,
      data: {
        ...ambassador.toObject(),
        rank,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
