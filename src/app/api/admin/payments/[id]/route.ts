import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentProof from "@/models/PaymentProof";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendEmail, emailTemplates } from "@/lib/mail";

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

        // Send enrollment confirmation and invoice emails
        try {
          const user = await User.findById(paymentProof.student);
          const course = await Course.findById(paymentProof.course);

          if (user && course) {
            const courseLink = `${
              process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
            }/courses/${paymentProof.course}`;

            // Send enrollment confirmation email
            await sendEmail(
              user.email,
              `Enrolled in ${course.title}! 📚`,
              emailTemplates.courseEnrollment(
                user.firstName,
                course.title,
                courseLink
              )
            );

            // Send invoice email
            // Use enrollment ID to generate consistent transaction ID
            const invoiceTransactionId = `TXN${enrollment._id
              .toString()
              .substring(0, 12)}`;
            await sendEmail(
              user.email,
              `Invoice - ${course.title}`,
              emailTemplates.invoice(
                user.firstName + " " + user.lastName,
                course.title,
                paymentProof.amount,
                invoiceTransactionId,
                enrollment.enrolledAt.toISOString(),
                "course"
              )
            );

            console.log(
              "✅ Enrollment and invoice emails sent to:",
              user.email
            );
          }
        } catch (emailError) {
          console.error("❌ Failed to send enrollment emails:", emailError);
          // Don't fail enrollment if email fails
        }

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

        // Send acceptance and invoice emails
        try {
          const user = await User.findById(paymentProof.student);
          const internship = await Internship.findById(paymentProof.internship);

          if (user && internship) {
            const offerLink = `${
              process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
            }/profile`;

            // Send acceptance email
            await sendEmail(
              user.email,
              `Congratulations! You're Hired! 🎉`,
              emailTemplates.applicationAccepted(
                user.firstName,
                internship.title,
                offerLink
              )
            );

            // Send invoice email
            // Use application ID to generate consistent transaction ID
            const invoiceTransactionId = `TXN${application._id
              .toString()
              .substring(0, 12)}`;
            await sendEmail(
              user.email,
              `Invoice - ${internship.title}`,
              emailTemplates.invoice(
                user.firstName + " " + user.lastName,
                internship.title,
                paymentProof.amount,
                invoiceTransactionId,
                application.appliedAt.toISOString(),
                "internship"
              )
            );

            console.log(
              "✅ Acceptance and invoice emails sent to:",
              user.email
            );
          }
        } catch (emailError) {
          console.error("❌ Failed to send acceptance emails:", emailError);
          // Don't fail enrollment if email fails
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
