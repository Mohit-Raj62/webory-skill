import mongoose, { Schema, model, models } from "mongoose";

const HackathonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  problemStatement: {
    type: String,
    default: "",
  },
  bannerImage: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    required: true, // e.g., "AI & Automation", "MERN Stack"
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  registrationDeadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "live", "completed"],
    default: "upcoming",
  },
  prizes: [{
    title: String,
    reward: String,
    value: Number, // Points or Currency
  }],
  rules: [String],
  simulatorPrerequisite: {
    type: Boolean,
    default: false, // If true, user must pass a simulator to join
  },
  requiredSimulatorId: {
    type: Schema.Types.ObjectId,
    ref: "Simulator",
    default: null,
  },
  registeredUsers: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  isArchived: {
    type: Boolean,
    default: false,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  totalXpDistributed: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Hackathon = models.Hackathon || model("Hackathon", HackathonSchema);

export default Hackathon;
