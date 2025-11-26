const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skill-webory";

async function listUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
        console.log(`- ID: ${u._id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.firstName} ${u.lastName}`);
    });

    const internships = await mongoose.connection.db.collection('internships').find({}).toArray();
    if (internships.length > 0) {
        console.log(`Sample Internship ID: ${internships[0]._id}`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

listUsers();
