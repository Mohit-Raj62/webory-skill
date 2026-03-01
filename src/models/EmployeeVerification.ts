import { Schema, model, models } from "mongoose";

const EmployeeVerificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    positionApplied: {
      type: String,
      required: [true, "Position is required"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    currentAddress: {
      type: String,
      required: [true, "Current address is required"],
    },
    documents: {
      resume: { type: String, default: null },
      aadharFront: { type: String, default: null },
      aadharBack: { type: String, default: null },
      panCard: { type: String, default: null },
      marksheet10th: { type: String, default: null },
      marksheet12th: { type: String, default: null },
      degree: { type: String, default: null },
      passportPhoto: { type: String, default: null },
      cancelledCheque: { type: String, default: null },
      experienceLetter: { type: String, default: null },
    },
    declaration: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentStep: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 2,
    },
    status: {
      type: String,
      enum: [
        "interview_cleared",
        "document_verification",
        "offer_letter",
        "joining",
      ],
      default: "document_verification",
    },
  },
  { timestamps: true },
);

// Indexes
EmployeeVerificationSchema.index({ email: 1 });
EmployeeVerificationSchema.index({ status: 1 });
EmployeeVerificationSchema.index({ currentStep: 1 });

const EmployeeVerification =
  models.EmployeeVerification ||
  model("EmployeeVerification", EmployeeVerificationSchema);

export default EmployeeVerification;
