import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData: any = await req.formData();
    const code = formData.get("code") as string;
    const user_data = formData.get("user");

    if (!code) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/login?error=oauth_failed`
      );
    }

    const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
    const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET; // This needs to be a JWT for Apple
    const APPLE_REDIRECT_URI =
      process.env.APPLE_REDIRECT_URI ||
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/auth/apple/callback`;

    if (!APPLE_CLIENT_ID || !APPLE_CLIENT_SECRET) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/login?error=oauth_not_configured`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: APPLE_CLIENT_ID,
        client_secret: APPLE_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: APPLE_REDIRECT_URI,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.id_token) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/login?error=oauth_token_failed`
      );
    }

    // Decode ID token to get user info
    const decodedToken = jwt.decode(tokens.id_token) as any;

    // Parse user data if provided (only on first sign-in)
    let userData = null;
    if (user_data) {
      userData = JSON.parse(user_data as string);
    }

    const appleUserId = decodedToken.sub;
    const email = decodedToken.email;

    if (!email) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/login?error=no_email`
      );
    }

    // Find or create user
    let user = await User.findOne({
      oauthProvider: "apple",
      oauthId: appleUserId,
    });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email });

      if (user) {
        // Link OAuth to existing account
        user.oauthProvider = "apple";
        user.oauthId = appleUserId;
        await user.save();
      } else {
        // Create new user
        const firstName = userData?.name?.firstName || "User";
        const lastName = userData?.name?.lastName || "";

        user = await User.create({
          firstName,
          lastName,
          email,
          password: crypto.randomBytes(32).toString("hex"), // Random password for OAuth users
          oauthProvider: "apple",
          oauthId: appleUserId,
        });
      }
    }

    // Generate session ID
    const sessionId = crypto.randomUUID();
    user.currentSessionId = sessionId;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Redirect to profile with token
    const redirectUrl =
      user.role === "admin"
        ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin`
        : `${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/profile`;

    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Apple OAuth callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/login?error=oauth_callback_failed`
    );
  }
}
