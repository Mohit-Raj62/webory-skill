import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentProof from "@/models/PaymentProof";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import { sendEmail, emailTemplates } from "@/lib/mail";

export const dynamic = "force-dynamic";

// POST - Submit payment proof for verification
export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId || decoded.id;

    const {
      courseId,
      internshipId,
      transactionId,
      amount,
      screenshot,
      promoCode,
      paymentType,
    } = await req.json();

    console.log("Received payment proof data:", {
      courseId,
      internshipId,
      transactionId: transactionId ? "present" : "missing",
      amount,
      screenshot: screenshot ? `${screenshot.length} chars` : "missing",
      promoCode,
      paymentType,
    });

    if (
      !transactionId ||
      amount === undefined ||
      amount === null ||
      !screenshot
    ) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!courseId && !internshipId) {
      console.log("Validation failed: No courseId or internshipId");
      return NextResponse.json(
        { error: "Either courseId or internshipId is required" },
        { status: 400 }
      );
    }

    // Check if transaction ID already exists
    const existingProof = await PaymentProof.findOne({ transactionId });
    if (existingProof) {
      return NextResponse.json(
        { error: "This transaction ID has already been submitted" },
        { status: 400 }
      );
    }

    // Create payment proof entry
    const paymentProof = await PaymentProof.create({
      student: userId,
      course: courseId || null,
      internship: internshipId || null,
      paymentType: paymentType || (courseId ? "course" : "internship"),
      transactionId,
      amount,
      screenshot,
      promoCode,
      status: "pending",
    });

    // Send Admin Notification Email
    try {
      const student = await User.findById(userId);
      let itemTitle = "Unknown Item";

      if (courseId) {
        const course = await Course.findById(courseId);
        itemTitle = course?.title || "Unknown Course";
      } else if (internshipId) {
        const internship = await Internship.findById(internshipId);
        itemTitle = internship?.title || "Unknown Internship";
      }

      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

      if (adminEmail && student) {
        await sendEmail(
          adminEmail,
          `💰 New Payment Received - ${itemTitle}`,
          emailTemplates.adminPaymentNotification(
            "Admin",
            `${student.firstName} ${student.lastName}`,
            itemTitle,
            amount,
            transactionId,
            courseId ? "course" : "internship"
          )
        );
        console.log("✅ Admin payment notification sent");
      }
    } catch (emailError) {
      console.error("❌ Failed to send admin notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message:
        "Payment proof submitted successfully. Waiting for admin verification.",
      paymentProof,
    });
  } catch (error) {
    console.error("Submit payment proof error:", error);
    return NextResponse.json(
      { error: "Failed to submit payment proof" },
      { status: 500 }
    );
  }
}
