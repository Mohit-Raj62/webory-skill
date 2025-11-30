import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentProof from "@/models/PaymentProof";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

// PUT - Verify or reject payment proof
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const adminId = decoded.userId || decoded.id;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, rejectionReason } = await req.json();

    if (!action || !["verify", "reject"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "verify" or "reject"' },
        { status: 400 }
      );
    }

    const paymentProof = await PaymentProof.findById(id);

    if (!paymentProof) {
      return NextResponse.json(
        { error: "Payment proof not found" },
        { status: 404 }
      );
    }

    if (paymentProof.status !== "pending") {
      return NextResponse.json(
        { error: "Payment proof has already been processed" },
        { status: 400 }
      );
    }

    if (action === "verify") {
      // Update payment proof status
      paymentProof.status = "verified";
      paymentProof.verifiedBy = adminId;
      paymentProof.verifiedAt = new Date();
      await paymentProof.save();

      // Create enrollment based on payment type
      if (paymentProof.paymentType === "course") {
        const enrollment = await Enrollment.create({
          student: paymentProof.student,
          course: paymentProof.course,
          status: "active",
          enrolledAt: new Date(),
        });

        return NextResponse.json({
          message:
            "Payment verified and student enrolled in course successfully",
          paymentProof,
          enrollment,
        });
      } else if (paymentProof.paymentType === "internship") {
        // For internships, find or create an Application and mark it as accepted
        let application = await Application.findOne({
          student: paymentProof.student,
          internship: paymentProof.internship,
        });

        if (application) {
          // Update existing application to accepted status
          application.status = "accepted";
          await application.save();
        } else {
          // Create a new application with accepted status
          application = await Application.create({
            student: paymentProof.student,
            internship: paymentProof.internship,
            status: "accepted",
            resume: "", // Will be filled later by student
            coverLetter: "Payment verified - enrollment confirmed",
            appliedAt: new Date(),
          });
        }

        return NextResponse.json({
          message:
            "Payment verified and student enrolled in internship successfully",
          paymentProof,
          application,
        });
      } else {
        return NextResponse.json({
          message: "Payment verified successfully",
          paymentProof,
        });
      }
    } else {
      // Reject payment
      paymentProof.status = "rejected";
      paymentProof.verifiedBy = adminId;
      paymentProof.verifiedAt = new Date();
      paymentProof.rejectionReason = rejectionReason || "Invalid payment proof";
      await paymentProof.save();

      return NextResponse.json({
        message: "Payment proof rejected",
        paymentProof,
      });
    }
  } catch (error) {
    console.error("Verify payment proof error:", error);
    return NextResponse.json(
      { error: "Failed to process payment proof" },
      { status: 500 }
    );
  }
}
