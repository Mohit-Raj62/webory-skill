import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import RewardRequest from "@/models/RewardRequest";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { item, cost, shippingAddress } = await request.json();

    if (!item || !cost || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Get Ambassador Profile
    const ambassador = await Ambassador.findOne({ userId });
    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador profile not found" },
        { status: 404 },
      );
    }

    // 2. Check Points
    if (ambassador.points < cost) {
      return NextResponse.json(
        { error: "Insufficient points" },
        { status: 400 },
      );
    }

    // 3. Deduct Points & Create Request
    ambassador.points -= cost;
    await ambassador.save();

    const newRequest = new RewardRequest({
      ambassadorId: ambassador._id,
      item,
      pointsSpent: cost,
      shippingAddress,
      status: "pending",
    });

    await newRequest.save();

    return NextResponse.json({
      success: true,
      message: "Reward redeemed successfully! We will ship it soon.",
      remainingPoints: ambassador.points,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ambassador = await Ambassador.findOne({ userId });
    if (!ambassador) {
      return NextResponse.json({ requests: [] });
    }

    const requests = await RewardRequest.find({
      ambassadorId: ambassador._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
