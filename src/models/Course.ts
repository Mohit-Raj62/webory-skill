import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for now to support existing courses
  },
  studentsCount: {
    type: String,
    default: "0",
  },
  color: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true, // Store icon name as string, e.g., "Globe", "Palette"
  },
  price: {
    type: Number,
    default: 0,
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
  curriculum: {
    type: [String], // Array of topic titles
    default: [],
  },
  videos: {
    type: [
      {
        title: String,
        url: String,
        duration: String, // e.g., "15:30"
      },
    ],
    default: [],
  },
  modules: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        order: {
          type: Number,
          required: true,
          default: 0,
        },
        videos: {
          type: [
            {
              title: String,
              url: String,
              duration: String,
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
  thumbnail: {
    type: String,
    default: "",
  },
  duration: {
    type: String,
    default: "0h",
  },
  pdfResources: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        fileUrl: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        afterModule: {
          type: Number,
          required: true,
          default: 0, // 0 means before all modules, 1 means after first module, etc.
        },
        order: {
          type: Number,
          required: true,
          default: 0, // Order within the same position
        },
        uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        cloudinaryId: {
          type: String,
          required: true, // For deletion
        },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = models.Course || model("Course", CourseSchema);

export default Course;
