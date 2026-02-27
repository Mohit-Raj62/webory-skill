import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Helper: generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Helper: calculate read time (words / 200 wpm)
function calculateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, ""); // strip HTML
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// GET: List teacher's own blogs
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = { author: userId };
    if (status && status !== "all") {
      query.status = status;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new blog
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, excerpt, coverImage, category, tags, status } =
      body;

    if (!title || !content || !excerpt) {
      return NextResponse.json(
        { error: "Title, content, and excerpt are required" },
        { status: 400 },
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const readTime = calculateReadTime(content);

    const savedBlog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImage || undefined,
      author: userId,
      category: category || "Other",
      tags: tags || [],
      status: status === "pending" ? "pending" : "draft",
      readTime,
    });

    return NextResponse.json({
      message: "Blog created successfully",
      data: savedBlog,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
