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
          process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
        }/login?error=oauth_failed`
      );
    }

    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    const GITHUB_REDIRECT_URI =
      process.env.GITHUB_REDIRECT_URI ||
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
      }/api/auth/github/callback`;

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
        }/login?error=oauth_not_configured`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }),
      }
    );

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
        }/login?error=oauth_token_failed`
      );
    }

    // Get user info from GitHub
    const userInfoResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/json",
      },
    });

    const githubUser = await userInfoResponse.json();

    // Get user email (GitHub requires separate API call for email)
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/json",
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail =
      emails.find((e: any) => e.primary)?.email || emails[0]?.email;

    if (!primaryEmail) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
        }/login?error=no_email`
      );
    }

    // Find or create user
    let user = await User.findOne({
      oauthProvider: "github",
      oauthId: githubUser.id.toString(),
    });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email: primaryEmail });

      if (user) {
        // Link OAuth to existing account
        user.oauthProvider = "github";
        user.oauthId = githubUser.id.toString();
        user.avatar = githubUser.avatar_url;
        await user.save();
      } else {
        // Create new user
        const nameParts = (githubUser.name || githubUser.login).split(" ");
        user = await User.create({
          firstName: nameParts[0] || "User",
          lastName: nameParts.slice(1).join(" ") || "",
          email: primaryEmail,
          password: crypto.randomBytes(32).toString("hex"), // Random password for OAuth users
          oauthProvider: "github",
          oauthId: githubUser.id.toString(),
          avatar: githubUser.avatar_url,
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
        ? `${
            process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
          }/admin`
        : `${
            process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
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
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
      }/login?error=oauth_callback_failed`
    );
  }
}
