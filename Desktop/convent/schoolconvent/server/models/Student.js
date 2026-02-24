import { Schema, model, Types } from 'mongoose';

const studentSchema = new Schema(
  {
    authId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
    },
    section: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    parentInfo: {
      name: String,
      relation: String,
      phone: String,
      email: String,
    },
    academic: {
      currentClass: String,
      section: String,
      rollNo: String,
      admissionDate: Date,
      previousSchool: String,
      subjects: [String],
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Student = model("Student", studentSchema);

export default Student;
