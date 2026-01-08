import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
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
  afterModule: {
    type: Number,
    default: 0, // 0 = General/Global, N = After Module N
  },
  instructions: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  attachments: [
    {
      name: String,
      url: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Assignment =
  mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);

export default Assignment;
