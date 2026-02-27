import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: 300,
    },
    coverImage: {
      type: String,
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Development",
        "Career",
        "Design",
        "AI",
        "Backend",
        "Frontend",
        "DevOps",
        "Mobile",
        "Other",
      ],
      default: "Other",
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number,
      default: 1,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
BlogSchema.index({ author: 1, status: 1 });
BlogSchema.index({ status: 1, publishedAt: -1 });
// Delete cached model to ensure fresh schema (avoids stale pre-save hooks in dev)
if (models.Blog) {
  delete (mongoose as any).connection.models.Blog;
  delete (mongoose as any).models.Blog;
}

const Blog = model("Blog", BlogSchema);

export default Blog;
