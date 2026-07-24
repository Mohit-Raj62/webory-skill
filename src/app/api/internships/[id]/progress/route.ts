import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
        await dbConnect();
    const params = await props.params;
    
        let actualInternshipId = params.id;
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            const internship = await Internship.findOne({ slug: params.id }).select('_id');
            if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });
            actualInternshipId = internship._id.toString();
        }
        const internshipId = actualInternshipId;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    // Find application
    const application = await Application.findOne({ student: userId, internship: internshipId });
    
    if (!application) {
      return NextResponse.json({ 
        progress: 0,
        watchedVideos: [],
        totalVideos: 0
      });
    }

    // Get internship
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    return NextResponse.json({
      progress: application.progress,
      watchedVideos: application.watchedVideos,
      totalVideos: internship.videos.length,
    });

  } catch (error: any) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
