import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Ambassador from "@/models/Ambassador";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { firstName, lastName, email, password, phone, referralCode } =
      await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Referral Logic
    let validReferralCode = null;
    if (referralCode) {
      const ambassador = await Ambassador.findOne({ referralCode });
      if (ambassador) {
        validReferralCode = referralCode;
        // Award Points (e.g., 10 points per signup)
        ambassador.points += 10;
        ambassador.totalSignups += 1;
        await ambassador.save();
        console.log(
          `✅ Referral applied: ${referralCode} for ambassador ${ambassador._id}`,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      referredBy: validReferralCode,
    });

    // Send welcome email
    try {
      await sendEmail(
        user.email,
        "Welcome to Skill Webory! 🎉",
        emailTemplates.welcomeSignup(user.firstName),
      );
      console.log("✅ Welcome email sent to:", user.email);
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError);
      // Don't fail signup if email fails
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
