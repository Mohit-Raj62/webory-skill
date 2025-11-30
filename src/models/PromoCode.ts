import mongoose, { Schema, model, models } from "mongoose";

const PromoCodeSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  applicableTo: {
    type: String,
    enum: ["course", "internship", "both"],
    default: "both",
  },
  applicableIds: {
    type: [String], // Array of course/internship IDs, empty means all
    default: [],
  },
  maxUses: {
    type: Number,
    default: null, // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null, // null means no expiry
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PromoCode = models.PromoCode || model("PromoCode", PromoCodeSchema);

export default PromoCode;
