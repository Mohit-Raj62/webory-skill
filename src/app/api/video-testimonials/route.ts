import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VideoTestimonial from "@/models/VideoTestimonial";

export async function GET() {
  try {
    await dbConnect();

    // Fetch only active testimonials, sorted by order
    const testimonials = await VideoTestimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching public video testimonials:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
