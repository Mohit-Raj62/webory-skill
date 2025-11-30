import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log("📨 Sending email via Nodemailer...");
    console.log("Service: Gmail");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To:", to);

    const info = await transporter.sendMail({
      from: `"Skill Webory" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
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
      <p>Best Regards,<br/>Skill Webory Team</p>
    </div>
  `,
  interviewScheduled: (
    name: string,
    internshipTitle: string,
    date: string,
    link?: string
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #9333ea;">Interview Scheduled! 📅</h2>
      <p>Hi ${name},</p>
      <p>Great news! We have scheduled an interview for your <strong>${internshipTitle}</strong> application.</p>
      <p><strong>Date & Time:</strong> ${new Date(date).toLocaleString()}</p>
      ${
        link
          ? `<p><strong>Meeting Link:</strong> <a href="${link}">${link}</a></p>`
          : ""
      }
      <p>Please be ready 5 minutes before the scheduled time.</p>
      <p>Good Luck!<br/>Skill Webory Team</p>
    </div>
  `,
  applicationAccepted: (
    name: string,
    internshipTitle: string,
    offerLink: string
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #16a34a;">Congratulations! You're Hired! 🎉</h2>
      <p>Hi ${name},</p>
      <p>We are thrilled to offer you the <strong>${internshipTitle}</strong> internship at Skill Webory.</p>
      <p>You can view and download your Offer Letter from your dashboard.</p>
      <p><a href="${offerLink}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Offer Letter</a></p>
      <p>Welcome aboard!<br/>Skill Webory Team</p>
    </div>
  `,
  applicationRejected: (name: string, internshipTitle: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #dc2626;">Application Update</h2>
      <p>Hi ${name},</p>
      <p>Thank you for your interest in the <strong>${internshipTitle}</strong> internship.</p>
      <p>After careful review, we have decided not to proceed with your application at this time. We encourage you to apply for future openings.</p>
      <p>Best Wishes,<br/>Skill Webory Team</p>
    </div>
  `,
  passwordReset: (name: string, resetLink: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request 🔐</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password for your Skill Webory account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">Best Regards,<br/>Skill Webory Team</p>
    </div>
  `,
  welcomeSignup: (name: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to Skill Webory! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining <strong>Skill Webory</strong>! We're excited to have you on board.</p>
      <p>Here's what you can do now:</p>
      <ul style="line-height: 1.8;">
        <li>📚 Browse and enroll in courses</li>
        <li>💼 Apply for internships</li>
        <li>🎓 Earn certificates upon completion</li>
        <li>📝 Take quizzes and track your progress</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/courses" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Explore Courses</a>
      </div>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Happy Learning!<br/>Skill Webory Team</p>
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
      <p>Best Regards,<br/>Skill Webory Team</p>
    </div>
  `,
  quizCompleted: (
    name: string,
    courseTitle: string,
    score: number,
    totalQuestions: number,
    passed: boolean
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
          (score / totalQuestions) * 100
        )}%</p>
      </div>
      ${
        passed
          ? "<p>🎉 <strong>Congratulations!</strong> You passed the quiz. Keep up the great work!</p>"
          : "<p>Keep practicing! You can retake the quiz to improve your score.</p>"
      }
      <p>Best Regards,<br/>Skill Webory Team</p>
    </div>
  `,
  certificateUnlocked: (
    name: string,
    courseTitle: string,
    certificateLink: string
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
      <p>Congratulations once again!<br/>Skill Webory Team</p>
    </div>
  `,
  invoice: (
    name: string,
    itemTitle: string,
    amount: number,
    transactionId: string,
    date: string,
    itemType: "course" | "internship"
  ) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">INVOICE</h1>
        <p style="color: #666; margin: 5px 0;">Skill Webory</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Invoice To:</strong> ${name}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(
          date
        ).toLocaleDateString()}</p>
        <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #2563eb; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">
              <strong>${
                itemType === "course" ? "📚 Course" : "💼 Internship"
              }: ${itemTitle}</strong>
            </td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹${amount.toLocaleString()}</td>
          </tr>
          <tr style="background: #f8f9fa; font-weight: bold;">
            <td style="padding: 12px; border: 1px solid #ddd;">Total Amount</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">₹${amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div style="background: #e7f3ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #1e40af;">✅ Payment Successful</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Thank you for your payment. Your ${itemType} access has been activated.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px; margin: 5px 0;">This is an automated invoice from Skill Webory</p>
        <p style="color: #666; font-size: 12px; margin: 5px 0;">For any queries, contact us at support@skillwebory.com</p>
      </div>
    </div>
  `,
  loginOtp: (name: string, otp: string) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Login OTP 🔐</h2>
      <p>Hi ${name},</p>
      <p>You requested to login to your Skill Webory account. Use the OTP below to complete your login:</p>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
        <p style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
      </div>
      <p style="color: #666; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email and ensure your account is secure.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">Best Regards,<br/>Skill Webory Team</p>
    </div>
  `,
  adminPaymentNotification: (
    adminName: string,
    studentName: string,
    itemTitle: string,
    amount: number,
    transactionId: string,
    itemType: "course" | "internship"
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
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/admin/payments" style="background-color: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Payment</a>
      </div>
      
      <p>Please verify the screenshot and approve/reject the payment.</p>
      <p>Best Regards,<br/>Skill Webory System</p>
    </div>
  `,
};
