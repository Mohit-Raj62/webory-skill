import mongoose, { Schema, model, models } from 'mongoose';

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
    type: [{
      title: String,
      url: String,
      duration: String, // e.g., "15:30"
    }],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model exists and delete it to prevent caching issues with schema changes in dev
if (process.env.NODE_ENV === "development" && models.Course) {
  delete models.Course;
}

const Course = models.Course || model('Course', CourseSchema);

export default Course;
