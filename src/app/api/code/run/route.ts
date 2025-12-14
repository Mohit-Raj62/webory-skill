import { NextResponse } from "next/server";

// Simple in-memory rate limiter
// In production, use Redis (e.g., Upstash) for distributed systems
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // Rate Limiting Logic
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    let requests = rateLimit.get(ip) || [];
    // Filter out old requests
    requests = requests.filter((timestamp) => timestamp > windowStart);

    if (requests.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    // Record new request
    requests.push(now);
    rateLimit.set(ip, requests);

    const body = await req.json();
    const { language, version, content } = body;

    if (!language || !content) {
      return NextResponse.json(
        { error: "Language and content are required." },
        { status: 400 }
      );
    }

    // Forward to Piston API
    // Piston public API: https://emkc.org/api/v2/piston/execute
    const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        version: version || "*",
        files: [
          {
            content,
          },
        ],
      }),
    });

    const pistonData = await pistonRes.json();

    return NextResponse.json(pistonData);
  } catch (error: any) {
    console.error("Code execution failed:", error);
    return NextResponse.json(
      { error: "Failed to execute code." },
      { status: 500 }
    );
  }
}
