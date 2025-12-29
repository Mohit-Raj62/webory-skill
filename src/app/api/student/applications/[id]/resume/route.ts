import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(
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
    const { id } = await params;
    const { resume } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: "Resume URL is required" },
        { status: 400 }
      );
    }

    // Find and update application, ensuring it belongs to the student
    const application = await Application.findOneAndUpdate(
      { _id: id, student: decoded.userId },
      { resume },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Update resume error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
