import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import Course from "@/models/Course";
import Internship from "@/models/Internship";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
        { status: 400 }
      );
    }

    let certificateId = "";
    let certificateKey = "";
    let title = "";
    let userId = "";

    if (type === "course") {
      const enrollment = await Enrollment.findById(id).populate("course");
      if (!enrollment) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
      }

      if (enrollment.certificateId) {
        return NextResponse.json(
          { error: "Certificate already exists" },
          { status: 400 }
        );
      }

      title = enrollment.course.title;
      userId = enrollment.student.toString();

      // Generate ID and Key
      const courseTitleSlug = title
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 4);

      certificateId = `${courseTitleSlug}-${userId
        .substring(0, 6)
        .toUpperCase()}-${Date.now().toString().substring(8)}`;

      certificateKey =
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        Math.random().toString(36).substring(2, 10).toUpperCase();

      enrollment.certificateId = certificateId;
      enrollment.certificateKey = certificateKey;
      await enrollment.save();
    } else if (type === "internship") {
      const application = await Application.findById(id).populate("internship");
      if (!application) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      if (application.certificateId) {
        return NextResponse.json(
          { error: "Certificate already exists" },
          { status: 400 }
        );
      }

      title = application.internship.title;
      userId = application.student.toString();

      // Generate ID and Key
      const titleSlug = title
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 4);

      certificateId = `INT-${titleSlug}-${userId
        .substring(0, 6)
        .toUpperCase()}-${Date.now().toString().substring(8)}`;

      certificateKey =
        Math.random().toString(36).substring(2, 10).toUpperCase() +
        Math.random().toString(36).substring(2, 10).toUpperCase();

      application.certificateId = certificateId;
      application.certificateKey = certificateKey;
      application.completedAt = new Date(); // Ensure completedAt is set
      await application.save();
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      certificateId,
      certificateKey,
    });
  } catch (error) {
    console.error("Issue certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
