import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId || decoded.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isTwoFactorEnabled) {
      return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: "No 2FA setup in progress" }, { status: 400 });
    }

    const isValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret
    });

    if (!isValid) {
        return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Success! Enable 2FA
    user.isTwoFactorEnabled = true;
    
    // Optionally generate some recovery codes here
    const recoveryCodes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
    user.twoFactorRecoveryCodes = recoveryCodes;
    
    await user.save();

    return NextResponse.json({ 
        message: "Two-Factor Authentication enabled successfully",
        recoveryCodes
    }, { status: 200 });

  } catch (error) {
    console.error("Enable 2FA error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
