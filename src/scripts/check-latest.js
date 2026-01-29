const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkLatest() {
  if (!MONGODB_URI) {
    console.error("No MONGODB_URI found");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const ActivitySchema = new mongoose.Schema({
      student: mongoose.Schema.Types.Mixed,
      type: String,
      category: String,
      relatedId: mongoose.Schema.Types.Mixed,
      metadata: Object,
      date: Date,
    });
    const Activity =
      mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

    // Get all course_viewed
    const activities = await Activity.find({ type: "course_viewed" })
      .sort({ date: -1 })
      .limit(10);

    console.log(`Found ${activities.length} 'course_viewed' activities.`);

    activities.forEach((act, i) => {
      console.log(
        `[${i}] Date: ${act.date}, StudentID: ${act.student} (${typeof act.student}), Course: ${act.metadata?.courseName}`,
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkLatest();
