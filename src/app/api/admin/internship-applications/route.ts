import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Internship from "@/models/Internship"; // Ensure model is registered
import User from "@/models/User"; // Ensure model is registered
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applications = await Application.find()
      .populate("student", "firstName lastName email")
      .populate("internship", "title company price")
      .sort({ appliedAt: -1 });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
