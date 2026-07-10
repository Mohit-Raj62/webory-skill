import mongoose, { Schema, model, models } from "mongoose";

const PolicyVersionSchema = new Schema({
  documentType: {
    type: String,
    enum: ["terms", "privacy", "marketing"],
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  effectiveDate: {
    type: Date,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

PolicyVersionSchema.index({ documentType: 1, isActive: 1 });

const PolicyVersion = models.PolicyVersion || model("PolicyVersion", PolicyVersionSchema);
export default PolicyVersion;
