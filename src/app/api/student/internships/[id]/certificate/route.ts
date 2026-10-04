import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import User from "@/models/User";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id: internshipSlugOrId } = params;

    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!mongoose.models.User) mongoose.model("User", User.schema);
    if (!mongoose.models.Internship) mongoose.model("Internship", Internship.schema);
    if (!mongoose.models.Application) mongoose.model("Application", Application.schema);

    // Resolve internship ID
    let actualInternshipId = internshipSlugOrId;
    if (!mongoose.isValidObjectId(internshipSlugOrId)) {
        const intDoc = await Internship.findOne({ slug: internshipSlugOrId }).select("_id");
        if (!intDoc) {
             return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }
        actualInternshipId = intDoc._id.toString();
    }

    const application = await Application.findOne({ student: userId, internship: actualInternshipId });

    if (!application) {
      return NextResponse.json(
        { error: "Application record not found in database" },
        { status: 404 }
      );
    }

    // If completed, ensure certificateId and certificateKey exist
    if (application.status === "completed") {
      let needsSave = false;
      if (!application.certificateId) {
        application.certificateId = `INT-${actualInternshipId.substring(0, 4).toUpperCase()}-${userId.substring(0, 6).toUpperCase()}-${Date.now().toString().substring(8)}`;
        needsSave = true;
      }
      if (!application.certificateKey) {
        application.certificateKey =
          Math.random().toString(36).substring(2, 10).toUpperCase() +
          Math.random().toString(36).substring(2, 10).toUpperCase();
        needsSave = true;
      }
      if (!application.completedAt) {
        application.completedAt = new Date();
        needsSave = true;
      }
      if (needsSave) {
        await application.save();
      }
    }

    const populatedApplication = await Application.findById(application._id)
      .populate({ path: "internship", model: Internship, select: "title company location stipend type collaboration collaborations signatures" })
      .populate({ path: "student", model: User, select: "firstName lastName email" })
      .lean();

    return NextResponse.json(populatedApplication);
  } catch (error: any) {
    console.error("=== Certificate API Error ===", error);
    return NextResponse.json(
      { 
        error: `Server-side error: ${error.message}`
      },
      { status: 500 }
    );
  }
}
