import mongoose, { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  internship: {
    type: Schema.Types.ObjectId,
    ref: "Internship",
    required: true,
  },
  resume: {
    type: String,
    required: true, // URL to resume
  },
  resumeType: {
    type: String, // 'file' or 'link'
    enum: ["file", "link"],
    default: "file",
  },
  college: String,
  currentYear: String,
  startDate: Date,
  preferredDuration: String,
  referralCode: String,
  coverLetter: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "rejected",
      "interview_scheduled",
      "completed",
    ],
    default: "pending",
  },
  transactionId: {
    type: String,
  },
  amountPaid: {
    type: Number,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  offerDate: {
    type: Date,
  },
  // Offer Letter fields (set when application is accepted)
  offerStartDate: {
    type: Date,
  },
  offerDuration: {
    type: String, // e.g., "3 months", "6 months"
  },
  // Interview fields
  interviewDate: {
    type: Date,
  },
  interviewLink: {
    type: String,
  },
  interviewNotes: {
    type: String,
  },
  // Certificate fields
  completedAt: {
    type: Date,
  },
  certificateId: {
    type: String,
  },
  certificateKey: {
    type: String,
  },
});

const Application =
  models.Application || model("Application", ApplicationSchema);

export default Application;
