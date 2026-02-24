import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided when creating"],
    },
    email: {
      type: String,
      required: [true, "Email must be provided when creating"],
      uninque: [true, " email already exists NEW email entered"],
    },
    password: {
      type: String,
      required: [true, "Password must be provided when creating"],
      minLength: [8, "Password must be at least 8 characters"],
    },
    address: {
      type: String,
      required: [true, "Address must be provided when creating"],
    },
    city: {
      type: String,
      required: [true, "City must be provided when creating"],
    },
    pincode: {
      type: Number,
      required: [true, "Pincode must be provided when creating"],
      minLength: [6, "Pincode must be provided when"],
    },
    country: {
      type: String,
      required: [true, "Country must be provided when creating"],
    },
    phone: {
      type: Number,
      required: [true, "Phone must be provided when creating"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      // required:[true ,"Profile must be provided when creating"],
    },
  },
  { timestamps: true }
);

// function to bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
// compatibility
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// JWT Token Authentication
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "11d",
  });
};
// exporter Token Authentication
export const userModel = mongoose.model("Users", userSchema);
export default userModel;
