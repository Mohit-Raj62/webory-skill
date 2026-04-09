import mongoose, { Schema, model, models } from "mongoose";

const CustomCertificateSchema = new Schema({
  studentName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  certificateKey: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  hackathonTitle: String,
  projectName: String,
  domain: String,
  type: {
    type: String,
    enum: ["winner", "participant"],
    default: "participant",
  },
  rank: Number,
  collaborations: {
    type: [{
      name: String,
      logo: String,
    }],
    default: [],
  },
  signatures: {
    founder: { name: String, title: String },
    director: { name: String, title: String },
    partner: { name: String, title: String },
  },
});

const CustomCertificate =
  models.CustomCertificate ||
  model("CustomCertificate", CustomCertificateSchema);

export default CustomCertificate;
