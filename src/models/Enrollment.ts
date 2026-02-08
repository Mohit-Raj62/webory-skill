import mongoose, { Schema, model, models } from "mongoose";

const EnrollmentSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number,
    default: 0, // 0 to 100
  },
  completed: {
    type: Boolean,
    default: false,
  },
  watchedVideos: [
    {
      videoIndex: { type: Number, required: true },
      videoTitle: { type: String, required: true },
      watchedAt: { type: Date, default: Date.now },
      watchedPercentage: { type: Number, default: 0 },
    },
  ],
  notes: [
    {
      videoIndex: { type: Number, required: true },
      videoTitle: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  certificateEmailSent: {
    type: Boolean,
    default: false,
  },
  certificateId: {
    type: String,
    unique: true,
    sparse: true,
  },
  certificateKey: {
    type: String,
  },
  completedAt: {
    type: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Performance indexes for faster queries
EnrollmentSchema.index({ student: 1 }); // For user dashboard queries
EnrollmentSchema.index({ course: 1 }); // For course aggregations

const Enrollment = models.Enrollment || model("Enrollment", EnrollmentSchema);

export default Enrollment;
