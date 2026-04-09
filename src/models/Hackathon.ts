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
  domains: {
    type: [String],
    default: [],
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    domain: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
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
  collaboration: {
    type: String,
    default: "",
  },
  collaborations: {
    type: [{
      name: String,
      logo: String,
      website: String,
    }],
    default: [],
  },
  signatures: {
    founder: {
      name: { type: String, default: "Mohit Sinha" },
      title: { type: String, default: "Founder & CEO" },
    },
    director: {
      name: { type: String, default: "Vijay Kumar" },
      title: { type: String, default: "Director of Education, Webory" },
      credential: { type: String, default: "Alumnus, IIT Mandi" },
    },
    partner: {
      name: { type: String, default: "Partner Rep." },
      title: { type: String, default: "Authorized Signatory" },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Performance indices for faster queries
HackathonSchema.index({ slug: 1 });
HackathonSchema.index({ status: 1 });
HackathonSchema.index({ isHidden: 1 });
HackathonSchema.index({ "registeredUsers.user": 1 });

const Hackathon = models.Hackathon || model("Hackathon", HackathonSchema);

export default Hackathon;
