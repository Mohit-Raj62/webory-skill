import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { authenticator } from "otplib";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { tempToken, code } = await req.json();

    if (!tempToken || !code) {
      return NextResponse.json({ error: "Missing token or code" }, { status: 400 });
    }

    // Verify temp token
    let decodedTemp: any;
    try {
        decodedTemp = jwt.verify(tempToken, process.env.JWT_SECRET!);
    } catch (e) {
        return NextResponse.json({ error: "Session expired or invalid" }, { status: 401 });
    }

    const user = await User.findById(decodedTemp.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
        return NextResponse.json({ error: "2FA is not enabled for this account" }, { status: 400 });
    }

    // Verify 2FA code
    const isValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret
    });

    // Check recovery codes if authenticator code is invalid
    let isRecoveryCode = false;
    if (!isValid) {
        const recoveryIndex = user.twoFactorRecoveryCodes.indexOf(code);
        if (recoveryIndex !== -1) {
            isRecoveryCode = true;
            // Remove used recovery code
            user.twoFactorRecoveryCodes.splice(recoveryIndex, 1);
            await user.save();
        } else {
            return NextResponse.json({ error: "Invalid 2FA code" }, { status: 401 });
        }
    }

    // Issue real JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, sessionId: decodedTemp.sessionId },
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

    return response;

  } catch (error) {
    console.error("Verify 2FA login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
