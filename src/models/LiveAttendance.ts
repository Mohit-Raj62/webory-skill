import mongoose, { Schema, Document } from "mongoose";

export interface ILiveAttendance extends Document {
  liveSessionId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  studentName: string; // Stored here for guest students
  isGuest: boolean;
  joinTime: Date;
  leaveTime?: Date;
  duration?: number; // In seconds
}

const LiveAttendanceSchema = new Schema<ILiveAttendance>({
  liveSessionId: {
    type: Schema.Types.ObjectId,
    ref: "LiveSession",
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  studentName: {
    type: String,
    required: true,
  },
  isGuest: {
    type: Boolean,
    default: true,
  },
  joinTime: {
    type: Date,
    default: Date.now,
  },
  leaveTime: {
    type: Date,
  },
  duration: {
    type: Number,
    default: 0,
  },
});

LiveAttendanceSchema.index({ liveSessionId: 1 });

export default mongoose.models.LiveAttendance || mongoose.model<ILiveAttendance>("LiveAttendance", LiveAttendanceSchema);
