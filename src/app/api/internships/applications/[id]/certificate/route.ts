import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await dbConnect();
    const { id: applicationId } = params;

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    // Fetch Application
    const application = await Application.findById(applicationId)
      .populate("internship", "title company")
      .populate("student", "firstName lastName")
      .select(
        "status startDate appliedAt duration completedAt certificateId certificateKey offerDate"
      )
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (application.student._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(application);
  } catch (error: any) {
    console.error("Certificate API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate", details: error.message },
      { status: 500 }
    );
  }
}
