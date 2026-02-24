import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentStrength: {
      type: Number,
      default: 0,
    },
    schedule: [
      {
        day: String,
        periods: [
          {
            periodNo: Number,
            startTime: String,
            endTime: String,
            subject: String,
            teacherId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Teacher",
            },
            roomNo: String,
          },
        ],
      },
    ],
    subjects: [
      {
        name: String,
        code: String,
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
        credits: Number,
        description: String,
        syllabus: String,
      },
    ],
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        rollNo: String,
        name: String,
        admissionDate: Date,
        status: String,
      },
    ],
    events: [
      {
        title: String,
        description: String,
        date: Date,
        type: String,
        status: String,
      },
    ],
    announcements: [
      {
        title: String,
        message: String,
        date: Date,
        priority: String,
        status: String,
      },
    ],
    performance: [
      {
        examType: String,
        examDate: Date,
        subject: String,
        averageMarks: Number,
        highestMarks: Number,
        lowestMarks: Number,
        passPercentage: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Class", classSchema);
