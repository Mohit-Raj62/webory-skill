import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Admin Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const data = await req.json();

    if (!data.title || !data.theme || !data.startDate || !data.endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate Slug
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-0]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const newHackathon = await Hackathon.create({
      ...data,
      slug,
      registeredUsers: [],
    });

    return NextResponse.json({
      success: true,
      message: "Hackathon created successfully",
      data: newHackathon,
    });
  } catch (error: any) {
    console.error("ADMIN_HACKATHON_CREATE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
