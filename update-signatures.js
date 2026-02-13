// Script to update course signatures to use the new credential field structure
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function updateCourseSignatures() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const coursesCollection = db.collection("courses");

    // Update all courses to have the correct signature structure
    const result = await coursesCollection.updateMany(
      {},
      {
        $set: {
          "signatures.founder.name": "Mohit Sinha",
          "signatures.founder.title": "Founder & CEO",
          "signatures.director.name": "Vijay Kumar",
          "signatures.director.title": "Director of Education, Webory",
          "signatures.director.credential": "Alumnus, IIT Mandi",
        },
      },
    );

    console.log(`Updated ${result.modifiedCount} courses`);

    // Show updated courses
    const courses = await coursesCollection
      .find({})
      .project({ title: 1, signatures: 1 })
      .limit(3)
      .toArray();
    console.log("\nSample courses after update:");
    console.log(JSON.stringify(courses, null, 2));

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateCourseSignatures();
