import nodemailer from "nodemailer";
import { createInvoiceHTML } from "./invoiceTemplate";

const authUser = process.env.EMAIL_AUTH_USER || process.env.EMAIL_USER;
const defaultFrom = process.env.EMAIL_FROM || "info@weboryskills.in";

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

export const sendEmail = async (
  to: string, 
  subject: string, 
  html: string,
  attachments?: any[],
  replyTo?: string
) => {
  try {
    const fromAddress = process.env.EMAIL_FROM || "info@weboryskills.in";
    console.log("📨 Sending email via Nodemailer...");
    console.log("Host:", process.env.EMAIL_HOST || "smtp.gmail.com");
    console.log("Authenticated User:", authUser ? authUser.replace(/(.{3})(.*)(@.*)/, "$1***$3") : "None");
    console.log("From (Display):", fromAddress);
    console.log("To:", to);
    if (replyTo) console.log("Reply-To:", replyTo);

    const info = await transporter.sendMail({
      from: `"Webory Skills" <${fromAddress}>`,
      replyTo: replyTo || fromAddress,
      to,
      subject,
      html,
      attachments,
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
  adminSupportTicketNotification: (ticketId: string, name: string, email: string, phone: string, category: string, subject: string, message: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.weboryskills.in";
    const adminSupportUrl = `${siteUrl}/admin/support?ticketId=${encodeURIComponent(ticketId)}`;
    const quickResolveUrl = `${siteUrl}/api/support/ticket/action?ticketId=${encodeURIComponent(ticketId)}&action=resolve`;

    return `
    <div style="font-family: Arial, sans-serif; padding: 25px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #fed7aa; border-radius: 12px; background: #fffaf5;">
      <div style="border-bottom: 2px solid #ea580c; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #c2410c; margin: 0; font-size: 22px;">⚡ New Support Ticket Alert</h2>
        <p style="color: #9a3412; font-size: 13px; margin: 5px 0 0 0;">Ticket ID: <strong>${ticketId}</strong> • Category: ${category.toUpperCase()}</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #ffedd5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Student Name:</strong> ${name}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> ${subject}</p>
      </div>
      <div style="background: #ffffff; border-left: 4px solid #ea580c; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Issue Description:</p>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.5; color: #334155;">${message}</p>
      </div>

      <!-- Quick Action Buttons for Admin -->
      <div style="background: #ffffff; border: 1px dashed #fb923c; padding: 16px; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #9a3412; text-transform: uppercase;">⚡ Quick Admin Actions</p>
        <div style="margin-bottom: 8px;">
          <a href="${adminSupportUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 9px 18px; border-radius: 6px; font-size: 12px; font-weight: bold; margin: 4px;">Open in Admin Desk</a>
          <a href="${quickResolveUrl}" style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 9px 18px; border-radius: 6px; font-size: 12px; font-weight: bold; margin: 4px;">Mark as Resolved ✓</a>
        </div>
        <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b;">(Or hit <strong>Reply</strong> to email ${name} directly at ${email})</p>
      </div>

      <p style="font-size: 11px; color: #94a3b8; margin-top: 15px; text-align: center;">Webory Skills Operations • SLA: 4-6 hours</p>
    </div>
  `;
  },
  supportTicketResolved: (name: string, ticketId: string, subject: string, adminNotes?: string) => `
    <div style="font-family: Arial, sans-serif; padding: 25px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #bbf7d0; border-radius: 12px; background: #ffffff;">
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #047857; margin: 0; font-size: 22px;">Support Ticket Resolved! 🎉</h2>
        <p style="color: #065f46; font-size: 13px; margin: 5px 0 0 0;">Webory Skills Student Support Desk</p>
      </div>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Great news! Your support ticket <strong>${ticketId}</strong> regarding <em>"${subject}"</em> has been marked as <strong>Resolved</strong>.</p>
      
      ${adminNotes ? `
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #047857; font-weight: bold; text-transform: uppercase;">Resolution Note from Support Team:</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1f2937;">${adminNotes}</p>
        </div>
      ` : ''}

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">You can verify your live ticket resolution status anytime on our portal:</p>
        <a href="https://www.weboryskills.in/support" style="display: inline-block; background: #10b981; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">Track Ticket on Portal</a>
      </div>

      <p style="font-size: 13px; color: #64748b;">If your issue still persists or you need further clarification, simply reply to this email or quote your Ticket ID <strong>${ticketId}</strong>.</p>
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 25px 0 15px 0;">
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">Webory Skills Help Desk • <a href="mailto:support@weboryskills.in" style="color: #3b82f6;">support@weboryskills.in</a></p>
    </div>
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
};
