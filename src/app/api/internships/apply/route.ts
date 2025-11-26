import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendEmail, emailTemplates } from "@/lib/mail";
import User from "@/models/User";
import Internship from "@/models/Internship";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { internshipId, resume, coverLetter, portfolio, linkedin, transactionId, amountPaid } = await req.json();

    if (!internshipId || !resume || !coverLetter) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if already applied
    const existing = await Application.findOne({
      student: decoded.userId,
      internship: internshipId,
    });

    if (existing) {
      return NextResponse.json({ error: "Already applied to this internship" }, { status: 400 });
    }

    const application = await Application.create({
      student: decoded.userId,
      internship: internshipId,
      resume,
      coverLetter,
      portfolio,
      linkedin,
      transactionId,
      amountPaid,
    });

    // Fetch details for email
    const student = await User.findById(decoded.userId);
    const internship = await Internship.findById(internshipId);

    if (student && internship) {
      await sendEmail(
        student.email,
        `Application Received: ${internship.title}`,
        emailTemplates.applicationReceived(student.firstName, internship.title)
      );
      
      // Optional: Notify Admin
      // await sendEmail(process.env.ADMIN_EMAIL, "New Application", ...);
    }

    return NextResponse.json({ message: "Application submitted successfully", application }, { status: 201 });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
