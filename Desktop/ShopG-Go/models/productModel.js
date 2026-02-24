import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
    },
    slug: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    price: {
      type: "number",
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "category",
      required: true,
    },
    quantity: {
      type: "number",
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Products", productSchema);
