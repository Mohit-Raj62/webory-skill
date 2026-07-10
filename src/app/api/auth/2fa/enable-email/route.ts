import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

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

    if (user.isTwoFactorEnabled && user.twoFactorMethod === "email") {
      return NextResponse.json({ error: "Email 2FA is already enabled" }, { status: 400 });
    }

    if (!user.twoFactorEmailOtp || !user.twoFactorEmailOtpExpires) {
      return NextResponse.json({ error: "No Email 2FA setup in progress" }, { status: 400 });
    }

    if (new Date() > new Date(user.twoFactorEmailOtpExpires)) {
        return NextResponse.json({ error: "OTP expired. Please request a new one." }, { status: 400 });
    }

    if (user.twoFactorEmailOtp !== code.trim()) {
        return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Success! Enable 2FA with Email Method
    user.isTwoFactorEnabled = true;
    user.twoFactorMethod = "email";
    user.twoFactorEmailOtp = null;
    user.twoFactorEmailOtpExpires = null;
    
    // Generate recovery codes
    const recoveryCodes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
    user.twoFactorRecoveryCodes = recoveryCodes;
    
    await user.save();

    return NextResponse.json({ 
        message: "Two-Factor Authentication enabled successfully",
        recoveryCodes
    }, { status: 200 });

  } catch (error) {
    console.error("Enable Email 2FA error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
