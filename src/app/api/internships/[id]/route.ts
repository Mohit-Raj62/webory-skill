import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT - Update internship
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const data = await req.json();

    const internship = await Internship.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json({ internship });
  } catch (error) {
    console.error("Update internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
