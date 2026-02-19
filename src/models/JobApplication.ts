import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  // Position is technically redundant with jobId but good for display if job is deleted
  position: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // Cloudinary URL or External Link
    required: true,
  },
  resumeType: {
    type: String, // 'file' or 'link'
    enum: ["file", "link"],
    default: "file",
  },
  linkedin: String,
  portfolio: String,
  currentSalary: String,
  expectedSalary: String,
  noticePeriod: String,
  whyHireYou: String,
  coverLetter: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "interview", "selected", "rejected"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

export const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplication", jobApplicationSchema);
