const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkData() {
  if (!MONGODB_URI) {
    console.error("No MONGODB_URI found");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    // Inline schema
    const ActivitySchema = new mongoose.Schema({
      student: { type: mongoose.Schema.Types.Mixed }, // Use Mixed to see if it's string or ObjectId
      type: String,
      category: String,
      relatedId: mongoose.Schema.Types.Mixed,
      metadata: Object,
      date: Date,
    });
    const Activity =
      mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

    // Count all
    const total = await Activity.countDocuments();
    console.log(`Total Activities: ${total}`);

    // Count course_viewed
    const viewedCount = await Activity.countDocuments({
      type: "course_viewed",
    });
    console.log(`Course Views: ${viewedCount}`);

    if (viewedCount > 0) {
      const sample = await Activity.findOne({ type: "course_viewed" });
      console.log("Sample Activity:", JSON.stringify(sample, null, 2));
      console.log("Student Type:", typeof sample.student);
      console.log("RelatedId Type:", typeof sample.relatedId);
      if (sample.student && sample.student.constructor) {
        console.log("Student Constructor:", sample.student.constructor.name);
      }
    } else {
      console.log(
        "No course_viewed activities found. Tracking API might be failing silently or not being called.",
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkData();
