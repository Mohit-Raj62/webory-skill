import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.weboryskills.in"; // Using your production domain

  // Connect to database
  await dbConnect();

  // Fetch all courses
  // Fetch all courses
  const courses = await Course.find({}).select("_id title updatedAt").lean();

  // Fetch all internships
  const internships = await Internship.find({})
    .select("_id title updatedAt")
    .lean();

  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.title.toLowerCase().replace(/ /g, "-")}-${
      course._id
    }`,
    lastModified: course.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const internshipUrls = internships.map((internship) => ({
    url: `${baseUrl}/internships/${internship.title
      .toLowerCase()
      .replace(/ /g, "-")}-${internship._id}`,
    lastModified: internship.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internships`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...courseUrls,
    ...internshipUrls,
  ];
}
