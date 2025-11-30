import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function POST() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    // Verify admin role
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    let updatedCount = 0;

    // 1. Update Enrollments (Course Certificates)
    // Find enrollments that are completed (progress 100 or certificateEmailSent) but missing certificateId or certificateKey
    const enrollments = await Enrollment.find({
      $or: [{ progress: 100 }, { certificateEmailSent: true }],
      $and: [
        {
          $or: [
            { certificateId: { $exists: false } },
            { certificateKey: { $exists: false } },
          ],
        },
      ],
    });

    for (const enrollment of enrollments) {
      let needsSave = false;
      if (!enrollment.certificateId) {
        enrollment.certificateId = `WS-${enrollment.course
          .toString()
          .substring(0, 4)
          .toUpperCase()}-${enrollment.student
          .toString()
          .substring(0, 6)
          .toUpperCase()}-${Date.now().toString().substring(8)}`;
        needsSave = true;
      }
      if (!enrollment.certificateKey) {
        enrollment.certificateKey =
          Math.random().toString(36).substring(2, 10).toUpperCase() +
          Math.random().toString(36).substring(2, 10).toUpperCase();
        needsSave = true;
      }

      if (needsSave) {
        await enrollment.save();
        updatedCount++;
      }
    }

    // 2. Update Applications (Internship Certificates)
    // Find applications that are completed but missing certificateId or certificateKey
    const applications = await Application.find({
      status: "completed",
      $or: [
        { certificateId: { $exists: false } },
        { certificateKey: { $exists: false } },
      ],
    });

    for (const app of applications) {
      let needsSave = false;
      if (!app.certificateId) {
        // Generate ID if missing (though usually internships have it manually set or generated on completion)
        // We'll generate one if it's missing
        app.certificateId = `WS-INT-${app.internship
          .toString()
          .substring(0, 4)
          .toUpperCase()}-${app.student
          .toString()
          .substring(0, 6)
          .toUpperCase()}-${Date.now().toString().substring(8)}`;
        needsSave = true;
      }
      if (!app.certificateKey) {
        app.certificateKey =
          Math.random().toString(36).substring(2, 10).toUpperCase() +
          Math.random().toString(36).substring(2, 10).toUpperCase();
        needsSave = true;
      }

      if (needsSave) {
        await app.save();
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    console.error("Error generating certificate keys:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
