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
});

const Internship = models.Internship || model("Internship", InternshipSchema);

export default Internship;
// Rebuild trigger
