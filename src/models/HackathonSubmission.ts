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
  participationType: {
    type: String,
    enum: ["individual", "team"],
    default: "individual",
  },
  teamMemberDetails: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    role: { type: String, default: "" }, // e.g. "Frontend Dev", "Designer"
    college: { type: String, default: "" },
  }],
  projectName: {
    type: String,
    default: "",
  },
  projectDescription: {
    type: String,
    default: "",
  },
  githubUrl: {
    type: String,
    default: "",
  },
  demoUrl: {
    type: String,
    default: "",
  },
  techStack: [String],
  status: {
    type: String,
    enum: ["draft", "submitted", "reviewing", "shortlisted", "winner", "participated"],
    default: "draft",
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
  xpAwarded: {
    type: Number,
    default: 0, // Tracks XP given to prevent duplicates and enable rank change adjustments
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
