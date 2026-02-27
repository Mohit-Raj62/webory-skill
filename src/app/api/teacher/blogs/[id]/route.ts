import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Helper: calculate read time
function calculateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// GET: Get a single blog by ID (teacher's own)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blog = await Blog.findOne({ _id: id, author: userId }).lean();
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ data: blog });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update own blog or submit for review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blog = await Blog.findOne({ _id: id, author: userId });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const body = await request.json();

    // If action is "submit", change status to pending
    if (body.action === "submit") {
      if (blog.status !== "draft" && blog.status !== "rejected") {
        return NextResponse.json(
          { error: "Only draft or rejected blogs can be submitted" },
          { status: 400 },
        );
      }
      blog.status = "pending";
      (blog as any).rejectionReason = null;
      await blog.save();
      return NextResponse.json({
        message: "Blog submitted for review",
        data: blog,
      });
    }

    // Regular update
    const { title, content, excerpt, coverImage, category, tags } = body;

    if (title) blog.title = title;
    if (content) {
      blog.content = content;
      blog.readTime = calculateReadTime(content);
    }
    if (excerpt) blog.excerpt = excerpt;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;

    // If blog was rejected, allow editing and keep as draft
    if (blog.status === "rejected") {
      blog.status = "draft";
      (blog as any).rejectionReason = null;
    }

    await blog.save();

    return NextResponse.json({
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete own blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blog = await Blog.findOneAndDelete({
      _id: id,
      author: userId,
    });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
