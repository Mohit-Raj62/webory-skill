import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema({
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
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "responded", "closed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Delete existing model in development to avoid OverwriteModelError
if (process.env.NODE_ENV === 'development' && mongoose.models.ContactRequest) {
    delete mongoose.models.ContactRequest;
}

export const ContactRequest = mongoose.models.ContactRequest || mongoose.model("ContactRequest", contactRequestSchema);
