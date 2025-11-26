import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['mcq', 'true-false'],
    default: 'mcq',
  },
  options: [{
    type: String,
  }],
  correctAnswer: {
    type: Number, // Index of correct option
    required: true,
  },
  marks: {
    type: Number,
    default: 1,
  },
  explanation: {
    type: String,
  },
});

const QuizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['quiz', 'test', 'exam'],
    default: 'quiz',
  },
  duration: {
    type: Number, // Minutes
    required: true,
  },
  passingScore: {
    type: Number, // Percentage
    default: 70,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  questions: [QuestionSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  allowRetake: {
    type: Boolean,
    default: true,
  },
  showAnswers: {
    type: Boolean,
    default: true, // Show correct answers after submission
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

export default Quiz;
