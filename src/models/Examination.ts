import mongoose, { Schema, Document, Model } from "mongoose";
import "./User";
import "./Course";
import "./Internship";
import "./QuestionBank";

export interface IExamQuestion {
  _id?: any;
  questionBankId?: mongoose.Types.ObjectId;
  questionText: string;
  questionType:
    | "mcq"
    | "multiple-correct"
    | "true-false"
    | "fill-in-the-blanks"
    | "short-answer"
    | "descriptive"
    | "coding";
  options?: string[];
  correctAnswer: any; // index (number), array of indices, boolean, or string
  explanation?: string;
  marks: number;
  negativeMarks?: number;
  difficulty?: "easy" | "medium" | "hard";
  subject?: string;
  topic?: string;
  chapter?: string;
  codeSnippet?: string;
  language?: string;
}

export interface IExamination extends Document {
  title: string;
  description?: string;
  subject?: string;
  courseId?: mongoose.Types.ObjectId;
  topic?: string;
  chapter?: string;
  syllabus?: string;
  status: "draft" | "hidden" | "scheduled" | "live" | "completed" | "archived";
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  passingPercentage: number;
  negativeMarking: boolean;
  negativeMarksPerQuestion: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  maxAttempts: number;
  startDate?: Date;
  endDate?: Date;
  isSynchronizedSlot?: boolean;
  strictWindowEnforcement?: boolean;
  resultVisibility: "immediate" | "manual";
  answerKeyVisibility: "immediate" | "manual" | "scheduled" | "hidden";
  explanationVisibility: boolean;
  questionNavigation: boolean;
  autoSubmission: boolean;
  enableProctoring: boolean;
  maxTabSwitches: number;
  requireFullscreen: boolean;
  disableCopyPaste: boolean;
  autoSubmitOnViolations: boolean;
  studentEligibility: {
    type: "all" | "internship" | "course" | "specific";
    internshipIds?: mongoose.Types.ObjectId[];
    courseIds?: mongoose.Types.ObjectId[];
    allowedEmails?: string[];
  };
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  questions: IExamQuestion[];
  isPublished: boolean;
  resultsPublished: boolean;
  answerKeyPublished: boolean;
  globalTimeExtensionMinutes: number;
  timeExtensions: {
    studentId: mongoose.Types.ObjectId;
    extraMinutes: number;
    grantedAt: Date;
    reason?: string;
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExamQuestionSchema = new Schema(
  {
    questionBankId: {
      type: Schema.Types.ObjectId,
      ref: "QuestionBank",
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      enum: [
        "mcq",
        "multiple-correct",
        "true-false",
        "fill-in-the-blanks",
        "short-answer",
        "descriptive",
        "coding",
      ],
      default: "mcq",
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: Schema.Types.Mixed,
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
    marks: {
      type: Number,
      default: 1,
      min: 0,
    },
    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    subject: {
      type: String,
      default: "",
    },
    topic: {
      type: String,
      default: "",
    },
    chapter: {
      type: String,
      default: "",
    },
    codeSnippet: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "javascript",
    },
  },
  { _id: true }
);

const ExaminationSchema = new Schema<IExamination>(
  {
    title: {
      type: String,
      required: [true, "Examination title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "",
      trim: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    topic: {
      type: String,
      default: "",
    },
    chapter: {
      type: String,
      default: "",
    },
    syllabus: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "hidden", "scheduled", "live", "completed", "archived"],
      default: "hidden", // Hidden by default as required
    },
    duration: {
      type: Number,
      required: [true, "Duration in minutes is required"],
      default: 60,
      min: 1,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    passingMarks: {
      type: Number,
      default: 0,
    },
    passingPercentage: {
      type: Number,
      default: 40,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
    },
    negativeMarksPerQuestion: {
      type: Number,
      default: 0,
    },
    randomizeQuestions: {
      type: Boolean,
      default: true,
    },
    randomizeOptions: {
      type: Boolean,
      default: false,
    },
    maxAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isSynchronizedSlot: {
      type: Boolean,
      default: false,
    },
    strictWindowEnforcement: {
      type: Boolean,
      default: true,
    },
    resultVisibility: {
      type: String,
      enum: ["immediate", "manual"],
      default: "manual",
    },
    answerKeyVisibility: {
      type: String,
      enum: ["immediate", "manual", "scheduled", "hidden"],
      default: "manual",
    },
    explanationVisibility: {
      type: Boolean,
      default: true,
    },
    questionNavigation: {
      type: Boolean,
      default: true,
    },
    autoSubmission: {
      type: Boolean,
      default: true,
    },
    enableProctoring: {
      type: Boolean,
      default: true,
    },
    maxTabSwitches: {
      type: Number,
      default: 3,
    },
    requireFullscreen: {
      type: Boolean,
      default: true,
    },
    disableCopyPaste: {
      type: Boolean,
      default: true,
    },
    autoSubmitOnViolations: {
      type: Boolean,
      default: true,
    },
    studentEligibility: {
      type: {
        type: String,
        enum: ["all", "internship", "course", "specific"],
        default: "all",
      },
      internshipIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Internship",
        },
      ],
      courseIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
      allowedEmails: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
    },
    difficultyDistribution: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
    },
    questions: [ExamQuestionSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    resultsPublished: {
      type: Boolean,
      default: false,
    },
    answerKeyPublished: {
      type: Boolean,
      default: false,
    },
    globalTimeExtensionMinutes: {
      type: Number,
      default: 0,
    },
    timeExtensions: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "User" },
        extraMinutes: { type: Number, default: 0 },
        grantedAt: { type: Date, default: Date.now },
        reason: { type: String, default: "" },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ExaminationSchema.index({ status: 1 });
ExaminationSchema.index({ createdBy: 1 });
ExaminationSchema.index({ subject: 1 });
ExaminationSchema.index({ courseId: 1 });

if (mongoose.models.Examination && (!mongoose.models.Examination.schema?.paths?.maxTabSwitches || !mongoose.models.Examination.schema?.paths?.isSynchronizedSlot)) {
  delete (mongoose.models as any).Examination;
}

const Examination: Model<IExamination> =
  mongoose.models.Examination ||
  mongoose.model<IExamination>("Examination", ExaminationSchema);

export default Examination;
