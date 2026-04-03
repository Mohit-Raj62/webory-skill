import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HackathonSubmission from "@/models/HackathonSubmission";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Admin Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const submissions = await HackathonSubmission.find({ hackathonId: id })
      .populate("userId", "name email firstName lastName")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
