import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
        }/login?error=oauth_failed`
      );
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

    // Dynamically determine baseUrl
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      const { protocol, host } = new URL(req.url);
      baseUrl = `${protocol}//${host}`;
    }

    const GOOGLE_REDIRECT_URI =
      "http://localhost:3000/api/auth/google/callback";

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Google OAuth configuration missing");
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
        }/login?error=oauth_not_configured`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      console.error("Failed to retrieve Google access token:", tokens);
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
        }/login?error=oauth_token_failed`
      );
    }

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const googleUser = await userInfoResponse.json();

    // Find or create user
    let user = await User.findOne({
      oauthProvider: "google",
      oauthId: googleUser.id,
    });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email: googleUser.email });

      if (user) {
        // Link OAuth to existing account
        user.oauthProvider = "google";
        user.oauthId = googleUser.id;
        user.avatar = googleUser.picture;
        await user.save();
      } else {
        // Create new user
        // Ensure lastName is not empty to satisfy Mongoose validation
        const firstName =
          googleUser.given_name || googleUser.name?.split(" ")[0] || "User";
        let lastName =
          googleUser.family_name ||
          googleUser.name?.split(" ").slice(1).join(" ") ||
          "";

        if (!lastName || lastName.trim() === "") {
          lastName = "."; // Fallback for mononyms
        }

        user = await User.create({
          firstName,
          lastName,
          email: googleUser.email,
          password: crypto.randomBytes(32).toString("hex"), // Random password for OAuth users
          oauthProvider: "google",
          oauthId: googleUser.id,
          avatar: googleUser.picture,
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
    const redirectPath = user.role === "admin" ? "/admin" : "/profile";
    const redirectUrl = new URL(redirectPath, req.url);

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
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
      }/login?error=oauth_callback_failed`
    );
  }
}
