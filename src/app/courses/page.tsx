import { getUser } from "@/lib/get-user";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { CoursesView } from "@/components/courses/courses-view";

export const dynamic = "force-dynamic";

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

async function getCoursesData() {
    try {
        await dbConnect();
        
        // Use aggregation to calculate student count from enrollments
        // Logic copied from /api/courses/route.ts
        const courses = await Course.aggregate([
            { $match: { isAvailable: true } },
            {
                $lookup: {
                    from: "enrollments",
                    localField: "_id",
                    foreignField: "course",
                    as: "enrollments",
                },
            },
            {
                $addFields: {
                    studentsCount: { $size: "$enrollments" },
                },
            },
            {
                $project: {
                    enrollments: 0, 
                },
            },
        ]);

        return JSON.parse(JSON.stringify(courses));
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return null;
    }
}

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
    const user = await getUser();
    const coursesData = await getCoursesData();
    let enrolledCourseIds: string[] = [];

    if (user) {
        enrolledCourseIds = await getUserEnrollments(user._id);
    }

    const courses = (coursesData && coursesData.length > 0) ? coursesData : fallbackCourses;

    return <CoursesView courses={courses} enrolledCourseIds={enrolledCourseIds} />;
}
