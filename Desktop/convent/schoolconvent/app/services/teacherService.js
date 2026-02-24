import Teacher from "../models/mongodb/Teacher";
import Student from "../models/mongodb/Student";

class TeacherService {
  // Get teacher profile
  async getProfile(teacherId) {
    return Teacher.findById(teacherId).populate("authId");
  }

  // Get teacher schedule
  async getSchedule(teacherId) {
    const teacher = await Teacher.findById(teacherId);
    return teacher?.schedule || [];
  }

  // Create new assignment
  async createAssignment(teacherId, assignmentData) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    teacher.assignments.push({
      ...assignmentData,
      createdAt: new Date(),
    });

    await teacher.save();
    return teacher.assignments[teacher.assignments.length - 1];
  }

  // Mark attendance
  async markAttendance(teacherId, attendanceData) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Update teacher's attendance record
    teacher.attendance.push({
      ...attendanceData,
      date: new Date(),
    });

    // Update students' attendance records
    for (const student of attendanceData.students) {
      await Student.findByIdAndUpdate(student.studentId, {
        $push: {
          attendance: {
            date: new Date(),
            status: student.status,
            subject: attendanceData.subject,
            teacherId: teacherId,
          },
        },
      });
    }

    await teacher.save();
    return teacher.attendance[teacher.attendance.length - 1];
  }

  // Create announcement
  async createAnnouncement(teacherId, announcementData) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    teacher.announcements.push({
      ...announcementData,
      date: new Date(),
    });

    await teacher.save();
    return teacher.announcements[teacher.announcements.length - 1];
  }
}

export default new TeacherService();
