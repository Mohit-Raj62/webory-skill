import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    subjects: [
      {
        type: String,
      },
    ],
    photoUrl: {
      type: String,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    schedule: [
      {
        class: String,
        subject: String,
        day: String,
        startTime: String,
        endTime: String,
        room: String,
        academicYear: String,
      },
    ],
    assignments: [
      {
        subject: String,
        title: String,
        description: String,
        dueDate: Date,
        totalStudents: Number,
        submissions: Number,
        status: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attendance: [
      {
        class: String,
        subject: String,
        date: Date,
        students: [
          {
            studentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
            },
            name: String,
            rollNo: String,
            status: Boolean,
          },
        ],
        totalPresent: Number,
        totalAbsent: Number,
      },
    ],
    announcements: [
      {
        title: String,
        message: String,
        date: Date,
        priority: String,
        targetClass: String,
        status: String,
      },
    ],
    results: [
      {
        class: String,
        subject: String,
        examType: String,
        examDate: Date,
        students: [
          {
            studentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Student",
            },
            name: String,
            rollNo: String,
            marks: Number,
            grade: String,
            remarks: String,
          },
        ],
        totalMarks: Number,
        passingMarks: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teacher", teacherSchema);
