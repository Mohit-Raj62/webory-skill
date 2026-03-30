const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  const HackathonSubmission = mongoose.connection.collection("hackathonsubmissions");
  const CustomCertificate = mongoose.connection.collection("customcertificates");

  const subs = await HackathonSubmission.find({ status: { $in: ["winner", "participated"] } }).toArray();
  console.log("Submissions with status winner/participated:", subs.length);
  
  if (subs.length > 0) {
    console.log("First submission:", subs[0]);
    if (subs[0].certificateId) {
      const cert = await CustomCertificate.findOne({ _id: subs[0].certificateId });
      console.log("Linked certificate:", cert);
    } else {
        console.log("No certificateId attached to submission!");
    }
  }

  process.exit(0);
}

check().catch(console.error);
