import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveClass from "@/models/LiveClass";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT - Update a live class
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin" && decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const liveClass = await LiveClass.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!liveClass) {
      return NextResponse.json(
        { error: "Live class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ liveClass });
  } catch (error) {
    console.error("Update live class error:", error);
    return NextResponse.json(
      { error: "Failed to update live class" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a live class
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin" && decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const liveClass = await LiveClass.findByIdAndDelete(id);

    if (!liveClass) {
      return NextResponse.json(
        { error: "Live class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Live class deleted successfully" });
  } catch (error) {
    console.error("Delete live class error:", error);
    return NextResponse.json(
      { error: "Failed to delete live class" },
      { status: 500 }
    );
  }
}
