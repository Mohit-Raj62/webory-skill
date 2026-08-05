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

    const application = await Application.findOne({ student: userId, internship: actualInternshipId })
      .populate({ path: "internship", model: Internship })
      .populate({ path: "student", model: User })
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: "Application record not found for this internship" },
        { status: 404 }
      );
    }

    const responseData = {
      student: {
        firstName: application.student?.firstName || "Student",
        lastName: application.student?.lastName || "Name",
        email: application.student?.email || "email@example.com",
        college: application.college || "N/A",
        currentYear: application.currentYear || "N/A",
      },
      internship: {
        title: application.internship?.title || "Internship Position",
        company: application.internship?.company || "Webory Skills",
        location: application.internship?.location || "Remote",
        type: application.internship?.type || "Full-time",
        stipend: application.internship?.stipend || "To be discussed",
      },
      startDate:
        application.startDate ||
        application.offerDate ||
        application.appliedAt ||
        new Date(),
      offerDate: application.offerDate || application.appliedAt || new Date(),
      duration: application.duration || "3 months",
      appliedAt: application.appliedAt || new Date(),
      status: application.status,
      isDemo: false,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("=== OFFER LETTER API Error ===", error);
    return NextResponse.json(
      {
        error: `Server error: ${error.message}`
      },
      { status: 500 }
    );
  }
}
