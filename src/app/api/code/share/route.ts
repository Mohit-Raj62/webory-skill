import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import CodeSnippet from "@/models/CodeSnippet";
import { nanoid } from "nanoid";

// Helper to get authenticated user ID
async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// POST - Create/Update share link
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { snippetId } = await req.json();

    if (!snippetId) {
      return NextResponse.json(
        { error: "Snippet ID is required" },
        { status: 400 },
      );
    }

    // Find the snippet
    const snippet = await CodeSnippet.findOne({
      _id: snippetId,
      user: userId,
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    // Generate share ID if not exists
    if (!snippet.shareId) {
      snippet.shareId = nanoid(10); // Short, unique ID
      snippet.sharedAt = new Date();
    }

    snippet.isPublic = true;
    snippet.shareCount += 1;
    await snippet.save();

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";
    const shareUrl = `${baseUrl}/playground/share/${snippet.shareId}`;

    return NextResponse.json({
      success: true,
      shareId: snippet.shareId,
      shareUrl,
      shareCount: snippet.shareCount,
    });
  } catch (error: any) {
    console.error("Share error:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 },
    );
  }
}

// DELETE - Unshare (make private)
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { snippetId } = await req.json();

    const snippet = await CodeSnippet.findOne({
      _id: snippetId,
      user: userId,
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    snippet.isPublic = false;
    await snippet.save();

    return NextResponse.json({
      success: true,
      message: "Snippet is now private",
    });
  } catch (error: any) {
    console.error("Unshare error:", error);
    return NextResponse.json({ error: "Failed to unshare" }, { status: 500 });
  }
}
