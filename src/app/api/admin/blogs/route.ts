import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// GET: List all blogs (admin)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};
    if (status && status !== "all") query.status = status;
    if (category && category !== "all") query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    // Run blogs query and stats aggregation in parallel (2 queries instead of 6)
    const [blogs, statsResult] = await Promise.all([
      Blog.find(query)
        .populate("author", "firstName lastName email avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.aggregate([
        {
          $group: {
            _id: null,
            totalBlogs: { $sum: 1 },
            pendingCount: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
            publishedCount: {
              $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
            },
            draftCount: {
              $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const total =
      blogs.length < limit && page === 1
        ? blogs.length
        : await Blog.countDocuments(query);
    const stats = statsResult[0] || {
      totalBlogs: 0,
      pendingCount: 0,
      publishedCount: 0,
      draftCount: 0,
    };

    return NextResponse.json({
      data: blogs,
      stats,
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
