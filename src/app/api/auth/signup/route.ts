import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Ambassador from "@/models/Ambassador";
import ConsentLog from "@/models/ConsentLog";
import PolicyVersion from "@/models/PolicyVersion";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { firstName, lastName, email, password, phone, referralCode, termsAccepted, privacyAccepted, marketingAccepted } =
      await req.json();

    if (!firstName || !lastName || !email || !password || !termsAccepted || !privacyAccepted || !marketingAccepted) {
      return NextResponse.json(
        { error: "Missing required fields or mandatory consent not provided" },
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
        
        // Safety fallback for records missing 'category' (prevents validation error)
        if (!ambassador.category) {
          ambassador.category = "student";
        }

        await ambassador.save();
        console.log(
          `✅ Referral applied: ${referralCode} for ambassador ${ambassador._id}`,
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch active policy versions
    const termsPolicy = await PolicyVersion.findOne({ documentType: "terms", isActive: true }) || { version: "v1.0.0" };
    const privacyPolicy = await PolicyVersion.findOne({ documentType: "privacy", isActive: true }) || { version: "v1.0.0" };
    const marketingPolicy = await PolicyVersion.findOne({ documentType: "marketing", isActive: true }) || { version: "v1.0.0" };

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      referredBy: validReferralCode,
      marketingPreferences: !!marketingAccepted,
      acceptedTermsVersion: termsPolicy.version,
      acceptedPrivacyVersion: privacyPolicy.version,
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const source = "web-signup";

    const consentLogs = [
      {
        userId: user._id,
        action: "granted",
        consentType: "terms",
        policyVersion: termsPolicy.version,
        ipAddress,
        userAgent,
        source
      },
      {
        userId: user._id,
        action: "granted",
        consentType: "privacy",
        policyVersion: privacyPolicy.version,
        ipAddress,
        userAgent,
        source
      },
      {
        userId: user._id,
        action: marketingAccepted ? "granted" : "rejected",
        consentType: "marketing",
        policyVersion: marketingPolicy.version,
        ipAddress,
        userAgent,
        source
      }
    ];

    await ConsentLog.insertMany(consentLogs);

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
