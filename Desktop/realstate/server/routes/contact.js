const express = require("express");
const router = express.Router();

// Handle contact form submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    // Here you would typically:
    // 1. Save the contact form to database
    // 2. Send email notification
    // 3. Notify the agent
    // For now, we'll just return a success message

    res.status(200).json({
      message: "Contact form submitted successfully",
      data: { name, email, phone, message, propertyId },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
