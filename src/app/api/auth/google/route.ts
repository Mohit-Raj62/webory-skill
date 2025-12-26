import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Google OAuth configuration
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    // Dynamically determine baseUrl
    let baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://www.weboryskills.in";
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      const { protocol, host } = new URL(req.url);
      // If not localhost, force https
      const proto = host.includes("localhost") ? protocol : "https:";
      baseUrl = `${proto}//${host}`;
    }

    const GOOGLE_REDIRECT_URI = `${baseUrl}/api/auth/google/callback`;

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

    // Debug logging
    console.log("----------------GOOGLE AUTH DEBUG----------------");
    console.log("Client ID used:", GOOGLE_CLIENT_ID);
    console.log("Redirect URI used:", GOOGLE_REDIRECT_URI);
    console.log("Generated Auth URL:", googleAuthUrl.toString());
    console.log("-------------------------------------------------");

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
