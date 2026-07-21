import mongoose, { Schema, model, models } from "mongoose";

const ActivityLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "CREATE_COURSE",
      "UPDATE_COURSE",
      "DELETE_COURSE",
      "VERIFY_USER",
      "DELETE_USER",
      "LOGIN",
      "LOGOUT",
      "EXPORT_DATA",
      "CLEAR_CACHE",
      "CLEANUP_ASSETS",
      "OPTIMIZE_DB",
    ],
  },
  details: {
    type: String,
    default: "",
  },
  ip: {
    type: String,
    default: "unknown",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "30d", // Automatically delete document after 30 days
  },
});

const ActivityLog =
  models.ActivityLog || model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
