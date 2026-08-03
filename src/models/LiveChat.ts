import mongoose, { Schema, Document } from "mongoose";

export interface ILiveChat extends Document {
  liveSessionId: mongoose.Types.ObjectId;
  senderId?: mongoose.Types.ObjectId;
  senderName: string;
  isInstructor: boolean;
  message: string;
  isPinned: boolean;
  isDeleted: boolean;
  timestamp: Date;
}

const LiveChatSchema = new Schema<ILiveChat>({
  liveSessionId: {
    type: Schema.Types.ObjectId,
    ref: "LiveSession",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  senderName: {
    type: String,
    required: true,
  },
  isInstructor: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

LiveChatSchema.index({ liveSessionId: 1, timestamp: 1 });

export default mongoose.models.LiveChat || mongoose.model<ILiveChat>("LiveChat", LiveChatSchema);
