import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST() {
  try {
    await dbConnect();
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

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save to user
    user.twoFactorEmailOtp = otp;
    user.twoFactorEmailOtpExpires = otpExpires;
    await user.save();

    // Send email
    const emailSent = await sendEmail(
      user.email,
      "Your 2FA Setup Code - Webory Skills",
      emailTemplates.loginOtp(user.firstName, otp) // Reuse login template for now, or create a specific one
    );

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
    }

    return NextResponse.json({ 
        message: "OTP sent to your email",
    }, { status: 200 });

  } catch (error) {
    console.error("Generate Email 2FA error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
