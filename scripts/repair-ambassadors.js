const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function repair() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to Database");

    const Ambassador = mongoose.connection.collection("ambassadors");

    // Find documents without a category or with invalid category
    const result = await Ambassador.updateMany(
      { $or: [{ category: { $exists: false } }, { category: null }, { category: "" }] },
      { $set: { category: "student" } }
    );

    console.log("🛠️  Repair Summary:");
    console.log(`- Matched: ${result.matchedCount}`);
    console.log(`- Modified: ${result.modifiedCount}`);
    console.log("✅ Repair completed successfully!");

  } catch (error) {
    console.error("❌ Repair failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

repair().catch(console.error);
