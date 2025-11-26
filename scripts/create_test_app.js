const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skill-webory";

async function createTestApplication() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    // 1. Find a student
    const student = await mongoose.connection.db.collection('users').findOne({ role: 'student' });
    if (!student) {
        console.error("No student user found!");
        return;
    }
    console.log(`Found Student: ${student.email} (ID: ${student._id})`);

    // 2. Find an internship
    const internship = await mongoose.connection.db.collection('internships').findOne({});
    if (!internship) {
        console.error("No internship found!");
        return;
    }
    console.log(`Found Internship: ${internship.title} (ID: ${internship._id})`);

    // 3. Create Application
    const application = {
        student: student._id,
        internship: internship._id,
        status: 'accepted',
        appliedAt: new Date(),
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'This is a test application created by AI.',
        startDate: new Date(),
        duration: '6 months'
    };

    const result = await mongoose.connection.db.collection('applications').insertOne(application);
    console.log(`Created Application with ID: ${result.insertedId}`);
    console.log("Status: accepted");
    console.log("Duration: 6 months");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestApplication();
