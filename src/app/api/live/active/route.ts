import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveSession from "@/models/LiveSession";
import mongoose from "mongoose";
import Internship from "@/models/Internship";
import Course from "@/models/Course";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get("internshipId");
    const courseId = searchParams.get("courseId");

    if (!internshipId && !courseId) {
      return NextResponse.json({ error: "Missing internshipId or courseId" }, { status: 400 });
    }

    await dbConnect();

    let query: any = { status: "active" };

    if (internshipId) {
      let actualId = internshipId;
      if (!mongoose.isValidObjectId(internshipId)) {
        const internship = await Internship.findOne({ slug: internshipId }).select("_id").lean();
        if (internship) {
          actualId = internship._id.toString();
        }
      }
      query.internshipId = actualId;
    } else if (courseId) {
      let actualId = courseId;
      if (!mongoose.isValidObjectId(courseId)) {
        const course = await Course.findOne({ slug: courseId }).select("_id").lean();
        if (course) {
          actualId = course._id.toString();
        }
      }
      query.courseId = actualId;
    }

    const activeSession = await LiveSession.findOne(query).lean();

    return NextResponse.json({
      success: true,
      session: activeSession
    });
  } catch (error) {
    console.error("Error fetching active live session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch active live session" },
      { status: 500 }
    );
  }
}
