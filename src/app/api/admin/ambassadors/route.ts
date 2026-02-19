import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import User from "@/models/User"; // Ensure User model is registered
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    // Check Admin Role
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const ambassadors = await Ambassador.find(query)
      .populate("userId", "firstName lastName email phone avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: ambassadors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    // Check Admin Role
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { ambassadorId, status } = await request.json();

    if (!["active", "rejected", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const ambassador = await Ambassador.findByIdAndUpdate(
      ambassadorId,
      { status },
      { new: true },
    );

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Ambassador status updated to ${status}`,
      data: ambassador,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
