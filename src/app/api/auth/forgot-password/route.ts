import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Case insensitive search
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we return success
    if (!user) {
      console.log(`⚠️ User not found for email: ${email}`);
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    console.log(`✅ User found: ${user.email} (${user._id})`);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiration (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
    }/reset-password/${resetToken}`;

    console.log("📧 Attempting to send password reset email...");
    console.log("To:", user.email);
    console.log("From:", process.env.EMAIL_USER);
    console.log("Reset URL:", resetUrl);

    // Send email
    const emailSent = await sendEmail(
      user.email,
      "Password Reset Request - Skill Webory",
      emailTemplates.passwordReset(user.firstName, resetUrl)
    );

    if (!emailSent) {
      console.error("❌ Failed to send password reset email");
    } else {
      console.log("✅ Password reset email sent successfully!");
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
