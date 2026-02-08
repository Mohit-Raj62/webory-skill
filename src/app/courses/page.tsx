import { getUser } from "@/lib/get-user";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { CoursesView } from "@/components/courses/courses-view";
import { unstable_cache } from "next/cache";

// Remove force-dynamic to allow caching
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
    {
        _id: "3",
        title: "Data Science",
        icon: "Database",
        level: "Advanced",
        studentsCount: "2.5k+",
        color: "from-blue-500 to-cyan-500",
        description: "Master the MERN stack and build scalable web applications.",
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

            return JSON.parse(JSON.stringify(courses));
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            return null;
        }
    },
    ['courses-list'],
    { revalidate: 300, tags: ['courses'] }
);

async function getUserEnrollments(userId: string) {
    try {
        await dbConnect();
        const enrollments = await Enrollment.find({ student: userId }).select("course").lean();
        return enrollments.map((e: any) => e.course.toString());
    } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        return [];
    }
}

export default async function CoursesPage() {
    // User check is dynamic, but coursesData is now cached
    const user = await getUser();
    const coursesData = await getCachedCoursesData();
    let enrolledCourseIds: string[] = [];

    if (user) {
        enrolledCourseIds = await getUserEnrollments(user._id);
    }

    const courses = (coursesData && coursesData.length > 0) ? coursesData : fallbackCourses;

    return <CoursesView courses={courses} enrolledCourseIds={enrolledCourseIds} />;
}
