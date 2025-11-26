// Quick script to update existing courses with discount fields
// Run this once to add originalPrice and discountPercentage to all courses

import dbConnect from "@/lib/db";
import Course from "@/models/Course";

async function updateCourses() {
  await dbConnect();

  try {
    // Update all courses that don't have originalPrice/discountPercentage
    const result = await Course.updateMany(
      {
        $or: [
          { originalPrice: { $exists: false } },
          { discountPercentage: { $exists: false } }
        ]
      },
      {
        $set: {
          originalPrice: 0,
          discountPercentage: 0
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses with discount fields`);
    
    // List all courses
    const courses = await Course.find({});
    console.log('\nCurrent courses:');
    courses.forEach(course => {
      console.log(`- ${course.title}: price=${course.price}, originalPrice=${course.originalPrice}, discount=${course.discountPercentage}%`);
    });
    
  } catch (error) {
    console.error('❌ Error updating courses:', error);
  }
}

updateCourses();
