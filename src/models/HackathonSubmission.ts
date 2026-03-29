import mongoose, { Schema, model, models } from "mongoose";

const SubmissionSchema = new Schema({
  hackathonId: {
    type: Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamName: {
    type: String,
    default: "",
  },
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    default: "",
  },
  techStack: [String],
  status: {
    type: String,
    enum: ["submitted", "reviewing", "shortlisted", "winner", "participated"],
    default: "submitted",
  },
  score: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0, // 1 for 1st, 2 for 2nd, etc. 0 means no rank yet
  },
  adminFeedback: {
    type: String,
    default: "",
  },
  certificateId: {
    type: Schema.Types.ObjectId,
    ref: "CustomCertificate",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HackathonSubmission =
  models.HackathonSubmission ||
  model("HackathonSubmission", SubmissionSchema);

export default HackathonSubmission;
