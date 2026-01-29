import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendEmail, emailTemplates } from "@/lib/mail";
import User from "@/models/User";
import Internship from "@/models/Internship";
import Activity from "@/models/Activity";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const {
      internshipId,
      resume,
      coverLetter,
      portfolio,
      linkedin,
      transactionId,
      amountPaid,
    } = await req.json();

    if (!internshipId || !resume || !coverLetter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if already applied
    let application = await Application.findOne({
      student: decoded.userId,
      internship: internshipId,
    });

    if (application) {
      const isPaidValues = amountPaid > 0;
      // Allow retry if:
      // 1. Rejected
      // 2. Pending AND it was a paid application (meaning payment failed/cancelled)
      if (
        application.status === "rejected" ||
        (application.status === "pending" && isPaidValues)
      ) {
        // Re-open/Update the application
        application.status = "pending";
        application.resume = resume;
        application.coverLetter = coverLetter;
        application.portfolio = portfolio;
        application.linkedin = linkedin;
        application.transactionId = transactionId;
        application.amountPaid = amountPaid;
        application.appliedAt = new Date(); // Reset applied date
        await application.save();
      } else {
        return NextResponse.json(
          { error: "Already applied to this internship" },
          { status: 400 },
        );
      }
    } else {
      // Create new
      application = await Application.create({
        student: decoded.userId,
        internship: internshipId,
        resume,
        coverLetter,
        portfolio,
        linkedin,
        transactionId,
        amountPaid,
      });
    }

    // Record Activity
    await Activity.create({
      student: decoded.userId,
      type: "internship_applied",
      category: "internship",
      relatedId: internshipId,
      metadata: {
        internshipName:
          (await Internship.findById(internshipId))?.title || "Internship",
      },
      date: new Date(),
    });

    // Fetch details for email
    const student = await User.findById(decoded.userId);
    const internship = await Internship.findById(internshipId);

    if (student && internship) {
      await sendEmail(
        student.email,
        `Application Received: ${internship.title}`,
        emailTemplates.applicationReceived(student.firstName, internship.title),
      );

      // Optional: Notify Admin
      // await sendEmail(process.env.ADMIN_EMAIL, "New Application", ...);
    }

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 },
    );
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
