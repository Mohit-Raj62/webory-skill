require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");

  const EmployeeVerificationSchema = new mongoose.Schema({}, { strict: false });
  const Model =
    mongoose.models.EmployeeVerification ||
    mongoose.model("EmployeeVerification", EmployeeVerificationSchema);

  const all = await Model.find({}).lean();
  console.log(
    "ALL IDS:",
    all.map((r) => r.employeeId),
  );

  process.exit(0);
}

test();
