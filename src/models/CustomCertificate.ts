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
});

const CustomCertificate =
  models.CustomCertificate ||
  model("CustomCertificate", CustomCertificateSchema);

export default CustomCertificate;
