import mongoose, { Schema, model, models } from "mongoose";

const PDFAccessSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  pdfResourceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  accessedAt: {
    type: Date,
    default: Date.now,
  },
  downloaded: {
    type: Boolean,
    default: false,
  },
});

// Index for faster queries
PDFAccessSchema.index({ student: 1, course: 1, pdfResourceId: 1 });
PDFAccessSchema.index({ course: 1, pdfResourceId: 1 });

const PDFAccess = models.PDFAccess || model("PDFAccess", PDFAccessSchema);

export default PDFAccess;
