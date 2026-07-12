import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VideoTestimonial from "@/models/VideoTestimonial";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const testimonials = await VideoTestimonial.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching video testimonials:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { studentName, roleOrCourse, videoUrl, thumbnailUrl, isActive, order } = body;

    if (!studentName || !roleOrCourse || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTestimonial = await VideoTestimonial.create({
      studentName,
      roleOrCourse,
      videoUrl,
      thumbnailUrl,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating video testimonial:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
