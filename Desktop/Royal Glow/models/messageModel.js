import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        requred: true,
    },
    message: {
        type: String,
        // required: true,
        trim: true,
        ref: "users",
    }
}, { timestamps: true });

export default mongoose.model(' messages', messagesSchema);