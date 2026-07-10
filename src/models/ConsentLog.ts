import mongoose, { Schema, model, models } from "mongoose";

const ConsentLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    enum: ["granted", "withdrawn", "updated", "rejected"],
    required: true,
  },
  consentType: {
    type: String,
    enum: ["terms", "privacy", "marketing"],
    required: true,
  },
  policyVersion: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true, // Prevents updates after creation
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
  },
  source: { 
        type: String, 
        enum: ['web-signup', 'profile-settings', 'legacy-consent-modal', 'admin-dashboard', 'api', 'system'],
        required: true 
    }
});

// Important indexes for efficient querying
ConsentLogSchema.index({ userId: 1, timestamp: -1 });
ConsentLogSchema.index({ consentType: 1, timestamp: -1 });

const ConsentLog = models.ConsentLog || model("ConsentLog", ConsentLogSchema);
export default ConsentLog;
