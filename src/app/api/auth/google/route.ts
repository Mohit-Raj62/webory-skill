import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Google OAuth configuration
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI =
      process.env.GOOGLE_REDIRECT_URI ||
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
      }/api/auth/google/callback`;

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        {
          error:
            "Google OAuth is not configured. Please add GOOGLE_CLIENT_ID to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    googleAuthUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append("redirect_uri", GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid email profile");
    googleAuthUrl.searchParams.append("access_type", "offline");
    googleAuthUrl.searchParams.append("prompt", "consent");

    // Redirect to Google OAuth
    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
