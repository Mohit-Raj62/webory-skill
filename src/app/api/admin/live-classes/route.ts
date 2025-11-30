import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveClass from "@/models/LiveClass";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch all live classes
export async function GET(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin" && decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const liveClasses = await LiveClass.find()
      .sort({ date: -1 })
      .populate("instructor", "firstName lastName");

    return NextResponse.json({ liveClasses });
  } catch (error) {
    console.error("Fetch live classes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live classes" },
      { status: 500 }
    );
  }
}

// POST - Create a new live class
export async function POST(req: Request) {
  try {
    await dbConnect();
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

    const liveClass = await LiveClass.create({
      ...data,
      instructor: decoded.userId,
    });

    return NextResponse.json({ liveClass }, { status: 201 });
  } catch (error) {
    console.error("Create live class error:", error);
    return NextResponse.json(
      { error: "Failed to create live class" },
      { status: 500 }
    );
  }
}
