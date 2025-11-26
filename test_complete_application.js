// Script to check and update an application to 'completed' status for testing
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const Application = require('./src/models/Application').default;

async function markApplicationAsCompleted() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an accepted application
    const application = await Application.findOne({ status: 'accepted' })
      .populate('student')
      .populate('internship');

    if (!application) {
      console.log('No accepted applications found. Please accept an application first from the admin panel.');
      process.exit(0);
    }

    console.log('Found application:', {
      id: application._id,
      student: `${application.student.firstName} ${application.student.lastName}`,
      internship: application.internship.title,
      status: application.status
    });

    // Update to completed
    application.status = 'completed';
    application.completedAt = new Date();
    application.certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    await application.save();

    console.log('\n✅ Application marked as completed!');
    console.log('Certificate ID:', application.certificateId);
    console.log('Completed At:', application.completedAt);
    console.log('\nNow you can view the certificate from the student profile.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

markApplicationAsCompleted();
