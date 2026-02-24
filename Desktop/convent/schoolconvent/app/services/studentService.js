import Student from "../models/mongodb/Student";
import Teacher from "../models/mongodb/Teacher";

class StudentService {
  // Get student profile
  async getProfile(studentId) {
    return Student.findById(studentId)
      .populate("authId")
      .populate("academic.classTeacher");
  }

  // Get student attendance
  async getAttendance(studentId) {
    const student = await Student.findById(studentId).populate(
      "attendance.teacherId"
    );
    return student?.attendance || [];
  }

  // Get student assignments
  async getAssignments(studentId) {
    const student = await Student.findById(studentId).populate(
      "assignments.assignmentId"
    );
    return student?.assignments || [];
  }

  // Submit assignment
  async submitAssignment(studentId, assignmentId, submissionData) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    student.assignments.push({
      assignmentId,
      ...submissionData,
      submissionDate: new Date(),
    });

    // Update teacher's assignment submission count
    await Teacher.findOneAndUpdate(
      { "assignments._id": assignmentId },
      { $inc: { "assignments.$.submissions": 1 } }
    );

    await student.save();
    return student.assignments[student.assignments.length - 1];
  }

  // Get student results
  async getResults(studentId) {
    const student = await Student.findById(studentId);
    return student?.results || [];
  }

  // Get fee information
  async getFees(studentId) {
    const student = await Student.findById(studentId);
    return student?.fees || [];
  }
}

export default new StudentService();
