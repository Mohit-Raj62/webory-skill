import nodemailer from "nodemailer";
import { createInvoiceHTML } from "./invoiceTemplate";

const authUser = process.env.EMAIL_AUTH_USER || process.env.EMAIL_USER;

/**
 * Official Sender Email Addresses:
 * - NOREPLY (no-reply@weboryskills.in): Used for all 10 designated transactional & notification categories:
 *   1. Website & Accounts (Welcome, OTP, password reset)
 *   2. Internship & Recruitment (Application, selection, interview)
 *   3. Education & Learning (Course enrollment, assignments)
 *   4. Examination (Exam schedule, result)
 *   5. Certificates (Certificate issued, download)
 *   6. Payment & Finance (Payment receipt, invoice)
 *   7. Events & Workshops (Registration, event reminder)
 *   8. College & School (Partnership, training updates)
 *   9. Projects & Developer (Task assigned, project review)
 *   10. Other Digital Services (Feedback, support ticket, system alerts)
 *
 * - INFO (info@weboryskills.in): Used everywhere else:
 *   General inquiries, contact forms, partnerships, company contact & announcements.
 */
export const EMAIL_ADDRESSES = {
  NOREPLY: process.env.EMAIL_NOREPLY || "no-reply@weboryskills.in",
  INFO: process.env.EMAIL_INFO || "info@weboryskills.in",
  SUPPORT: process.env.EMAIL_SUPPORT || "support@weboryskills.in",
  CAREERS: process.env.EMAIL_CAREERS || "careers@weboryskills.in",
} as const;

export type EmailCategory =
  | "website_accounts"       // 1. Website & Accounts: Welcome, OTP, password reset
  | "internship_recruitment" // 2. Internship & Recruitment: Application, selection, interview
  | "education_learning"     // 3. Education & Learning: Course enrollment, assignments
  | "examination"            // 4. Examination: Exam schedule, result
  | "certificates"           // 5. Certificates: Certificate issued, download
  | "payment_finance"        // 6. Payment & Finance: Payment receipt, invoice
  | "events_workshops"       // 7. Events & Workshops: Registration, event reminder
  | "college_school"         // 8. College & School: Partnership, training updates
  | "projects_developer"     // 9. Projects & Developer: Task assigned, project review
  | "other_digital_services" // 10. Other Digital Services: System alerts, feedback
  | "support"                // Support Desk & Student Tickets -> support@weboryskills.in
  | "general";               // General inquiries, info & contact -> info@weboryskills.in

/**
 * Returns the appropriate sender email based on category.
 * Support tickets map strictly to support@weboryskills.in.
 * General inquiries map to info@weboryskills.in.
 * Automated notifications (Categories 1-10) map to no-reply@weboryskills.in.
 */
export function getSenderEmailForCategory(category?: EmailCategory): string {
  switch (category) {
    case "support":
      return EMAIL_ADDRESSES.SUPPORT;
    case "general":
      return EMAIL_ADDRESSES.INFO;
    case "website_accounts":
    case "internship_recruitment":
    case "education_learning":
    case "examination":
    case "certificates":
    case "payment_finance":
    case "events_workshops":
    case "college_school":
    case "projects_developer":
    case "other_digital_services":
      return EMAIL_ADDRESSES.NOREPLY;
    default:
      // Default sender for system/transactional emails is no-reply@weboryskills.in
      return EMAIL_ADDRESSES.NOREPLY;
  }
}

const defaultFrom = EMAIL_ADDRESSES.NOREPLY;

const transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 5,
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: authUser,
    pass: process.env.EMAIL_PASS,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
  replyTo?: string;
  from?: string;
  category?: EmailCategory;
}

