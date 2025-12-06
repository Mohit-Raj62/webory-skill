import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Apple OAuth configuration
    const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
    const APPLE_REDIRECT_URI =
      process.env.APPLE_REDIRECT_URI ||
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://webory-skill.vercel.app"
      }/api/auth/apple/callback`;

    if (!APPLE_CLIENT_ID) {
      return NextResponse.json(
        {
          error:
            "Apple OAuth is not configured. Please add APPLE_CLIENT_ID to your environment variables.",
        },
        { status: 500 }
      );
    }

    // Build Apple OAuth URL
    const appleAuthUrl = new URL("https://appleid.apple.com/auth/authorize");
    appleAuthUrl.searchParams.append("client_id", APPLE_CLIENT_ID);
    appleAuthUrl.searchParams.append("redirect_uri", APPLE_REDIRECT_URI);
    appleAuthUrl.searchParams.append("response_type", "code");
    appleAuthUrl.searchParams.append("scope", "name email");
    appleAuthUrl.searchParams.append("response_mode", "form_post");

    // Redirect to Apple OAuth
    return NextResponse.redirect(appleAuthUrl.toString());
  } catch (error) {
    console.error("Apple OAuth error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
