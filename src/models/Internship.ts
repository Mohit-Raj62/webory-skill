import mongoose, { Schema, model, models } from 'mongoose';

const InternshipSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., Full-time, Part-time
  },
  stipend: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0, // Registration fee
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
  tags: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Force model rebuild for dev
if (process.env.NODE_ENV === 'development' && models.Internship) {
  delete models.Internship;
}



const Internship = models.Internship || model('Internship', InternshipSchema);

export default Internship;
// Rebuild trigger
