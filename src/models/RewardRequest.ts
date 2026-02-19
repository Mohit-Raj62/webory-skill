import mongoose from "mongoose";

const rewardRequestSchema = new mongoose.Schema({
  ambassadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ambassador",
    required: true,
  },
  item: {
    type: String,
    required: true, // e.g. "T-Shirt", "Mug"
  },
  pointsSpent: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "rejected"],
    default: "pending",
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete existing model in development
if (process.env.NODE_ENV === "development" && mongoose.models.RewardRequest) {
  delete mongoose.models.RewardRequest;
}

const RewardRequest =
  mongoose.models.RewardRequest ||
  mongoose.model("RewardRequest", rewardRequestSchema);

export default RewardRequest;
