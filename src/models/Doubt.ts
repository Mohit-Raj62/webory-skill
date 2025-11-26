import mongoose, { Schema, model, models } from 'mongoose';

const DoubtSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  videoIndex: {
    type: Number,
    default: null,
  },
  videoTitle: {
    type: String,
    default: '',
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: '',
  },
  answeredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'answered'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  answeredAt: {
    type: Date,
    default: null,
  },
});

// Index for faster queries
DoubtSchema.index({ student: 1, course: 1 });
DoubtSchema.index({ status: 1 });

const Doubt = models.Doubt || model('Doubt', DoubtSchema);

export default Doubt;
