import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
  },
  requirements: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: [true, "Job location is required"], // e.g., New York, Bangalore
  },
  workMode: {
    type: String,
    enum: ["Remote", "Hybrid", "On-site"],
    default: "On-site",
    required: true,
  },
  salary: {
    type: String,
    default: "Not disclosed",
  },
  type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    default: "Full-time",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete existing model in development to avoid OverwriteModelError
if (process.env.NODE_ENV === "development" && mongoose.models.Job) {
  delete mongoose.models.Job;
}

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
