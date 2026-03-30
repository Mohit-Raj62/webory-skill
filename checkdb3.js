const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

require("./src/models/Hackathon");
require("./src/models/CustomCertificate");
const HackathonSubmission = require("./src/models/HackathonSubmission").default;
const CustomCertificate = mongoose.models.CustomCertificate;

async function test() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  try {
    const cert = await CustomCertificate.findOne().lean();
    if (cert) {
        console.log("Found Cert:", cert.certificateId);
        const sub = await HackathonSubmission.findOne({ certificateId: cert._id }).populate("hackathonId").lean();
        console.log("Found Sub:", sub ? sub._id : "none");
    }
  } catch(e) {
      console.error("Crash:", e.message);
  }
  process.exit(0);
}

test().catch(console.error);
