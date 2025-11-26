import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

const MAX_OTP_ATTEMPTS = 5;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if OTP exists
    if (!user.loginOtp) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (!user.loginOtpExpires || new Date() > user.loginOtpExpires) {
      // Clear expired OTP
      user.loginOtp = null;
      user.loginOtpExpires = null;
      user.loginOtpAttempts = 0;
      await user.save();

      return NextResponse.json(
        { error: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check if max attempts exceeded
    if (user.loginOtpAttempts >= MAX_OTP_ATTEMPTS) {
      // Clear OTP after max attempts
      user.loginOtp = null;
      user.loginOtpExpires = null;
      user.loginOtpAttempts = 0;
      await user.save();

      return NextResponse.json(
        { error: "Maximum OTP attempts exceeded. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify OTP
    if (user.loginOtp !== otp) {
      // Increment attempts
      user.loginOtpAttempts += 1;
      await user.save();

      const remainingAttempts = MAX_OTP_ATTEMPTS - user.loginOtpAttempts;
      return NextResponse.json(
        { 
          error: "Invalid OTP",
          remainingAttempts
        },
        { status: 401 }
      );
    }

    // OTP is valid - clear OTP fields
    user.loginOtp = null;
    user.loginOtpExpires = null;
    user.loginOtpAttempts = 0;

    // Generate session ID
    const sessionId = crypto.randomUUID();
    user.currentSessionId = sessionId;
    await user.save();

    console.log(`OTP Login successful for user ${user._id}: ${sessionId}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { 
        message: "Login successful",
        user: { 
          id: user._id,
          name: user.firstName,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
