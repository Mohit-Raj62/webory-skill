import { getUser } from "@/lib/get-user";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { CoursesView } from "@/components/courses/courses-view";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// export const dynamic = "force-dynamic";
export const revalidate = 300; // Keep revalidate for ISR

// Fallback data if API fails or DB is empty
const fallbackCourses = [
    {
        _id: "1",
        title: "Full Stack Development",
        icon: "Globe",
        level: "Advanced",
        studentsCount: "2.5k+",
        color: "from-blue-500 to-cyan-500",
        description: "Master the MERN stack and build scalable web applications.",
        price: 0,
        discountPercentage: 0
    },
    {
        _id: "2",
        title: "UI/UX Design",
        icon: "Palette",
        level: "Intermediate",
        studentsCount: "1.8k+",
        color: "from-purple-500 to-pink-500",
        description: "Learn design principles, Figma, and create stunning interfaces.",
        price: 0,
        discountPercentage: 0
    },
];

// Cache the courses data to avoid expensive aggregations on every request
const getCachedCoursesData = unstable_cache(
    async () => {
        try {
            await dbConnect();
            
            // Use optimized aggregation for student count
            const courses = await Course.aggregate([
                { $match: { isAvailable: true } },
                // Only select fields needed for the listing cards
                { 
                    $project: { 
                        title: 1, 
                        icon: 1, 
                        level: 1, 
                        color: 1, 
                        description: 1, 
                        price: 1, 
                        originalPrice: 1,
                        discountPercentage: 1, 
                        thumbnail: 1 
                    } 
                },
                {
                    $lookup: {
                        from: "enrollments",
                        let: { courseId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$course", "$$courseId"] } } },
                            { $count: "count" }
                        ],
                        as: "enrollmentCount",
                    },
                },
                {
                    $addFields: {
                        studentsCount: { $ifNull: [{ $arrayElemAt: ["$enrollmentCount.count", 0] }, 0] },
                    },
                },
                {
                    $project: {
                        enrollmentCount: 0, 
                    },
                },
            ]);

            return courses; // Aggregate returns plain objects
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            return null;
        }
    },
    ['courses-list'],
    { revalidate: 300, tags: ['courses'] }
);

// Cache user enrollments per user ID
const getCachedUserEnrollments = unstable_cache(
    async (userId: string) => {
        try {
            await dbConnect();
            const enrollments = await Enrollment.find({ student: userId })
                .select("course")
                .lean();
            return enrollments.map((e: any) => e.course.toString());
        } catch (error) {
            console.error("Failed to fetch enrollments:", error);
            return [];
        }
    },
    ['user-enrollments'],
    { revalidate: 3600, tags: ['user-enrollments'] } // Cache for 1 hour, revalidate on change
);

export default async function CoursesPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId: string | null = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            userId = decoded.userId;
        } catch (e) {
            // Silently fail if JWT is invalid
        }
    }

    // Parallel fetch of User, Cached Courses, and Enrollments
    const [user, coursesData, enrolledCourseIds] = await Promise.all([
        getUser(),
        getCachedCoursesData(),
        userId ? getCachedUserEnrollments(userId) : Promise.resolve([])
    ]);

    const courses = (coursesData && coursesData.length > 0) ? coursesData : fallbackCourses;

    return <CoursesView courses={courses} enrolledCourseIds={enrolledCourseIds as string[]} />;
}
