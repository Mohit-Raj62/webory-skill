// Test script to check certificate eligibility
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testCertificateEligibility() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const Enrollment = require('./src/models/Enrollment').default;
    const User = require('./src/models/User').default;
    const Course = require('./src/models/Course').default;

    // Find all enrollments
    const enrollments = await Enrollment.find({})
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .lean();

    console.log('\n=== ENROLLMENTS ===');
    enrollments.forEach((enrollment, index) => {
      console.log(`\n${index + 1}. Student: ${enrollment.student?.firstName} ${enrollment.student?.lastName}`);
      console.log(`   Course: ${enrollment.course?.title}`);
      console.log(`   Progress: ${enrollment.progress}%`);
      console.log(`   Completed: ${enrollment.completed}`);
      console.log(`   Enrollment ID: ${enrollment._id}`);
      console.log(`   Course ID: ${enrollment.course?._id}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testCertificateEligibility();
