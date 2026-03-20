import mongoose, { Schema, model, models } from "mongoose";

const SimulatorSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  emails: [
    {
      sender: String,
      email: String,
      subject: String,
      time: String,
      body: String,
      read: { type: Boolean, default: false },
    },
  ],
  tasks: [
    {
      id: String,
      title: String,
      status: { type: String, default: "TODO" },
      desc: String,
      reporter: String,
      priority: String,
    },
  ],
  initialCode: {
    type: String,
    required: true,
  },
  expectedRegex: {
    type: String,
    required: true, // String representation of regex like "/padding:\s*20px\s*;/"
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Simulator = models.Simulator || model("Simulator", SimulatorSchema);

export default Simulator;
