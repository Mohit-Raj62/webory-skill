import mongoose, { Schema, model, models } from 'mongoose';

const FeedbackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['course', 'internship', 'interface', 'general'],
    required: true,
    default: 'general',
  },
  targetId: {
    type: String, // Can be Course ID or Internship ID if applicable
    default: null,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = models.Feedback || model('Feedback', FeedbackSchema);

export default Feedback;
