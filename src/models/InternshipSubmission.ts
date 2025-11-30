import mongoose, { Schema, model, models } from "mongoose";

const InternshipSubmissionSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "InternshipTask",
    required: true,
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  submissionUrl: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  grade: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const InternshipSubmission =
  models.InternshipSubmission ||
  model("InternshipSubmission", InternshipSubmissionSchema);

export default InternshipSubmission;
