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
  isSimulated: {
    type: Boolean,
    default: false,
  },
  initialCode: {
    type: String,
    default: "",
  },
  expectedRegex: {
    type: String,
    default: "",
  },
  hints: {
    type: [String],
    default: [],
  },
  emails: {
    type: [Object],
    default: [],
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
