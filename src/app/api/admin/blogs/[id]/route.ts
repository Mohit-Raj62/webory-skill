import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// PUT: Admin update/approve/reject/feature a blog
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
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const body = await request.json();

    // Action: Approve
    if (body.action === "approve") {
      blog.status = "published";
      blog.publishedAt = new Date();
      (blog as any).rejectionReason = null;
      await blog.save();
      return NextResponse.json({
        message: "Blog approved and published",
        data: blog,
      });
    }

    // Action: Reject
    if (body.action === "reject") {
      blog.status = "rejected";
      blog.rejectionReason = body.reason || "Does not meet quality standards";
      (blog as any).publishedAt = null;
      await blog.save();
      return NextResponse.json({
        message: "Blog rejected",
        data: blog,
      });
    }

    // Action: Toggle featured
    if (body.action === "toggleFeatured") {
      blog.isFeatured = !blog.isFeatured;
      await blog.save();
      return NextResponse.json({
        message: `Blog ${blog.isFeatured ? "featured" : "unfeatured"}`,
        data: blog,
      });
    }

    // Action: Unpublish
    if (body.action === "unpublish") {
      blog.status = "draft";
      (blog as any).publishedAt = null;
      await blog.save();
      return NextResponse.json({
        message: "Blog unpublished",
        data: blog,
      });
    }

    // Regular edit by admin
    const { title, content, excerpt, coverImage, category, tags } = body;
    if (title) blog.title = title;
    if (content) {
      blog.content = content;
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter(Boolean).length;
      blog.readTime = Math.max(1, Math.ceil(words / 200));
    }
    if (excerpt) blog.excerpt = excerpt;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;

    await blog.save();

    return NextResponse.json({
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Admin delete any blog
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
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
