import mongoose, { Schema, model, models } from "mongoose";

export interface IAnnouncement {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "promotion" | "urgent";
  target: "all" | "students" | "teachers" | "admins";
  bannerActive: boolean;
  popupActive: boolean;
  link?: string;
  linkText?: string;
  expiresAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Announcement message is required"],
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["info", "warning", "promotion", "urgent"],
      default: "info",
    },
    target: {
      type: String,
      enum: ["all", "students", "teachers", "admins"],
      default: "all",
    },
    bannerActive: {
      type: Boolean,
      default: true,
    },
    popupActive: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
    linkText: {
      type: String,
      trim: true,
      default: "Learn More",
    },
    expiresAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in development
const Announcement =
  models.Announcement || model("Announcement", AnnouncementSchema);

export default Announcement;

