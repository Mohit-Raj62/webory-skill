import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { authenticator } from "otplib";
import QRCode from "qrcode";

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

    if (user.isTwoFactorEnabled) {
      return NextResponse.json({ error: "2FA is already enabled" }, { status: 400 });
    }

    // Generate secret
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, "Webory Skills", secret);
    
    // Generate QR Code data URI
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Temporarily save secret until verified
    user.twoFactorSecret = secret;
    await user.save();

    return NextResponse.json({ 
        qrCodeUrl, 
        secret // Also returning it just in case they want to copy-paste it 
    }, { status: 200 });

  } catch (error) {
    console.error("Generate 2FA error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
