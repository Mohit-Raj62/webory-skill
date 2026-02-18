import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Get URL parameters for pagination
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Fetch user's chat sessions
    const chatSessions = await ChatMessage.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("sessionId messages createdAt updatedAt resolved")
      .lean();

    // Format response with session summaries
    const sessions = chatSessions.map((session: any) => {
      const lastMessage = session.messages[session.messages.length - 1];
      const firstUserMessage = session.messages.find(
        (m: any) => m.role === "user",
      );

      return {
        sessionId: session.sessionId,
        preview: firstUserMessage?.content?.substring(0, 100) || "Chat session",
        messageCount: session.messages.length,
        lastMessageAt: lastMessage?.timestamp || session.updatedAt,
        createdAt: session.createdAt,
        resolved: session.resolved,
      };
    });

    // Get total count for pagination
    const totalCount = await ChatMessage.countDocuments({ userId });

    return NextResponse.json({
      sessions,
      pagination: {
        total: totalCount,
        limit,
        skip,
        hasMore: skip + limit < totalCount,
      },
    });
  } catch (error: any) {
    console.error("Chat History Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 },
    );
  }
}

// Get specific session details
export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 },
      );
    }

    // Fetch specific session
    const chatSession = await ChatMessage.findOne({
      sessionId,
      userId,
    }).lean();

    if (!chatSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      session: chatSession,
    });
  } catch (error: any) {
    console.error("Chat Session Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}
