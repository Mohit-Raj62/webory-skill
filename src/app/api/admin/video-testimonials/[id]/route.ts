import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VideoTestimonial from "@/models/VideoTestimonial";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    
    // Await params as required in Next.js 15+ 
    const { id } = await Promise.resolve(params);

    const updatedTestimonial = await VideoTestimonial.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Error updating video testimonial:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await Promise.resolve(params);
    const deletedTestimonial = await VideoTestimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting video testimonial:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
