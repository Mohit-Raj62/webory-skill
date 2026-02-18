import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";

export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      // Delete specific session
      const result = await ChatMessage.deleteOne({
        sessionId,
        userId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Session deleted successfully",
      });
    } else {
      // Delete all sessions for user
      const result = await ChatMessage.deleteMany({ userId });

      return NextResponse.json({
        success: true,
        message: `Deleted ${result.deletedCount} chat sessions`,
        deletedCount: result.deletedCount,
      });
    }
  } catch (error: any) {
    console.error("Delete Chat Error:", error);
    return NextResponse.json(
      { error: "Failed to delete chat history" },
      { status: 500 },
    );
  }
}
