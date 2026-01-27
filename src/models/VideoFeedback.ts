import mongoose, { Schema, model, models } from "mongoose";

const VideoFeedbackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  videoIndex: {
    type: Number,
    required: true,
  },
  isLiked: {
    type: Boolean, // true = like, false = dislike, null/undefined = no action
    default: null,
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
VideoFeedbackSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Compound index just to be safe, though logic will handle upsert
VideoFeedbackSchema.index(
  { user: 1, courseId: 1, videoIndex: 1 },
  { unique: true },
);

const VideoFeedback =
  models.VideoFeedback || model("VideoFeedback", VideoFeedbackSchema);

export default VideoFeedback;
