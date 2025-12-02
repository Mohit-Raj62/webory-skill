import mongoose from "mongoose";

const MentorshipPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: String,
    enum: ["standard", "pro", "elite"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentProof: {
    type: String, // URL to uploaded payment screenshot
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.MentorshipPayment ||
  mongoose.model("MentorshipPayment", MentorshipPaymentSchema);