export const sendEmail = async (
  toOrOptions: string | SendEmailOptions, 
  subject?: string, 
  html?: string,
  attachments?: any[],
  replyTo?: string,
  from?: string,
  category?: EmailCategory
): Promise<boolean> => {
  try {
    let to: string;
    let emailSubject: string;
    let emailHtml: string;
    let emailAttachments: any[] | undefined;
    let emailReplyTo: string | undefined;
    let explicitFrom: string | undefined;
    let emailCategory: EmailCategory | undefined;

    if (typeof toOrOptions === "string") {
      to = toOrOptions;
      emailSubject = subject || "";
      emailHtml = html || "";
      emailAttachments = attachments;
      emailReplyTo = replyTo;
      explicitFrom = from;
      emailCategory = category;
    } else {
      to = toOrOptions.to;
      emailSubject = toOrOptions.subject;
      emailHtml = toOrOptions.html;
      emailAttachments = toOrOptions.attachments;
      emailReplyTo = toOrOptions.replyTo;
      explicitFrom = toOrOptions.from;
      emailCategory = toOrOptions.category;
    }

    // Determine sender address:
    // 1. Explicitly passed 'from' takes top precedence
    // 2. Category resolution: categories 1-10 -> no-reply@weboryskills.in; 'general' -> info@weboryskills.in
    // 3. Fallback: default NOREPLY (no-reply@weboryskills.in)
    const fromAddress = explicitFrom || getSenderEmailForCategory(emailCategory);

    // For no-reply sender, default replyTo to no-reply@weboryskills.in unless a specific replyTo was provided
    const finalReplyTo = emailReplyTo || fromAddress;

    console.log("📨 Sending email via Nodemailer...");
    console.log("Host:", process.env.EMAIL_HOST || "smtp.gmail.com");
    console.log("Authenticated User:", authUser ? authUser.replace(/(.{3})(.*)(@.*)/, "$1***$3") : "None");
    console.log("From (Display):", fromAddress);
    console.log("To:", to);
    if (finalReplyTo) console.log("Reply-To:", finalReplyTo);

    const info = await transporter.sendMail({
      from: `"Webory Skills" <${fromAddress}>`,
      replyTo: finalReplyTo,
      to,
      subject: emailSubject,
      html: emailHtml,
      attachments: emailAttachments,
    });

    console.log("✅ Message sent successfully!");
    console.log("Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error(error);

    // More specific error messages
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if ("code" in error) {
        console.error("Error code:", (error as any).code);
      }
    }

    return false;
  }
};

