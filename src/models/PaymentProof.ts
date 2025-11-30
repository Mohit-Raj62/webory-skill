import mongoose from "mongoose";

const PaymentProofSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null,
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Internship",
    default: null,
  },
  paymentType: {
    type: String,
    enum: ["course", "internship"],
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  screenshot: {
    type: String, // URL to uploaded screenshot
    required: true,
  },
  promoCode: {
    type: String,
    default: null,
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
  rejectionReason: {
    type: String,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
});

const PaymentProof =
  mongoose.models.PaymentProof ||
  mongoose.model("PaymentProof", PaymentProofSchema);

export default PaymentProof;
