import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestionBank extends Document {
  questionText: string;
  questionType:
    | "mcq"
    | "multiple-correct"
    | "true-false"
    | "fill-in-the-blanks"
    | "short-answer"
    | "descriptive"
    | "coding";
  options: string[];
  correctAnswer: any;
  explanation: string;
  marks: number;
  negativeMarks: number;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  course?: string;
  topic?: string;
  chapter?: string;
  tags: string[];
  codeSnippet?: string;
  language?: string;
  isApproved: boolean;
  source: "ai" | "manual" | "imported";
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankSchema = new Schema<IQuestionBank>(
  {
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
      default: "General",
      trim: true,
    },
    course: {
      type: String,
      default: "",
      trim: true,
    },
    topic: {
      type: String,
      default: "",
      trim: true,
    },
    chapter: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    codeSnippet: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "javascript",
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ["ai", "manual", "imported"],
      default: "manual",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

QuestionBankSchema.index({ subject: 1, difficulty: 1 });
QuestionBankSchema.index(
  { questionText: "text", topic: "text", tags: "text" },
  { default_language: "english", language_override: "none" }
);

const QuestionBank: Model<IQuestionBank> =
  mongoose.models.QuestionBank ||
  mongoose.model<IQuestionBank>("QuestionBank", QuestionBankSchema);

export default QuestionBank;
