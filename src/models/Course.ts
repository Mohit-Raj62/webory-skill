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
  outcome: {
    type: String,
    default: "", // One-line outcome (e.g. "Build real-world apps...")
  },
  whoIsThisFor: {
    type: [String],
    default: [], // Array of target audience
  },
  projects: {
    type: [
      {
        title: String,
        description: String,
      },
    ],
    default: [],
  },
  careerOutcomes: {
    type: [String],
    default: [], // Array of job roles
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
  coInstructors: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: [], // Additional teachers assigned to the course
  },
  collaboration: {
    // e.g. "JIBT College"
    type: String,
    default: "",
  },
  signatures: {
    founder: {
      name: { type: String, default: "Mohit Sinha" },
      title: { type: String, default: "Founder & CEO" },
    },
    director: {
      name: { type: String, default: "Vijay Kumar" },
      title: { type: String, default: "Director of Education, Webory" },
      credential: { type: String, default: "Alumnus, IIT Mandi" },
    },
    partner: {
      name: { type: String, default: "Partner Rep." },
      title: { type: String, default: "Authorized Signatory" },
    },
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
  gstPercentage: {
    type: Number,
    default: 0, // e.g. 18 for 18%
    min: 0,
    max: 100,
  },
  curriculum: {
    type: [String], // Array of topic titles
    default: [],
  },
  benefits: {
    type: [String], // Array of course benefits
    default: [],
  },
  certificateImage: {
    type: String, // URL to sample certificate image
    default: "",
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
  isPopular: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
});

// Performance indexes for faster queries
CourseSchema.index({ isAvailable: 1 }); // For public course filtering
CourseSchema.index({ createdAt: -1 }); // For sorting by newest
CourseSchema.index({ isPopular: 1 }); // For filtering popular courses

// Force Schema Recompile
const Course = models.Course || model("Course", CourseSchema);

export default Course;
