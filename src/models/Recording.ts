import mongoose, { Schema, Document } from "mongoose";

export interface IRecording extends Document {
  liveSessionId?: mongoose.Types.ObjectId; // If generated from a LiveSession
  courseId?: mongoose.Types.ObjectId;
  moduleId?: mongoose.Types.ObjectId;
  title: string;
  originalFileName: string;
  r2Bucket: string;
  r2KeyOriginal: string; // The original MP4 key
  r2KeyHls?: string; // The processed HLS folder/key
  hlsUrl?: string; // The URL to the .m3u8 file
  mp4Url?: string; // Fallback or raw URL
  status: "uploading" | "processing" | "ready" | "failed";
  duration?: number;
  createdAt: Date;
}

const RecordingSchema = new Schema<IRecording>({
  liveSessionId: {
    type: Schema.Types.ObjectId,
    ref: "LiveSession",
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    // Reference left generic since module is inside course array
  },
  title: {
    type: String,
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  r2Bucket: {
    type: String,
    required: true,
  },
  r2KeyOriginal: {
    type: String,
    required: true,
  },
  r2KeyHls: {
    type: String,
  },
  hlsUrl: {
    type: String,
  },
  mp4Url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["uploading", "processing", "ready", "failed"],
    default: "uploading",
  },
  duration: {
    type: Number, // duration in seconds
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RecordingSchema.index({ status: 1 });
RecordingSchema.index({ courseId: 1 });

export default mongoose.models.Recording || mongoose.model<IRecording>("Recording", RecordingSchema);
