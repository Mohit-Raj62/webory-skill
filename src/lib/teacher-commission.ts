import Course from "@/models/Course";
import User from "@/models/User";

/**
 * Automatically credits a teacher's walletBalance when a student purchases their course.
 * Never throws so that enrollment/payment flows are never disrupted if commission processing fails.
 */
export async function creditTeacherCommission(
  courseId: string,
  amountPaid: number
): Promise<{ credited: boolean; teacherShare?: number; teacherId?: string }> {
  try {
    if (!courseId || !amountPaid || amountPaid <= 0) {
      return { credited: false };
    }

    const course = await Course.findById(courseId).select("instructor title").lean();
    if (!course || !course.instructor) {
      return { credited: false };
    }

    const teacher = await User.findById(course.instructor).select(
      "role teacherProfile firstName lastName"
    );

    if (!teacher) {
      return { credited: false };
    }

    // Default commission rate is 70% if not explicitly configured by Superadmin
    const commissionRate = teacher.teacherProfile?.commissionRate ?? 70;
    if (commissionRate <= 0) {
      return { credited: false };
    }

    const teacherShare = Math.round((amountPaid * commissionRate) / 100);
    if (teacherShare <= 0) {
      return { credited: false };
    }

    await User.findByIdAndUpdate(teacher._id, {
      $inc: { "teacherProfile.walletBalance": teacherShare },
    });

    console.log(
      `Teacher Commission Credited: ₹${teacherShare} (${commissionRate}% of ₹${amountPaid}) -> ${teacher.firstName} ${teacher.lastName} for "${course.title}"`
    );

    return {
      credited: true,
      teacherShare,
      teacherId: teacher._id.toString(),
    };
  } catch (err) {
    console.error("Failed to credit teacher commission:", err);
    return { credited: false };
  }
}

