import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatMessageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional - allows guest users
    default: null,
    index: true, // For faster queries by user
  },
  sessionId: {
    type: String,
    required: true,
    unique: true, // Helper for index
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
  context: {
    currentPage: String,
    userRole: String,
    deviceType: String,
    timestamp: Date,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
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

// Update the updatedAt timestamp on save
ChatMessageSchema.pre("save", function () {
  this.updatedAt = new Date();
});

// Index for efficient queries
ChatMessageSchema.index({ userId: 1, createdAt: -1 });
// SessionId index is already created by unique: true or explicit definition
// ChatMessageSchema.index({ sessionId: 1 });

// Prevent Mongoose OverwriteModelError
// Delete the model if it exists to prevent schema caching issues in dev
if (process.env.NODE_ENV === "development" && models.ChatMessage) {
  delete models.ChatMessage;
}

const ChatMessage =
  models.ChatMessage || model("ChatMessage", ChatMessageSchema);

export default ChatMessage;
