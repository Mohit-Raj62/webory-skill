import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentProof from "@/models/PaymentProof";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// GET - Fetch all payment proofs (for admin)
export async function GET(req: Request) {
  try {
    await dbConnect();

    // Ensure models are registered
    const _ = [Course, Internship];

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    console.log("Fetching payment proofs with status:", status);

    const paymentProofs = await PaymentProof.find({ status })
      .populate({
        path: "student",
        select: "firstName lastName email",
        options: { strictPopulate: false },
      })
      .populate({
        path: "course",
        select: "title price",
        options: { strictPopulate: false },
      })
      .populate({
        path: "internship",
        select: "title price",
        options: { strictPopulate: false },
      })
      .populate({
        path: "verifiedBy",
        select: "firstName lastName",
        options: { strictPopulate: false },
      })
      .sort({ submittedAt: -1 })
      .lean();

    console.log(`Found ${paymentProofs.length} payment proofs`);

    return NextResponse.json({ paymentProofs });
  } catch (error) {
    console.error("Fetch payment proofs error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: "Failed to fetch payment proofs" },
      { status: 500 }
    );
  }
}
