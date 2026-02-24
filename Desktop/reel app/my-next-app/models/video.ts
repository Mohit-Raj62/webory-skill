import mongoose, { Schema, model, models } from "mongoose";

// Create the video dimension
export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

// Define the interface for the video
export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  status: string; // Add status to the interface
  title: string;
  description: string;
  VideoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

// Create the video schema

const videoSchema = new Schema<IVideo>(
  {
    createdAt: { type:"string", required: true},
    updatedAt:{ type:"string", required: true},
    status: { type:"string", required: true},
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    VideoUrl: { type: "string", required: true },
    thumbnailUrl: { type: "string", required: true },
    controls: { type: "boolean", default: true },
    transformation: {
      height: { type: "number", default: VIDEO_DIMENSIONS.height },
      width: { type: "number", default: VIDEO_DIMENSIONS.width },
      quality: { type: "number", min: 1, max: 100 },
    },
  },
  { timestamps: true }
);

// Create the model from the schema
const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
