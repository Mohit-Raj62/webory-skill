import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { college, linkedin, reason } = await request.json();

    if (!college || !linkedin || !reason) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if already an ambassador
    const existingAmbassador = await Ambassador.findOne({ userId });
    if (existingAmbassador) {
      return NextResponse.json(
        { error: "You have already applied" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate Referral Code: First 4 chars of name + random 4 (e.g., RAHU-1234)
    // Fallback to "AMBA" if name is short/missing
    const namePrefix =
      user.firstName && user.firstName.length >= 3
        ? user.firstName.substring(0, 4).toUpperCase()
        : "AMBA";
    const randomSuffix = nanoid(4).toUpperCase();
    const referralCode = `${namePrefix}-${randomSuffix}`;

    const newAmbassador = new Ambassador({
      userId,
      college,
      linkedin,
      reason,
      referralCode,
      status: "pending",
      points: 0,
      totalSignups: 0,
    });

    await newAmbassador.save();

    return NextResponse.json({
      message: "Ambassador registered successfully",
      success: true,
      data: newAmbassador,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
