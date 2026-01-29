import mongoose, { Schema, model, models } from "mongoose";

const LeadSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  courseId: {
    type: String, // Storing as String to be flexible (can be ID or Slug)
    default: null,
  },
  pageUrl: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["new", "contacted", "converted", "junk"],
    default: "new",
  },
  ip: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = models.Lead || model("Lead", LeadSchema);

export default Lead;
