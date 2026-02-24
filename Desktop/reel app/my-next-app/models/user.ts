import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

export interface Iuser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the user schema
const userSchema = new Schema<Iuser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre<Iuser>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Create the model from the schema
const User = models?.User || model<Iuser>("User ", userSchema);

export default User;