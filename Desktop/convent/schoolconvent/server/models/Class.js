import { Schema, model, Types } from "mongoose";

const classSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    section: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    classTeacher: {
      type: Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentStrength: {
      type: Number,
      default: 0,
    },
    students: [
      {
        studentId: {
          type: Types.ObjectId,
          ref: "Student",
        },
        rollNo: String,
        name: String,
        admissionDate: Date,
        status: {
          type: String,
          enum: ["active", "inactive"],
          default: "active",
        },
      },
    ],
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          required: true,
        },
        periods: [
          {
            periodNo: Number,
            startTime: String,
            endTime: String,
            subject: String,
            teacher: {
              type: Types.ObjectId,
              ref: "Teacher",
            },
            roomNo: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = model("Class", classSchema);

export default Class;
