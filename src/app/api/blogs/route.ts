import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

// GET: Fetch published blogs for public website
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Fetch single blog by slug
    if (slug) {
      const blog = await Blog.findOne({ slug, status: "published" })
        .populate("author", "firstName lastName avatar bio expertise")
        .lean();

      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      // Fetch related blogs (same category, exclude current)
      const relatedBlogs = await Blog.find({
        status: "published",
        category: blog.category,
        _id: { $ne: blog._id },
      })
        .populate("author", "firstName lastName avatar")
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean();

      return NextResponse.json({ data: blog, related: relatedBlogs });
    }

    // Fetch list of published blogs
    const query: any = { status: "published" };
    if (category && category !== "all") query.category = category;
    if (featured === "true") query.isFeatured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "firstName lastName avatar")
      .sort({ isFeatured: -1, publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get unique categories for filter
    const categories = await Blog.distinct("category", { status: "published" });

    return NextResponse.json({
      data: blogs,
      categories,
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
