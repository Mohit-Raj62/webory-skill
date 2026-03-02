const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const CourseSchema = new mongoose.Schema({
  title: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coInstructors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Find a course with coInstructors
  const sample = await Course.findOne({
    coInstructors: { $exists: true, $not: { $size: 0 } },
  });
  if (!sample) {
    console.log("No shared courses found.");
    process.exit(0);
  }

  console.log(
    "Found shared course:",
    sample._id,
    "with coInstructors:",
    sample.coInstructors,
  );

  const targetCoInstructor = sample.coInstructors[0].toString();
  console.log("Testing query for coInstructor string ID:", targetCoInstructor);

  // Test query 1: simple array match
  const test1 = await Course.findOne({
    _id: sample._id,
    $or: [
      { instructor: targetCoInstructor },
      { coInstructors: targetCoInstructor },
    ],
  });
  console.log(
    "Query 1 (simple array match) Result:",
    test1 ? "SUCCESS" : "FAIL",
  );

  // Test query 2: $in match
  const test2 = await Course.findOne({
    _id: sample._id,
    $or: [
      { instructor: targetCoInstructor },
      { coInstructors: { $in: [targetCoInstructor] } },
    ],
  });
  console.log("Query 2 ($in match) Result:", test2 ? "SUCCESS" : "FAIL");

  process.exit(0);
}

run().catch(console.error);
