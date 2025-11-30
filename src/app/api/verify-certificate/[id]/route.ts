import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    // 1. Search in Enrollments (Course Certificates)
    const enrollment = await Enrollment.findOne({ certificateId: id })
      .populate("student", "firstName lastName email")
      .populate("course", "title");

    if (enrollment) {
      return NextResponse.json({
        valid: true,
        type: "course",
        data: {
          studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
          title: enrollment.course.title,
          date: enrollment.updatedAt, // Or a specific completion date field if available
          score: enrollment.progress, // Assuming 100% progress means completion, or use a specific score field
          certificateId: enrollment.certificateId,
          certificateKey: enrollment.certificateKey,
        },
      });
    }

    // 2. Search in Applications (Internship Certificates)
    const application = await Application.findOne({ certificateId: id })
      .populate("student", "firstName lastName email")
      .populate("internship", "title company");

    if (application) {
      return NextResponse.json({
        valid: true,
        type: "internship",
        data: {
          studentName: `${application.student.firstName} ${application.student.lastName}`,
          title: application.internship.title,
          company: application.internship.company,
          date: application.completedAt,
          certificateId: application.certificateId,
          certificateKey: application.certificateKey,
        },
      });
    }

    return NextResponse.json(
      { valid: false, error: "Certificate not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
