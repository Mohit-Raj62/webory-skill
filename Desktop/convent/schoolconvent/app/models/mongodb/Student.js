import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
    class: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
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
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    parentInfo: {
      name: String,
      relation: String,
      phone: String,
      email: String,
    },
    academic: {
      currentClass: String,
      section: String,
      rollNo: String,
      admissionDate: Date,
      previousSchool: String,
      subjects: [String],
      classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    },
    attendance: [
      {
        date: Date,
        status: Boolean,
        subject: String,
        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
        remarks: String,
      },
    ],
    assignments: [
      {
        assignmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher.assignments",
        },
        subject: String,
        submissionDate: Date,
        status: String,
        marks: Number,
        feedback: String,
        attachments: [String],
      },
    ],
    results: [
      {
        examType: String,
        examDate: Date,
        subject: String,
        marks: Number,
        totalMarks: Number,
        grade: String,
        remarks: String,
      },
    ],
    fees: [
      {
        amount: Number,
        dueDate: Date,
        status: String,
        paymentDate: Date,
        paymentMethod: String,
        receiptNo: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", studentSchema);
