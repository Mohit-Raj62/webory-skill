import mongoose, { Schema, model, models } from 'mongoose';

const ApplicationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  internship: {
    type: Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  resume: {
    type: String,
    required: true, // URL to resume
  },
  coverLetter: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'interview_scheduled', 'completed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
  amountPaid: {
    type: Number,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  // Offer Letter fields (set when application is accepted)
  startDate: {
    type: Date,
  },
  duration: {
    type: String, // e.g., "3 months", "6 months"
  },
  // Interview fields
  interviewDate: {
    type: Date,
  },
  interviewLink: {
    type: String,
  },
  interviewNotes: {
    type: String,
  },
  // Certificate fields
  completedAt: {
    type: Date,
  },
  certificateId: {
    type: String,
  }
});

const Application = models.Application || model('Application', ApplicationSchema);

export default Application;
