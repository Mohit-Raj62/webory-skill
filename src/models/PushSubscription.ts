import mongoose, { Schema, model, models } from "mongoose";

const PushSubscriptionSchema = new Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  expirationTime: {
    type: Number,
    default: null,
  },
  keys: {
    p256dh: String,
    auth: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PushSubscription = models.PushSubscription || model("PushSubscription", PushSubscriptionSchema);

export default PushSubscription;