export const emailTemplates = {
  applicationReceived: (name: string, internshipTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">Application Received! 🚀</h2>
      <p>Hi ${name},</p>
      <p>We have received your application for the <strong>${internshipTitle}</strong> internship.</p>
      <p>Our team will review your profile and get back to you shortly.</p>
      <p>Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  interviewScheduled: (
    name: string,
    internshipTitle: string,
    date?: string | Date,
    link?: string,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #9333ea;">Interview Scheduled! 📅</h2>
      <p>Hi ${name},</p>
      <p>Great news! We have scheduled an interview for your <strong>${internshipTitle}</strong> application.</p>
      ${
        date
          ? `<p><strong>Date & Time:</strong> ${new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} ${new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>`
          : `<p>We will communicate the exact Date & Time shortly.</p>`
      }
      ${
        link
          ? `<p><strong>Meeting Link:</strong> <a href="${link}">${link}</a></p>`
          : ""
      }
      <p>Please be ready 5 minutes before the scheduled time.</p>
      <p>Good Luck!<br/>Webory Skills Team</p>
    </div>
  `,
  applicationAccepted: (
    name: string,
    internshipTitle: string,
    offerLink: string,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #16a34a;">Congratulations! You're Hired! 🎉</h2>
      <p>Hi ${name},</p>
      <p>We are thrilled to offer you the <strong>${internshipTitle}</strong> internship at Webory Skills.</p>
      <p>You can view and download your Offer Letter from your dashboard.</p>
      <p><a href="${offerLink}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Offer Letter</a></p>
      <p>Welcome aboard!<br/>Webory Skills Team</p>
    </div>
  `,
  applicationRejected: (name: string, internshipTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #dc2626;">Application Update</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your interest in the <strong>${internshipTitle}</strong> internship.</p>
      <p>After careful review, we have decided not to proceed with your application at this time. We encourage you to apply for future openings.</p>
      <p>Best Wishes,<br/>Webory Skills Team</p>
    </div>
  `,
  applicationPending: (name: string, internshipTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">Application Status: Pending ⏳</h2>
      <p>Hi ${name},</p>
      <p>Your application for the <strong>${internshipTitle}</strong> internship is currently <strong>Pending</strong>.</p>
      <p>Our team will review it shortly. We will notify you once there is an update.</p>
      <p>Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  applicationInterviewPending: (name: string, internshipTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #f59e0b;">Application Status: In Review 🔍</h2>
      <p>Hi ${name},</p>
      <p>Your application for the <strong>${internshipTitle}</strong> internship is currently <strong>In Review (Interview Pending)</strong>.</p>
      <p>We are evaluating your profile and will update you soon regarding the next steps.</p>
      <p>Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  passwordReset: (name: string, resetLink: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request 🔐</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password for your Webory Skills account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  welcomeSignup: (name: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to Webory Skills! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining <strong>Webory Skills</strong>! We're excited to have you on board.</p>
      <p>Here's what you can do now:</p>
      <ul style="line-height: 1.8;">
        <li>📚 Browse and enroll in courses</li>
        <li>💼 Apply for internships</li>
        <li>🎓 Earn certificates upon completion</li>
        <li>📝 Take quizzes and track your progress</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
        }/courses" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Explore Courses</a>
      </div>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Happy Learning!<br/>Webory Skills Team</p>
    </div>
  `,
  courseEnrollment: (name: string, courseTitle: string, courseLink: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Course Enrollment Successful! 📚</h2>
      <p>Hi ${name},</p>
      <p>You have successfully enrolled in <strong>${courseTitle}</strong>!</p>
      <p>You can now access all course materials, videos, and resources.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${courseLink}" style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Start Learning</a>
      </div>
      <p><strong>What's included:</strong></p>
      <ul style="line-height: 1.8;">
        <li>📹 Video lectures</li>
        <li>📝 Notes and resources</li>
        <li>❓ Doubt support</li>
        <li>🎯 Quizzes and assignments</li>
        <li>🎓 Certificate upon completion</li>
      </ul>
      <p>Best of luck with your learning journey!</p>
      <p>Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  quizCompleted: (
    name: string,
    courseTitle: string,
    score: number,
    totalQuestions: number,
    passed: boolean,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${passed ? "#16a34a" : "#f59e0b"};">Quiz ${
        passed ? "Passed" : "Completed"
      }! ${passed ? "🎉" : "📊"}</h2>
      <p>Hi ${name},</p>
      <p>You have completed the quiz for <strong>${courseTitle}</strong>.</p>
      <div style="background: ${
        passed ? "#f0fdf4" : "#fef3c7"
      }; border-left: 4px solid ${
        passed ? "#16a34a" : "#f59e0b"
      }; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-size: 18px;"><strong>Your Score: ${score}/${totalQuestions}</strong></p>
        <p style="margin: 5px 0 0 0; color: #666;">Percentage: ${Math.round(
          (score / totalQuestions) * 100,
        )}%</p>
      </div>
      ${
        passed
          ? "<p>🎉 <strong>Congratulations!</strong> You passed the quiz. Keep up the great work!</p>"
          : "<p>Keep practicing! You can retake the quiz to improve your score.</p>"
      }
      <p>Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  certificateUnlocked: (
    name: string,
    courseTitle: string,
    certificateLink: string,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #9333ea;">Certificate Unlocked! 🎓</h2>
      <p>Hi ${name},</p>
      <p>Congratulations! You have successfully completed <strong>${courseTitle}</strong> and earned your certificate!</p>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
        <p style="color: white; font-size: 24px; margin: 0; font-weight: bold;">🏆</p>
        <p style="color: white; font-size: 18px; margin: 10px 0;">Certificate of Completion</p>
        <p style="color: rgba(255,255,255,0.9); margin: 0;">${courseTitle}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${certificateLink}" style="background-color: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Download Certificate</a>
      </div>
      <p>Share your achievement with friends and on social media!</p>
      <p>Congratulations once again!<br/>Webory Skills Team</p>
    </div>
  `,
  invoice: (
    name: string,
    itemTitle: string,
    amount: number,
    transactionId: string,
    date: string,
    itemType: "course" | "internship",
    originalAmount?: number,
    userPhone?: string,
    couponCode?: string,
    couponDiscount?: number,
  ) =>
    createInvoiceHTML(name, itemTitle, amount, transactionId, date, itemType, originalAmount, userPhone, couponCode, couponDiscount),
  loginOtp: (name: string, otp: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Login OTP 🔐</h2>
      <p>Hi ${name},</p>
      <p>You requested to login to your Webory Skills account. Use the OTP below to complete your login:</p>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
        <p style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
      </div>
      <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email and ensure your account is secure.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  adminPaymentNotification: (
    adminName: string,
    studentName: string,
    itemTitle: string,
    amount: number,
    transactionId: string,
    itemType: "course" | "internship",
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ea580c;">New Payment Received! 💰</h2>
      <p>Hi ${adminName},</p>
      <p>A new payment proof has been submitted for verification.</p>
      
      <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Student:</strong> ${studentName}</p>
        <p style="margin: 5px 0;"><strong>${
          itemType === "course" ? "📚 Course" : "💼 Internship"
        }:</strong> ${itemTitle}</p>
        <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${amount.toLocaleString()}</p>
        <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
        }/admin/payments" style="background-color: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Payment</a>
      </div>
      
      <p>Please verify the screenshot and approve/reject the payment.</p>
      <p>Best Regards,<br/>Webory Skills System</p>
    </div>
  `,
  contactFormSubmission: (
    name: string,
    email: string,
    subject: string,
    message: string,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Contact Form Submission 📬</h2>
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; color: #475569;">${message}</p>
      </div>
      <p style="color: #64748b; font-size: 12px; text-align: center;">Received via Webory Skills Contact Form<br>${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
    </div>
  `,
  jobApplicationReceived: (name: string, jobTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">Application Received! 🚀</h2>
      <p>Hi ${name},</p>
      <p>We have received your application for the <strong>${jobTitle}</strong> position.</p>
      <p>Our team will review your profile and get back to you shortly.</p>
      <p>Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  jobInterviewScheduled: (
    name: string,
    jobTitle: string,
    date: string,
    link?: string,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #9333ea;">Interview Scheduled! 📅</h2>
      <p>Hi ${name},</p>
      <p>Great news! We have scheduled an interview for your <strong>${jobTitle}</strong> application.</p>
      <p><strong>Date & Time:</strong> ${new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} ${new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      ${
        link
          ? `<p><strong>Meeting Link:</strong> <a href="${link}">${link}</a></p>`
          : ""
      }
      <p>Please be ready 5 minutes before the scheduled time.</p>
      <p>Good Luck!<br/>Webory Skills Team</p>
    </div>
  `,
  jobOffer: (name: string, jobTitle: string, offerLink: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #16a34a;">Congratulations! You're Hired! 🎉</h2>
      <p>Hi ${name},</p>
      <p>We are thrilled to offer you the position of <strong>${jobTitle}</strong> at Webory Skills.</p>
      <p>You can view and download your Offer Letter from the link below:</p>
      <p><a href="${offerLink}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Offer Letter</a></p>
      <p>Welcome aboard!<br/>Webory Skills Team</p>
    </div>
  `,
  jobRejection: (name: string, jobTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #dc2626;">Application Update</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your interest in the <strong>${jobTitle}</strong> position.</p>
      <p>After careful review, we have decided not to proceed with your application at this time. We encourage you to apply for future openings.</p>
      <p>Best Wishes,<br/>Webory Skills Team</p>
    </div>
  `,
  adminJobApplicationNotification: (
    applicantName: string,
    jobTitle: string,
    email: string,
    phone: string,
    resumeLink: string,
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ea580c;">New Job Application Received! 📄</h2>
      <p>Hi Admin,</p>
      <p>A new candidate has applied for the <strong>${jobTitle}</strong> position.</p>
      
      <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 15px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Name:</strong> ${applicantName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
        <p style="margin: 5px 0;"><strong>Position:</strong> ${jobTitle}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resumeLink}" style="background-color: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Resume</a>
      </div>
      
      <p>Please review the application in the Admin Dashboard.</p>
      <p>Best Regards,<br/>Webory Skills System</p>
    </div>
  `,
  hackathonCertificate: (
    name: string,
    hackathonTitle: string,
    certificateLink: string,
    type: "winner" | "participant"
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ea580c;">${type === "winner" ? "Hackathon Winner! 🏆" : "Certificate of Participation! 🎓"}</h2>
      <p>Hi ${name},</p>
      <p>Congratulations on your ${type === "winner" ? "outstanding performance" : "active participation"} in <strong>${hackathonTitle}</strong>!</p>
      
      <div style="background: linear-gradient(135deg, #ea580c 0%, #ff9933 100%); padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; box-shadow: 0 10px 20px rgba(234, 88, 12, 0.2);">
        <p style="color: white; font-size: 40px; margin: 0;">🏅</p>
        <p style="color: white; font-size: 20px; font-weight: bold; margin: 10px 0;">Hackathon Certificate</p>
        <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">${hackathonTitle}</p>
      </div>

      <p>You can view and download your certificate using the link below. No login is required to view this link.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${certificateLink}" style="background-color: #ea580c; color: white; padding: 14px 35px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">View My Certificate</a>
      </div>

      <p style="color: #666; font-size: 14px; line-height: 1.6;">
        Share your achievement on LinkedIn and tag <strong>Webory Skills</strong> to celebrate your success with the community!
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  supportTicketCreated: (name: string, ticketId: string, category: string, subject: string) => `
    <div style="font-family: Arial, sans-serif; padding: 25px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0; font-size: 22px;">Support Ticket Received 🎫</h2>
        <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0;">Webory Skills Student Support Desk</p>
      </div>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your support request has been logged successfully. Our student support team will review your ticket and respond within <strong>4 to 6 business hours</strong>.</p>
      <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;"><strong>Ticket Reference ID:</strong></p>
        <p style="margin: 0; font-size: 20px; font-weight: bold; color: #1e40af; font-family: monospace;">${ticketId}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;">
        <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Category:</strong> ${category.toUpperCase()}</p>
        <p style="margin: 0; font-size: 13px;"><strong>Subject:</strong> ${subject}</p>
      </div>
      <p style="font-size: 13px; color: #475569;">You can reply directly to this email or quote your Ticket ID if you have any additional details to add.</p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 25px 0 15px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Webory Skills Help Desk • <a href="mailto:support@weboryskills.in" style="color: #3b82f6;">support@weboryskills.in</a></p>
    </div>
  `,
  adminSupportTicketNotification: (
    ticketId: string, 
    name: string, 
    email: string, 
    phone: string, 
    category: string, 
    subject: string, 
    message: string,
    attachments: Array<{ url: string; name?: string; fileType?: string; size?: number; isImage?: boolean }> = []
  ) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 25px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 16px;">
        <h3 style="color: #047857; margin: 0; font-size: 18px; font-weight: 700;">Support Ticket — ${ticketId}</h3>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Category: <strong>${category.toUpperCase()}</strong> • Reference ID: <strong>${ticketId}</strong></p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Student:</strong> ${name}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></p>
        ${phone ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> ${phone}</p>` : ''}
        <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> ${subject}</p>
      </div>

      <div style="background: #ffffff; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 6px; margin-bottom: 16px; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase;">Inquiry Description:</p>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${message}</p>
      </div>

      ${attachments && attachments.length > 0 ? `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #047857; font-weight: bold; text-transform: uppercase;">
          📎 Attached Files & Screenshots (${attachments.length}):
        </p>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${attachments.map((att, i) => `
            <div style="font-size: 13px; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
              ${att.isImage ? '🖼️' : '📄'} 
              <a href="${att.url}" target="_blank" rel="noopener noreferrer" style="color: #047857; font-weight: 600; text-decoration: underline; margin-left: 4px;">
                ${att.name || `Attachment ${i + 1}`}
              </a>
              ${att.size ? `<span style="color: #94a3b8; font-size: 11px; margin-left: 6px;">(${(att.size / 1024).toFixed(0)} KB)</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      </div>

      <div style="background: #f8fafc; border: 1px dashed #10b981; padding: 12px; border-radius: 8px; text-align: center; margin: 16px 0;">
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">Reply directly to student without any quoted email history:</p>
        <a href="mailto:${email}?subject=Re:%20[${ticketId}]%20${encodeURIComponent(subject)}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 7px 16px; border-radius: 6px; font-size: 12px; font-weight: bold;">
          ✉️ Compose Clean Reply to ${name}
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 16px 0 12px 0;">
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">
        Webory Skills Support Desk • <a href="mailto:support@weboryskills.in" style="color: #10b981; text-decoration: none;">support@weboryskills.in</a>
      </p>
    </div>
  `,
  supportTicketResolved: (name: string, ticketId: string, subject: string, adminNotes?: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Support Ticket Resolved - Webory Skills</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              
              <!-- Brand Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #05080e 0%, #09121d 100%); padding: 24px 28px; border-bottom: 2px solid #10b981;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                          Webory <span style="color: #34d399;">Skills</span>
                        </span>
                        <p style="margin: 3px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Ticket Resolution Confirmation
                        </p>
                      </td>
                      <td align="right">
                        <span style="display: inline-block; background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; font-family: monospace; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 9999px;">
                          ✓ RESOLVED
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 28px 28px 20px 28px;">
                  <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: 600; color: #0f172a;">
                    Hello ${name},
                  </p>

                  <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                    Great news! Your support ticket <strong>${ticketId}</strong> has been marked as <strong>Resolved</strong> by our student resolution team.
                  </p>

                  ${adminNotes ? `
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #10b981; border-radius: 10px; padding: 16px 20px; margin-bottom: 22px;">
                      <div style="font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                        ✦ Resolution Summary:
                      </div>
                      <div style="font-size: 14px; line-height: 1.6; color: #166534; white-space: pre-wrap;">
                        ${adminNotes}
                      </div>
                    </div>
                  ` : ''}

                  <!-- Ticket Context Reference -->
                  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 22px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12px;">
                      <tr>
                        <td style="color: #64748b; font-weight: 600; width: 90px;">Subject:</td>
                        <td style="color: #1e293b; font-weight: 600;">${subject}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; padding-top: 5px;">Reference ID:</td>
                        <td style="color: #047857; font-family: monospace; font-weight: 700; padding-top: 5px;">${ticketId}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                    If your issue persists or you need further clarification, simply <strong>reply directly to this email</strong> to reopen your case.
                  </p>

                  <div style="text-align: center; margin: 20px 0;">
                    <a href="https://www.weboryskills.in/support" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                      Track Ticket on Support Portal →
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 18px 28px; text-align: center;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: 700; color: #334155;">
                    Webory Skills Help Desk
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    Official Support: <a href="mailto:support@weboryskills.in" style="color: #10b981; text-decoration: none;">support@weboryskills.in</a> • <a href="https://weboryskills.in" style="color: #10b981; text-decoration: none;">weboryskills.in</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  supportStaffReply: (name: string, ticketId: string, subject: string, message: string) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Webory Skills Support Response</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              
              <!-- Brand Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #05080e 0%, #09121d 100%); padding: 24px 28px; border-bottom: 2px solid #10b981;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                          Webory <span style="color: #34d399;">Skills</span>
                        </span>
                        <p style="margin: 3px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                          Official Support Desk
                        </p>
                      </td>
                      <td align="right">
                        <span style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-family: monospace; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 9999px;">
                          ${ticketId}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 28px 28px 20px 28px;">
                  
                  <!-- Greeting -->
                  <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: 600; color: #0f172a;">
                    Hello ${name},
                  </p>

                  <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.5; color: #475569;">
                    Our student support specialist has reviewed your inquiry and shared the following update regarding your ticket:
                  </p>

                  <!-- Official Response Card -->
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 10px; padding: 18px 20px; margin-bottom: 22px;">
                    <div style="font-size: 11px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">
                      ✦ Official Response from Support Desk:
                    </div>
                    <div style="font-size: 14px; line-height: 1.7; color: #1e293b; white-space: pre-wrap; word-break: break-word;">${message}</div>
                  </div>

                  <!-- Ticket Context Reference (Clean & Subtle) -->
                  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 22px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 12px;">
                      <tr>
                        <td style="color: #64748b; font-weight: 600; width: 90px;">Subject:</td>
                        <td style="color: #1e293b; font-weight: 600;">${subject}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600; padding-top: 5px;">Reference ID:</td>
                        <td style="color: #047857; font-family: monospace; font-weight: 700; padding-top: 5px;">${ticketId}</td>
                      </tr>
                    </table>
                  </div>

                  <!-- Help & Follow up -->
                  <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                    If you have any further questions or follow-up details to share, simply <strong>reply directly to this email</strong>.
                  </p>

                  <div style="text-align: center; margin: 20px 0;">
                    <a href="https://www.weboryskills.in/support" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                      Track Ticket on Support Portal →
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 18px 28px; text-align: center;">
                  <p style="margin: 0 0 5px 0; font-size: 12px; font-weight: 700; color: #334155;">
                    Webory Skills Resolution & Operations Desk
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                    Registered MSME: UDYAM-BR-26-0208472 • Patna, Bihar, India<br>
                    Official Support: <a href="mailto:support@weboryskills.in" style="color: #10b981; text-decoration: none;">support@weboryskills.in</a> • <a href="https://weboryskills.in" style="color: #10b981; text-decoration: none;">weboryskills.in</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  feedbackRequest: (name: string, feedbackLink: string, source: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">We'd Love Your Feedback! 🌟</h2>
      <p>Hi ${name},</p>
      <p>Thank you for participating in the <strong>${source}</strong> process at Webory Skills.</p>
      <p>We are constantly looking to improve and provide the best experience for our community. Could you take a moment to share your feedback with us?</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${feedbackLink}" style="background-color: #2563eb; color: white; padding: 14px 35px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Leave a Review</a>
      </div>

      <p style="color: #666; font-size: 14px; line-height: 1.6;">
        It only takes a minute, and your insights help us grow!
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Team</p>
    </div>
  `,
  // Category 7: Events & Workshops
  eventRegistration: (name: string, eventTitle: string, eventDate: string, eventLink?: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Registration Confirmed! 🎟️</h2>
      <p>Hi ${name},</p>
      <p>You have successfully registered for <strong>${eventTitle}</strong>.</p>
      <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0;"><strong>Event:</strong> ${eventTitle}</p>
        <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${eventDate}</p>
      </div>
      ${eventLink ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${eventLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Event Details</a>
      </div>` : ""}
      <p style="color: #666; font-size: 13px;">This is an automated event notification from no-reply@weboryskills.in.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Events Team</p>
    </div>
  `,
  eventReminder: (name: string, eventTitle: string, eventDate: string, eventLink?: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Event Reminder ⏰</h2>
      <p>Hi ${name},</p>
      <p>This is a quick reminder that your registered event <strong>${eventTitle}</strong> is coming up soon!</p>
      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0;"><strong>Event:</strong> ${eventTitle}</p>
        <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${eventDate}</p>
      </div>
      ${eventLink ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${eventLink}" style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Join / View Event</a>
      </div>` : ""}
      <p style="color: #666; font-size: 13px;">Please be ready 10 minutes prior to the scheduled start.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Events Team</p>
    </div>
  `,
  // Category 8: College & School
  campusPartnershipUpdate: (institutionName: string, contactPerson: string, updateTitle: string, updateDetails: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f766e;">Campus Partnership Update 🏫</h2>
      <p>Dear ${contactPerson},</p>
      <p>We are writing to share an important institutional update regarding <strong>${institutionName}</strong>'s partnership with Webory Skills.</p>
      <div style="background: #f0fdfa; border-left: 4px solid #0f766e; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0; font-size: 15px; font-weight: bold; color: #0f766e;">${updateTitle}</p>
        <p style="margin: 8px 0 0 0; color: #334155; line-height: 1.6;">${updateDetails}</p>
      </div>
      <p style="color: #64748b; font-size: 13px;">For any queries regarding this update, our institutional desk is reachable at <a href="mailto:info@weboryskills.in" style="color: #0f766e;">info@weboryskills.in</a>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Academic Partnerships</p>
    </div>
  `,
  trainingUpdate: (name: string, programTitle: string, updateMessage: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Training Program Update 📢</h2>
      <p>Hi ${name},</p>
      <p>An announcement has been published for your training cohort in <strong>${programTitle}</strong>.</p>
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; color: #334155; line-height: 1.6;">${updateMessage}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Training Directorate</p>
    </div>
  `,
  // Category 9: Projects & Developer
  projectTaskAssigned: (name: string, projectTitle: string, taskTitle: string, dueDate: string, taskLink?: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">New Project Task Assigned 💻</h2>
      <p>Hi ${name},</p>
      <p>You have been assigned a new task in <strong>${projectTitle}</strong>.</p>
      <div style="background: #f5f3ff; border-left: 4px solid #7c3aed; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0;"><strong>Project:</strong> ${projectTitle}</p>
        <p style="margin: 4px 0;"><strong>Task:</strong> ${taskTitle}</p>
        <p style="margin: 4px 0;"><strong>Deadline:</strong> ${dueDate}</p>
      </div>
      ${taskLink ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${taskLink}" style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Task in Workspace</a>
      </div>` : ""}
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills DevLab Team</p>
    </div>
  `,
  projectReviewUpdate: (name: string, projectTitle: string, reviewStatus: string, reviewerNotes: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Project Code Review Update 🔍</h2>
      <p>Hi ${name},</p>
      <p>Your project submission for <strong>${projectTitle}</strong> has been reviewed.</p>
      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 4px 0;"><strong>Status:</strong> ${reviewStatus}</p>
        <p style="margin: 4px 0;"><strong>Reviewer Feedback:</strong></p>
        <p style="margin: 8px 0 0 0; color: #475569; line-height: 1.6; white-space: pre-wrap;">${reviewerNotes}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Best Regards,<br/>Webory Skills Technical Review Team</p>
    </div>
  `,
};
