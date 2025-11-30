import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ["student", "admin", "teacher"],
    default: "student",
  },
  bio: {
    type: String,
    default: "",
  },
  expertise: {
    type: String,
    default: "",
  },
  socialLinks: {
    type: {
      linkedin: String,
      twitter: String,
      website: String,
    },
    default: {},
  },
  skills: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  currentSessionId: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  loginOtp: {
    type: String,
    default: null,
  },
  loginOtpExpires: {
    type: Date,
    default: null,
  },
  loginOtpAttempts: {
    type: Number,
    default: 0,
  },
  oauthProvider: {
    type: String,
    enum: ["google", "apple", "github", null],
    default: null,
  },
  oauthId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
