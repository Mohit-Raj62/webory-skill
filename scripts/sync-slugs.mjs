import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') }); // In case of local

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const CourseSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, sparse: true },
}, { strict: false });

const InternshipSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, sparse: true },
}, { strict: false });

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
const Internship = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const courses = await Course.find({});
  let courseUpdates = 0;
  for (const course of courses) {
    if (!course.slug) {
      course.slug = generateSlug(course.title);
      await course.save();
      courseUpdates++;
    }
  }
  console.log(`Updated ${courseUpdates} courses with slugs.`);

  const internships = await Internship.find({});
  let internshipUpdates = 0;
  for (const internship of internships) {
    if (!internship.slug) {
      internship.slug = generateSlug(internship.title);
      await internship.save();
      internshipUpdates++;
    }
  }
  console.log(`Updated ${internshipUpdates} internships with slugs.`);

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(console.error);
