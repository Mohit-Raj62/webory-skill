const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["house", "apartment", "condo", "townhouse", "land"],
  },
  status: {
    type: String,
    required: true,
    enum: ["for-sale", "for-rent", "sold", "rented"],
    default: "for-sale",
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // in square feet
    garage: Boolean,
    yearBuilt: Number,
  },
  amenities: [
    {
      type: String,
    },
  ],
  images: [
    {
      url: String,
      caption: String,
    },
  ],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
propertySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Property", propertySchema);
