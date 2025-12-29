import { NextResponse } from "next/server";
import { verifyPayUHash } from "@/lib/payu";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Activity from "@/models/Activity";
import Course from "@/models/Course";
import Application from "@/models/Application";
import User from "@/models/User";
import { sendEmail, emailTemplates } from "@/lib/mail";
import Internship from "@/models/Internship";

const PAYU_SALT = process.env.PAYU_SALT || "your_salt";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const params: any = {};
    formData.forEach((value, key) => {
      params[key] = value;
    });

    console.log("PayU Response:", params);

    // 1. Verify Hash
    const isValidHash = verifyPayUHash(params, PAYU_SALT, params.status);

    if (!isValidHash) {
      console.error("Invalid PayU Hash");
      return NextResponse.redirect(
        `${APP_URL}/payment/failure?reason=tampered`,
        303
      );
    }

    if (params.status !== "success") {
      return NextResponse.redirect(
        `${APP_URL}/payment/failure?reason=failed&txnid=${params.txnid}`,
        303
      );
    }

    await dbConnect();

    const userId = params.udf1;
    const type = params.udf2; // 'course' | 'internship'
    const resourceId = params.udf3;
    const amount = params.amount;
    const txnid = params.txnid;

    if (type === "course") {
      await handleCourseEnrollment(userId, resourceId, txnid, amount);
    } else if (type === "internship") {
      await handleInternshipApplication(userId, resourceId, txnid, amount);
    }

    return NextResponse.redirect(
      `${APP_URL}/payment/success?txnid=${txnid}`,
      303
    );
  } catch (error) {
    console.error("PayU Response Processing Error:", error);
    return NextResponse.redirect(
      `${APP_URL}/payment/failure?reason=server_error`,
      303
    );
  }
}

async function handleCourseEnrollment(
  userId: string,
  courseId: string,
  txnid: string,
  amount: number
) {
  try {
    const existing = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    if (existing) return;

    const course = await Course.findById(courseId);
    if (!course) return;

    const enrollment = await Enrollment.create({
      student: userId,
      course: courseId,
      enrolledAt: new Date(),
      // Store transaction details if schema allows
    });

    await Activity.create({
      student: userId,
      type: "course_enrolled",
      category: "course",
      relatedId: courseId,
      metadata: { courseName: course.title },
      date: new Date(),
    });

    // Email logic
    const user = await User.findById(userId);
    if (user) {
      const courseLink = `${APP_URL}/courses/${courseId}`;
      await sendEmail(
        user.email,
        `Enrolled in ${course.title}! 📚`,
        emailTemplates.courseEnrollment(
          user.firstName,
          course.title,
          courseLink
        )
      );

      // Check if invoice template exists or send generic
      // Assuming invoice logic is similar to enroll route
      await sendEmail(
        user.email,
        `Invoice - ${course.title}`,
        emailTemplates.invoice(
          user.firstName + " " + user.lastName,
          course.title,
          amount,
          txnid,
          new Date().toISOString(),
          "course"
        )
      );
    }
  } catch (e) {
    console.error("Course Enrollment Error:", e);
  }
}

async function handleInternshipApplication(
  userId: string,
  internshipId: string,
  txnid: string,
  amount: number
) {
  try {
    // Typically application is created beforehand? Or created here?
    // Assuming user applies > pays > application verified
    // We'll update an existing application or create new if not exists

    let application = await Application.findOne({
      student: userId,
      internship: internshipId,
    });

    if (!application) {
      // Create if didn't exist (edge case)
      application = await Application.create({
        student: userId,
        internship: internshipId,
        status: "pending", // Waiting admin approval? Or 'approved'/verified since paid?
        appliedAt: new Date(),
      });
    }

    // Logic to mark payment as verified/completed could be here
    // For now, we will create an activity
    const internship = await Internship.findById(internshipId);

    await Activity.create({
      student: userId,
      type: "internship_applied", // Or "payment_verified"
      category: "internship",
      relatedId: internshipId,
      metadata: { internshipTitle: internship?.title || "Internship" },
      date: new Date(),
    });

    // Send email...
  } catch (e) {
    console.error("Internship Handler Error:", e);
  }
}
