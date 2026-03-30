const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

// Load models
require("./src/models/User");
require("./src/models/Hackathon");
require("./src/models/CustomCertificate");
const HackathonSubmission = require("./src/models/HackathonSubmission").default;

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  const userId = "69347a7661ea18652ef9a1c3"; // from earlier query

  try {
    const submissions = await HackathonSubmission.find({ 
        userId, 
        certificateId: { $exists: true, $ne: null } 
    })
    .populate("hackathonId")
    .populate("certificateId")
    .sort({ createdAt: -1 });

    console.log("Found populated submissions:", JSON.stringify(submissions, null, 2));

  } catch(e) {
      console.error(e);
  }

  process.exit(0);
}

check().catch(console.error);
