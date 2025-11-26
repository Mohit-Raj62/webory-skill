import mongoose from 'mongoose';

const AssignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  submissionText: {
    type: String,
  },
  attachments: [{
    name: String,
    url: String,
  }],
  status: {
    type: String,
    enum: ['submitted', 'graded', 'late'],
    default: 'submitted',
  },
  marksObtained: {
    type: Number,
  },
  feedback: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  gradedAt: {
    type: Date,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const AssignmentSubmission = mongoose.models.AssignmentSubmission || mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);

export default AssignmentSubmission;
