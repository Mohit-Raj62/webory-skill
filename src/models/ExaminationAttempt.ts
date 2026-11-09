import mongoose, { Schema, Document, Model } from "mongoose";
import "./User";
import "./Examination";

export interface IStudentResponse {
  questionId: string;
  selectedAnswer: any; // number | number[] | boolean | string | null
  status:
    | "answered"
    | "not-answered"
    | "marked-for-review"
    | "answered-marked-for-review"
    | "not-visited";
  updatedAt: Date;
}

export interface IQuestionEvaluationBreakdown {
  questionId: string;
  questionText: string;
  questionType: string;
  options: string[];
  selectedAnswer: any;
  correctAnswer: any;
  isCorrect: boolean;
  marksAwarded: number;
  explanation: string;
  difficulty?: string;
  topic?: string;
}

export interface IExaminationAttempt extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  attemptNumber: number;
  status: "in-progress" | "submitted" | "evaluated" | "abandoned" | "timed-out";
  startTime: Date;
  endTime: Date;
  submittedAt?: Date;
  totalDurationMinutes: number;
  extraMinutes: number;
  lastActivePing: Date;
  connectionStatus: "online" | "idle" | "offline";
  tabSwitchCount: number;
  fullscreenExitCount: number;
  violationCount: number;
  responses: IStudentResponse[];
  evaluation?: {
    totalQuestions: number;
    attemptedQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unattemptedQuestions: number;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    passed: boolean;
    timeTakenSeconds: number;
    evaluatedAt: Date;
    questionBreakdown: IQuestionEvaluationBreakdown[];
  };
  activityLogs: {
    action: string;
    timestamp: Date;
    metadata?: any;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentResponseSchema = new Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    selectedAnswer: {
      type: Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "answered",
        "not-answered",
        "marked-for-review",
        "answered-marked-for-review",
        "not-visited",
      ],
      default: "not-visited",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const QuestionEvaluationBreakdownSchema = new Schema(
  {
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    questionType: { type: String, default: "mcq" },
    options: { type: [String], default: [] },
    selectedAnswer: { type: Schema.Types.Mixed, default: null },
    correctAnswer: { type: Schema.Types.Mixed },
    isCorrect: { type: Boolean, default: false },
    marksAwarded: { type: Number, default: 0 },
    explanation: { type: String, default: "" },
    difficulty: { type: String, default: "medium" },
    topic: { type: String, default: "" },
  },
  { _id: false }
);

const ExaminationAttemptSchema = new Schema<IExaminationAttempt>(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Examination",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["in-progress", "submitted", "evaluated", "abandoned", "timed-out"],
      default: "in-progress",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    totalDurationMinutes: {
      type: Number,
      required: true,
    },
    extraMinutes: {
      type: Number,
      default: 0,
    },
    lastActivePing: {
      type: Date,
      default: Date.now,
    },
    connectionStatus: {
      type: String,
      enum: ["online", "idle", "offline"],
      default: "online",
    },
    tabSwitchCount: {
      type: Number,
      default: 0,
    },
    fullscreenExitCount: {
      type: Number,
      default: 0,
    },
    violationCount: {
      type: Number,
      default: 0,
    },
    responses: [StudentResponseSchema],
    evaluation: {
      totalQuestions: { type: Number, default: 0 },
      attemptedQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      incorrectAnswers: { type: Number, default: 0 },
      unattemptedQuestions: { type: Number, default: 0 },
      totalMarks: { type: Number, default: 0 },
      obtainedMarks: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      passed: { type: Boolean, default: false },
      timeTakenSeconds: { type: Number, default: 0 },
      evaluatedAt: { type: Date, default: null },
      questionBreakdown: [QuestionEvaluationBreakdownSchema],
    },
    activityLogs: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        metadata: { type: Schema.Types.Mixed },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ExaminationAttemptSchema.index({ examId: 1, studentId: 1 });
ExaminationAttemptSchema.index({ status: 1 });
ExaminationAttemptSchema.index({ lastActivePing: 1 });

if (mongoose.models.ExaminationAttempt && !mongoose.models.ExaminationAttempt.schema?.paths?.tabSwitchCount) {
  delete (mongoose.models as any).ExaminationAttempt;
}

const ExaminationAttempt: Model<IExaminationAttempt> =
  mongoose.models.ExaminationAttempt ||
  mongoose.model<IExaminationAttempt>(
    "ExaminationAttempt",
    ExaminationAttemptSchema
  );

export default ExaminationAttempt;
