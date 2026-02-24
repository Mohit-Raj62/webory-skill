const express = require("express");
const Property = require("../models/Property");
const router = express.Router();

// Get all properties with filtering
router.get("/", async (req, res) => {
  try {
    const {
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
    } = req.query;

    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query["location.city"] = new RegExp(city, "i");
    if (state) query["location.state"] = new RegExp(state, "i");
    if (bedrooms) query["features.bedrooms"] = { $gte: parseInt(bedrooms) };
    if (bathrooms) query["features.bathrooms"] = { $gte: parseInt(bathrooms) };
    if (minPrice) query.price = { ...query.price, $gte: parseInt(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseInt(maxPrice) };

    const properties = await Property.find(query)
      .populate("agent", "name email phone")
      .sort("-createdAt");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single property
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agent",
      "name email phone"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new property
router.post("/", async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update property
router.put("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete property
router.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
