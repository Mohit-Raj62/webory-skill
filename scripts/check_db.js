const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skill-webory";

async function checkDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users`);
    if (users.length > 0) {
        console.log("Sample User:", users[0]._id, users[0].email, users[0].role);
    }

    const applications = await mongoose.connection.db.collection('applications').find({}).toArray();
    console.log(`Found ${applications.length} applications`);
    applications.forEach(app => {
        console.log(`App ID: ${app._id}, Student: ${app.student}, Status: ${app.status}`);
    });

    const internships = await mongoose.connection.db.collection('internships').find({}).toArray();
    console.log(`Found ${internships.length} internships`);
    if (internships.length > 0) {
        console.log("Sample Internship:", internships[0]._id, internships[0].title);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDb();
