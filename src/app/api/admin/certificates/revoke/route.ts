import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CustomCertificate from "@/models/CustomCertificate";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import User from "@/models/User";
import ActivityLog from "@/models/ActivityLog";
import "@/models/Course";
import "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const callerId = decoded.userId || decoded.id;
    let role = decoded.role;

    const caller = await User.findById(callerId).select("role email").lean();
    if (
      caller?.role === "superadmin" ||
      caller?.email?.toLowerCase() === "mohitraj7321@gmail.com"
    ) {
      role = "superadmin";
    }

    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [revokedCustom, revokedCourses, revokedInternships, recentCustom, recentCourses, recentInternships] = await Promise.all([
      CustomCertificate.find({ isRevoked: true }).sort({ revokedAt: -1 }).lean(),
      Enrollment.find({ isRevoked: true }).populate("student", "firstName lastName email").populate("course", "title").sort({ revokedAt: -1 }).lean(),
      Application.find({ isRevoked: true }).populate("student", "firstName lastName email").populate("internship", "title").sort({ revokedAt: -1 }).lean(),
      CustomCertificate.find({ isRevoked: { $ne: true } }).sort({ issuedAt: -1 }).limit(20).lean(),
      Enrollment.find({ certificateId: { $exists: true, $nin: [null, ""] }, isRevoked: { $ne: true } })
        .populate("student", "firstName lastName email")
        .populate("course", "title")
        .sort({ completedAt: -1, updatedAt: -1 })
        .limit(20)
        .lean(),
      Application.find({ certificateId: { $exists: true, $nin: [null, ""] }, isRevoked: { $ne: true } })
        .populate("student", "firstName lastName email")
        .populate("internship", "title")
        .sort({ completedAt: -1, updatedAt: -1 })
        .limit(20)
        .lean(),
    ]);

    const revokedList = [
      ...revokedCustom.map((c: any) => ({
        certificateId: c.certificateId,
        studentName: c.studentName,
        title: c.title,
        type: c.hackathonTitle ? "Hackathon" : "Custom",
        revokedReason: c.revokedReason,
        revokedAt: c.revokedAt,
      })),
      ...revokedCourses.map((e: any) => ({
        certificateId: e.certificateId,
        studentName: e.student ? `${e.student.firstName} ${e.student.lastName}` : "Student",
        title: e.course?.title || "Course",
        type: "Course",
        revokedReason: e.revokedReason,
        revokedAt: e.revokedAt,
      })),
      ...revokedInternships.map((a: any) => ({
        certificateId: a.certificateId,
        studentName: a.student ? `${a.student.firstName} ${a.student.lastName}` : "Student",
        title: a.internship?.title || "Internship",
        type: "Internship",
        revokedReason: a.revokedReason,
        revokedAt: a.revokedAt,
      })),
    ];

    const recentValidList = [
      ...recentCustom.map((c: any) => ({
        certificateId: c.certificateId,
        studentName: c.studentName,
        title: c.title,
        type: c.hackathonTitle ? "Hackathon" : "Custom",
        issuedAt: c.issuedAt,
      })),
      ...recentCourses.map((e: any) => ({
        certificateId: e.certificateId,
        studentName: e.student ? `${e.student.firstName} ${e.student.lastName}` : "Student",
        title: e.course?.title || "Course",
        type: "Course",
        issuedAt: e.completedAt || e.updatedAt || e.enrolledAt,
      })),
      ...recentInternships.map((a: any) => ({
        certificateId: a.certificateId,
        studentName: a.student ? `${a.student.firstName} ${a.student.lastName}` : "Student",
        title: a.internship?.title || "Internship",
        type: "Internship",
        issuedAt: a.completedAt || a.updatedAt || a.appliedAt,
      })),
    ].sort((a: any, b: any) => new Date(b.issuedAt || 0).getTime() - new Date(a.issuedAt || 0).getTime());

    return NextResponse.json({
      success: true,
      revokedList,
      recentValidList,
    });
  } catch (error: any) {
    console.error("Fetch revoked certs error:", error);
    return NextResponse.json({ error: "Failed to load certificate registry" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const callerId = decoded.userId || decoded.id;
    let role = decoded.role;

    const caller = await User.findById(callerId).select("role email firstName lastName").lean();
    if (
      caller?.role === "superadmin" ||
      caller?.email?.toLowerCase() === "mohitraj7321@gmail.com"
    ) {
      role = "superadmin";
    }

    // Only Superadmin can revoke or restore certificates
    if (role !== "superadmin") {
      return NextResponse.json(
        { error: "Only Superadmin has authority to revoke or reinstate certificates" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { certificateId, isRevoked = true, reason = "Violated terms or refunded" } = body;

    if (!certificateId) {
      return NextResponse.json(
        { error: "Certificate ID is required" },
        { status: 400 }
      );
    }

    const cleanId = decodeURIComponent(certificateId).trim();
    const escapedId = cleanId.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const idRegex = new RegExp(`^${escapedId}$`, "i");
    let updatedType = null;
    let studentName = "";

    // 1. Try CustomCertificate
    const customCert = await CustomCertificate.findOne({
      $or: [{ certificateId: idRegex }, { certificateKey: idRegex }],
    });
    if (customCert) {
      customCert.isRevoked = isRevoked;
      customCert.revokedReason = isRevoked ? reason : null;
      customCert.revokedAt = isRevoked ? new Date() : null;
      await customCert.save();
      updatedType = "Hackathon / Custom Certificate";
      studentName = customCert.studentName;
    }

    // 2. Try Enrollment
    if (!updatedType) {
      const enrollment = await Enrollment.findOne({
        $or: [{ certificateId: idRegex }, { certificateKey: idRegex }],
      }).populate("student", "firstName lastName");
      if (enrollment) {
        enrollment.isRevoked = isRevoked;
        enrollment.revokedReason = isRevoked ? reason : null;
        enrollment.revokedAt = isRevoked ? new Date() : null;
        await enrollment.save();
        updatedType = "Course Certificate";
        studentName = enrollment.student
          ? `${enrollment.student.firstName} ${enrollment.student.lastName}`
          : "Student";
      }
    }

    // 3. Try Application (Internship)
    if (!updatedType) {
      const application = await Application.findOne({
        $or: [{ certificateId: idRegex }, { certificateKey: idRegex }],
      }).populate("student", "firstName lastName");
      if (application) {
        application.isRevoked = isRevoked;
        application.revokedReason = isRevoked ? reason : null;
        application.revokedAt = isRevoked ? new Date() : null;
        await application.save();
        updatedType = "Internship Certificate";
        studentName = application.student
          ? `${application.student.firstName} ${application.student.lastName}`
          : "Student";
      }
    }

    if (!updatedType) {
      return NextResponse.json(
        { error: `Certificate with ID '${cleanId}' not found in registry` },
        { status: 404 }
      );
    }

    // Log in ActivityLog
    try {
      await ActivityLog.create({
        user: callerId,
        action: isRevoked ? "REVOKE_CERTIFICATE" : "REINSTATE_CERTIFICATE",
        description: `Superadmin ${caller?.firstName || "Admin"} ${
          isRevoked ? "REVOKED" : "REINSTATED"
        } ${updatedType} (${cleanId}) for ${studentName}. Reason: ${reason}`,
        targetModel: "Certificate",
        metadata: { certificateId: cleanId, isRevoked, reason },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Certificate ${cleanId} has been ${
        isRevoked ? "successfully REVOKED" : "REINSTATED to valid status"
      }.`,
      isRevoked,
      updatedType,
      studentName,
    });
  } catch (error: any) {
    console.error("Certificate revocation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update certificate status" },
      { status: 500 }
    );
  }
}

