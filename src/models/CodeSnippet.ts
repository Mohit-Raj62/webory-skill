import mongoose from "mongoose";

const CodeSnippetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a file name"],
      trim: true,
      maxlength: [50, "File name cannot be more than 50 characters"],
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate filenames for the same user
CodeSnippetSchema.index({ user: 1, title: 1 }, { unique: true });

export default mongoose.models.CodeSnippet ||
  mongoose.model("CodeSnippet", CodeSnippetSchema);
