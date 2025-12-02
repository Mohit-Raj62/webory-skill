import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import CustomCertificate from "@/models/CustomCertificate";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
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
          date: enrollment.updatedAt,
          score: enrollment.progress,
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

    // 3. Search in Custom Certificates
    const customCert = await CustomCertificate.findOne({ certificateId: id });

    if (customCert) {
      return NextResponse.json({
        valid: true,
        type: "custom",
        data: {
          studentName: customCert.studentName,
          title: customCert.title,
          description: customCert.description,
          date: customCert.issuedAt,
          certificateId: customCert.certificateId,
          certificateKey: customCert.certificateKey,
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
