import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // GitHub OAuth configuration
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/github/callback`;
    
    if (!GITHUB_CLIENT_ID) {
      return NextResponse.json(
        { error: "GitHub OAuth is not configured. Please add GITHUB_CLIENT_ID to your environment variables." },
        { status: 500 }
      );
    }

    // Build GitHub OAuth URL
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.append('redirect_uri', GITHUB_REDIRECT_URI);
    githubAuthUrl.searchParams.append('scope', 'read:user user:email');

    // Redirect to GitHub OAuth
    return NextResponse.redirect(githubAuthUrl.toString());
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
