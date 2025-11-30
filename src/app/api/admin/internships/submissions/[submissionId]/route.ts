import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InternshipSubmission from "@/models/InternshipSubmission";
import InternshipTask from "@/models/InternshipTask";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT - Update submission status/grade
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    await dbConnect();
    const { submissionId } = await params;
    const { status, grade, comments } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submission = await InternshipSubmission.findByIdAndUpdate(
      submissionId,
      { status, grade, comments },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Check for certification eligibility
    if (status === "approved") {
      const task = await InternshipTask.findById(submission.task);
      if (task) {
        // Get all tasks for this internship
        const allTasks = await InternshipTask.find({
          internship: task.internship,
        });
        const totalTasks = allTasks.length;

        if (totalTasks > 0) {
          // Get all approved submissions for this student in this internship
          const approvedSubmissions = await InternshipSubmission.find({
            task: { $in: allTasks.map((t) => t._id) },
            student: submission.student,
            status: "approved",
          });

          const approvedCount = approvedSubmissions.length;
          const percentage = (approvedCount / totalTasks) * 100;

          // If >= 80% tasks approved, mark application as completed
          if (percentage >= 80) {
            const Application = (await import("@/models/Application")).default;
            const User = (await import("@/models/User")).default;
            const Internship = (await import("@/models/Internship")).default;
            const { sendEmail, emailTemplates } = await import("@/lib/mail");

            const application = await Application.findOne({
              internship: task.internship,
              student: submission.student,
              status: "accepted",
            });

            if (application) {
              // Generate Certificate ID
              const certificateId = `CERT-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 5)
                .toUpperCase()}`;

              application.status = "completed";
              application.completedAt = new Date();
              application.certificateId = certificateId;
              await application.save();

              // Send Certificate Email
              const user = await User.findById(submission.student);
              const internship = await Internship.findById(task.internship);

              if (user && internship) {
                const certificateLink = `${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/internships/applications/${application._id}/certificate`;

                await sendEmail(
                  user.email,
                  `Certificate Unlocked: ${internship.title} 🎓`,
                  emailTemplates.certificateUnlocked(
                    user.firstName,
                    internship.title,
                    certificateLink
                  )
                );
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
