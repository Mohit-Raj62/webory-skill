import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['video_watched', 'quiz_attempted', 'course_enrolled', 'internship_applied'],
    required: true,
  },
  category: {
    type: String,
    enum: ['course', 'internship'],
    required: true,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'category',
  },
  metadata: {
    videoMinutes: { type: Number, default: 0 },
    questionsCount: { type: Number, default: 0 },
    courseName: String,
    internshipName: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
ActivitySchema.index({ student: 1, date: -1 });
ActivitySchema.index({ student: 1, category: 1, date: -1 });

const Activity = models.Activity || model('Activity', ActivitySchema);

export default Activity;
