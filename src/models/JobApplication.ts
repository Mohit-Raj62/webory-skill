import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true
    },
    resume: {
        type: String, // Cloudinary URL
        required: true
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "reviewing", "interview", "rejected", "accepted"],
        default: "pending"
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// Delete existing model in development to avoid OverwriteModelError
if (process.env.NODE_ENV === 'development' && mongoose.models.JobApplication) {
    delete mongoose.models.JobApplication;
}

export const JobApplication = mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);
