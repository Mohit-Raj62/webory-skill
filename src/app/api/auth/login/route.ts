import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Settings from "@/models/Settings";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate session ID
    const sessionId = crypto.randomUUID();

    // Update user with new session ID
    // Using save() to ensure schema validation and bypass potential findByIdAndUpdate caching issues
    user.currentSessionId = sessionId;
    await user.save();

    console.log(
      `Login: Session ID generated and saved for user ${user._id}: ${sessionId}`,
    );

    if (user.isTwoFactorEnabled) {
      if (user.twoFactorMethod === "email") {
        // Generate and send Email OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.twoFactorEmailOtp = otp;
        user.twoFactorEmailOtpExpires = otpExpires;
        await user.save();

        const { sendEmail, emailTemplates } = await import("@/lib/mail");
        await sendEmail(
          user.email,
          "Your 2FA Login Code - Webory Skills",
          emailTemplates.loginOtp(user.firstName, otp)
        );
      }

      // Issue a temporary token for the 2FA verification step
      const tempToken = jwt.sign(
        { userId: user._id, sessionId },
        process.env.JWT_SECRET!,
        { expiresIn: "5m" }, // 5 minutes to complete 2FA
      );
      
      return NextResponse.json(
        {
          message: "2FA required",
          require2FA: true,
          twoFactorMethod: user.twoFactorMethod || "app",
          tempToken
        },
        { status: 200 },
      );
    }

    // Check if role requires 2FA
    const settings = await Settings.findOne({ key: "role2FARequirements" }).lean();
    let requiresSetup = false;
    if (settings && settings.value) {
      const requirements = settings.value as any;
      if (requirements[user.role] === true && !user.isTwoFactorEnabled) {
        requiresSetup = true;
      }
    }

    if (requiresSetup) {
      const tempToken = jwt.sign(
        { userId: user._id, sessionId },
        process.env.JWT_SECRET!,
        { expiresIn: "10m" },
      );
      
      return NextResponse.json(
        {
          message: "2FA Setup required for your role",
          require2FASetup: true,
          tempToken
        },
        { status: 200 },
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.firstName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    if (user.role === "admin" || user.role === "teacher") {
      const { logActivity } = await import("@/lib/logger");
      await logActivity(
        user._id,
        "LOGIN",
        `Logged in from ${req.headers.get("user-agent") || "unknown device"}`,
        req.headers.get("x-forwarded-for") || "unknown",
      );
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
