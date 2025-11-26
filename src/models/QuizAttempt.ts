import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true,
  },
  answer: {
    type: Number, // Index of selected option
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
});

const QuizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  answers: [AnswerSchema],
  totalMarks: {
    type: Number,
    required: true,
  },
  obtainedMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  timeSpent: {
    type: Number, // Seconds
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
