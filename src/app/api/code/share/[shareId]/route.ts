import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CodeSnippet from "@/models/CodeSnippet";

// GET - Get shared code by shareId
export async function GET(
  req: NextRequest,
  { params }: { params: { shareId: string } },
) {
  try {
    await dbConnect();

    const { shareId } = params;

    const snippet = await CodeSnippet.findOne({
      shareId,
      isPublic: true,
    }).populate("user", "name email");

    if (!snippet) {
      return NextResponse.json(
        { error: "Shared code not found or is private" },
        { status: 404 },
      );
    }

    // Increment view count
    snippet.viewCount += 1;
    await snippet.save();

    return NextResponse.json({
      success: true,
      snippet: {
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        author: snippet.user?.name || "Anonymous",
        sharedAt: snippet.sharedAt,
        viewCount: snippet.viewCount,
      },
    });
  } catch (error: any) {
    console.error("Get shared code error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared code" },
      { status: 500 },
    );
  }
}
