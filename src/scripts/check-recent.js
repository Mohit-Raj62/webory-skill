const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkRecent() {
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

    // Check for activities in the last 20 minutes
    const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000);

    const recentActivities = await Activity.find({
      type: "course_viewed",
      date: { $gte: twentyMinsAgo },
    }).sort({ date: -1 });

    console.log(`Found ${recentActivities.length} activities in last 20 mins.`);

    recentActivities.forEach((act, i) => {
      console.log(
        `[${i}] Time: ${act.date}, Student: ${act.student}, Course: ${act.metadata?.courseName}`,
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkRecent();
