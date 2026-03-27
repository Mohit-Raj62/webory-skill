import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const testimonials = await Ambassador.find({
      status: "active",
      testimonial: { $exists: true, $ne: "" },
      showTestimonial: true,
    })
      .limit(6)
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture",
        model: User,
      })
      .lean();

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}
