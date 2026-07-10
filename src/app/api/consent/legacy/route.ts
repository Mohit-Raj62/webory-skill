import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ConsentLog from "@/models/ConsentLog";
import PolicyVersion from "@/models/PolicyVersion";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { legalAccepted, marketingAccepted } = await req.json();

    if (!legalAccepted || typeof marketingAccepted !== 'boolean') {
      return NextResponse.json({ error: "Invalid consent parameters" }, { status: 400 });
    }

    // Fetch active policy versions
    const termsPolicy = await PolicyVersion.findOne({ documentType: "terms", isActive: true }) || { version: "v1.0.0" };
    const privacyPolicy = await PolicyVersion.findOne({ documentType: "privacy", isActive: true }) || { version: "v1.0.0" };
    const marketingPolicy = await PolicyVersion.findOne({ documentType: "marketing", isActive: true }) || { version: "v1.0.0" };

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const source = "system";

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

    user.acceptedTermsVersion = termsPolicy.version;
    user.acceptedPrivacyVersion = privacyPolicy.version;
    user.marketingPreferences = marketingAccepted;
    user.lastConsentUpdate = new Date();
    await user.save();

    return NextResponse.json({ message: "Legacy consent updated successfully" });
  } catch (error) {
    console.error("Error updating legacy consent:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
