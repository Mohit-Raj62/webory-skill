const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const Application = mongoose.models.Application || mongoose.model("Application", new mongoose.Schema({}, { strict: false }));
  
  // Find applications that are accepted and change to interview_pending
  const result = await Application.updateMany(
    { status: "accepted" },
    { $set: { status: "interview_pending" } }
  );
  
  console.log("Updated applications:", result);
  process.exit(0);
}

fix();
