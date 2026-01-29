const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedData() {
  if (!MONGODB_URI) {
    console.error("No MONGODB_URI found");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    // 1. Seed a Lead
    const LeadSchema = new mongoose.Schema({
      name: String,
      phone: String,
      courseId: String,
      pageUrl: String,
      status: { type: String, default: "new" },
      createdAt: { type: Date, default: Date.now },
    });
    const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

    await Lead.create({
      name: "Test User Lead",
      phone: "9999999999",
      courseId: "12345",
      pageUrl: "http://localhost:3000/courses/test",
      status: "new",
    });
    console.log("Seeded 1 Lead");

    // 2. Seed an Activity (Interest)
    // We need a valid user ID for this to show up correctly with lookup
    // Let's try to find a user first
    const UserSchema = new mongoose.Schema({ email: String });
    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const user = await User.findOne();

    if (user) {
      const ActivitySchema = new mongoose.Schema({
        student: mongoose.Schema.Types.ObjectId,
        type: String,
        category: String,
        relatedId: mongoose.Schema.Types.ObjectId,
        metadata: Object,
        date: { type: Date, default: Date.now },
      });
      const Activity =
        mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

      await Activity.create({
        student: user._id,
        type: "course_viewed",
        category: "course",
        relatedId: new mongoose.Types.ObjectId(), // Random ID
        metadata: { courseName: "Manual Seeded Course" },
        date: new Date(),
      });
      console.log("Seeded 1 Activity for user: " + user.email);
    } else {
      console.log("No users found to attach activity to.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();
