import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import CodeSnippet from "@/models/CodeSnippet";

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

export async function GET() {
  try {
    await dbConnect();
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snippets = await CodeSnippet.find({ user: userId })
      .select("title language lastModified updatedAt")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ snippets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, language, code } = await req.json();

    // Check if file with same name exists for user
    const existing = await CodeSnippet.findOne({ user: userId, title });
    if (existing) {
      return NextResponse.json(
        { error: "File with this name already exists" },
        { status: 400 }
      );
    }

    const snippet = await CodeSnippet.create({
      user: userId,
      title,
      language,
      code,
      lastModified: new Date(),
    });

    return NextResponse.json({ snippet }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
