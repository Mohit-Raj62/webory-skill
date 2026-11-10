import mongoose, { Schema, model, models } from "mongoose";

export interface IPayout {
  _id: string;
  teacher: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentMethod: "upi" | "bank_transfer";
  upiId?: string;
  bankDetails?: {
    accountNo?: string;
    ifsc?: string;
    holderName?: string;
    bankName?: string;
  };
  transactionId?: string;
  adminNote?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Payout amount is required"],
      min: [100, "Minimum payout request is ₹100"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "bank_transfer"],
      default: "upi",
    },
    upiId: {
      type: String,
      trim: true,
    },
    bankDetails: {
      accountNo: String,
      ifsc: String,
      holderName: String,
      bankName: String,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    adminNote: {
      type: String,
      trim: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Payout = models.Payout || model("Payout", PayoutSchema);

export default Payout;

