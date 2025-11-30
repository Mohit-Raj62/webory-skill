import mongoose, { Schema, model, models } from "mongoose";

const InternshipTaskSchema = new Schema({
  internship: {
    type: Schema.Types.ObjectId,
    ref: "Internship",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InternshipTask =
  models.InternshipTask || model("InternshipTask", InternshipTaskSchema);

export default InternshipTask;
