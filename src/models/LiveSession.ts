import mongoose, { Schema, Document } from "mongoose";

export interface ILiveSession extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  roomId: string; // LiveKit Room ID / Name
  courseId?: mongoose.Types.ObjectId; // Optional, if linked to a course
  status: "scheduled" | "active" | "ended";
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  recordingId?: mongoose.Types.ObjectId; // Link to the recording after it ends
  createdAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  sessionType: {
    type: String,
    enum: ["course", "internship", "interview", "general"],
    default: "general",
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  internshipId: {
    type: Schema.Types.ObjectId,
    ref: "Internship",
  },
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: "Application", // For interview sessions
  },
  moduleId: {
    type: String, // String or ObjectId to link to the specific curriculum module
  },
  status: {
    type: String,
    enum: ["scheduled", "active", "ended"],
    default: "scheduled",
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
  recordingId: {
    type: Schema.Types.ObjectId,
    ref: "Recording", // Added link to the processed recording later
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LiveSessionSchema.index({ status: 1 });
LiveSessionSchema.index({ roomId: 1 });

export default mongoose.models.LiveSession || mongoose.model<ILiveSession>("LiveSession", LiveSessionSchema);
