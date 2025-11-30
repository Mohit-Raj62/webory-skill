import mongoose, { Schema, Document } from "mongoose";

export interface ILiveClass extends Document {
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  meetingUrl: string;
  recordingUrl?: string;
  type: "course" | "internship" | "general";
  referenceId?: mongoose.Types.ObjectId; // ID of the course or internship
  instructor: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LiveClassSchema = new Schema<ILiveClass>({
  title: {
    type: String,
    required: [true, "Please provide a title for the live class"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  date: {
    type: Date,
    required: [true, "Please provide a date and time"],
  },
  duration: {
    type: Number,
    required: true,
    default: 60,
  },
  meetingUrl: {
    type: String,
    required: [true, "Please provide a meeting URL"],
  },
  recordingUrl: {
    type: String,
  },
  type: {
    type: String,
    enum: ["course", "internship", "general"],
    default: "general",
  },
  referenceId: {
    type: Schema.Types.ObjectId,
    refPath: "typeModel", // Dynamic reference based on type
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for dynamic reference model
LiveClassSchema.virtual("typeModel").get(function () {
  if (this.type === "course") return "Course";
  if (this.type === "internship") return "Internship";
  return null;
});

export default mongoose.models.LiveClass ||
  mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);
