import mongoose from "mongoose";

const ambassadorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  totalSignups: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "suspended", "pending", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete existing model in development to avoid OverwriteModelError
if (process.env.NODE_ENV === "development" && mongoose.models.Ambassador) {
  delete mongoose.models.Ambassador;
}

const Ambassador =
  mongoose.models.Ambassador || mongoose.model("Ambassador", ambassadorSchema);

export default Ambassador;
