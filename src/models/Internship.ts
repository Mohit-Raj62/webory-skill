import mongoose, { Schema, model, models } from "mongoose";

const InternshipSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., Full-time, Part-time
  },
  stipend: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: "3-6 Months",
  },
  deadline: {
    type: String,
    default: "Next week!",
  },
  perks: {
    type: [String],
    default: ["Performance Bonus"],
  },
  price: {
    type: Number,
    default: 0, // Registration fee
  },
  originalPrice: {
    type: Number,
    default: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  gstPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  tags: {
    type: [String],
    default: [],
  },
  tagline: {
    type: String,
    default: "Master production-ready tools",
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    default: [],
  },
  responsibilities: {
    type: [String],
    default: [],
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
  isFree: {
    type: Boolean,
    default: false,
  },
  totalSeats: {
    type: Number,
    default: 50,
  },
  filledSeats: {
    type: Number,
    default: 0,
  },
  benefits: {
    type: [{
      title: String,
      description: String,
      icon: String,
    }],
    default: [
      { title: "Certified Experience", description: "Get a verified internship completion certificate and letter of recommendation from Webory.", icon: "ShieldCheck" },
      { title: "Direct Mentorship", description: "Work directly with industry experts who will guide you through complex real-world production cycles.", icon: "Sparkles" },
      { title: "Career Growth", description: "Top performers will receive Pre-Placement Offers (PPOs) and exclusive networking opportunities.", icon: "Briefcase" }
    ],
  },
  videos: {
    type: [
      {
        title: String,
        url: String,
        duration: String, // e.g., "15:30"
      },
    ],
    default: [],
  },
  modules: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        order: {
          type: Number,
          required: true,
          default: 0,
        },
        videos: {
          type: [
            {
              title: String,
              url: String,
              duration: String,
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
});

const Internship = models.Internship || model("Internship", InternshipSchema);

export default Internship;
// Rebuild trigger
