import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Set OTP expiry to 10 minutes from now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with OTP and reset attempts
    user.loginOtp = otp;
    user.loginOtpExpires = otpExpires;
    user.loginOtpAttempts = 0;
    await user.save();

    // Send OTP email
    const emailSent = await sendEmail(
      email,
      "Your Login OTP - Skill Webory",
      emailTemplates.loginOtp(user.firstName, otp)
    );

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send OTP email. Please try again." },
        { status: 500 }
      );
    }

    console.log(`OTP sent to ${email}: ${otp} (expires at ${otpExpires})`);

    return NextResponse.json(
      { 
        message: "OTP sent successfully to your email",
        expiresIn: "10 minutes"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
