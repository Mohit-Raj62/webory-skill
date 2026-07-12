import mongoose from "mongoose";

const videoTestimonialSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  roleOrCourse: {
    type: String,
    required: true,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Delete existing model in development to avoid OverwriteModelError and cached hooks
if (process.env.NODE_ENV === "development" && mongoose.models.VideoTestimonial) {
  delete mongoose.models.VideoTestimonial;
}

const VideoTestimonial = mongoose.models.VideoTestimonial || mongoose.model("VideoTestimonial", videoTestimonialSchema);

export default VideoTestimonial;
