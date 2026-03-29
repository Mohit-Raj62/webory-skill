import mongoose from "mongoose";

const ambassadorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  totalSignups: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ["student", "business-owner", "working-professional"],
    required: true,
  },
  studyLevel: {
    type: String,
    enum: ["university", "college"],
  },
  courseType: {
    type: String,
    enum: ["medical", "engineering", "other"],
  },
  collegeState: {
    type: String,
    trim: true,
  },
  collegeCity: {
    type: String,
    trim: true,
  },
  courseName: {
    type: String,
    trim: true,
  },
  graduationYear: {
    type: String,
    trim: true,
  },
  collegeIdCardUrl: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
  panCardNumber: {
    type: String,
    trim: true,
    uppercase: true,
  },
  appliedReferralCode: {
    type: String,
    trim: true,
    uppercase: true,
  },
  status: {
    type: String,
    enum: ["active", "suspended", "pending", "rejected"],
    default: "pending",
  },
  testimonial: {
    type: String,
    trim: true,
  },
  showTestimonial: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete existing model in development to avoid OverwriteModelError
if (process.env.NODE_ENV === "development" && mongoose.models.Ambassador) {
  delete mongoose.models.Ambassador;
}

const Ambassador =
  mongoose.models.Ambassador || mongoose.model("Ambassador", ambassadorSchema);

export default Ambassador;
