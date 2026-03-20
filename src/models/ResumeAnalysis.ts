import mongoose, { Schema, model, models } from "mongoose";

const ResumeAnalysisSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  foundKeywords: [String],
  missingKeywords: [String],
  formattingFeedback: [String],
  atsCompatibility: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ResumeAnalysis = models.ResumeAnalysis || model("ResumeAnalysis", ResumeAnalysisSchema);

export default ResumeAnalysis;
