import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PDFAccess from "@/models/PDFAccess";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper for auth
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    await dbConnect();
    return await User.findById(decoded.userId);
  } catch (error) {
    return null;
  }
}

// POST - Track PDF access (view or download)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; pdfId: string }> }
) {
  try {
    const { id, pdfId } = await params;
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { downloaded } = body;

    await dbConnect();

    // Create access record
    await PDFAccess.create({
      student: user._id,
      course: id,
      pdfResourceId: pdfId,
      downloaded: downloaded || false,
    });

    return NextResponse.json({ message: "Access tracked successfully" });
  } catch (error) {
    console.error("Error tracking PDF access:", error);
    return NextResponse.json(
      { error: "Failed to track access" },
      { status: 500 }
    );
  }
}
