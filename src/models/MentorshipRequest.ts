import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    plan: {
        type: String,
        enum: ["standard", "pro", "elite"],
        required: true
    },
    goals: {
        type: String,
        required: true
    },
    preferredTime: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "matched", "active", "completed", "cancelled"],
        default: "pending"
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Delete existing model in development to avoid OverwriteModelError
if (process.env.NODE_ENV === 'development' && mongoose.models.MentorshipRequest) {
    delete mongoose.models.MentorshipRequest;
}

export const MentorshipRequest = mongoose.models.MentorshipRequest || mongoose.model("MentorshipRequest", mentorshipRequestSchema);
