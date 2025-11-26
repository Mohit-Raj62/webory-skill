"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Code2, Database, Globe, Palette, Terminal, Cpu, Cloud, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    },
    {
        _id: "2",
        title: "UI/UX Design",
        icon: "Palette",
        level: "Intermediate",
        studentsCount: "1.8k+",
        color: "from-purple-500 to-pink-500",
        description: "Learn design principles, Figma, and create stunning interfaces.",
    },
    {
        _id: "3",
        title: "Data Science",
        icon: "Database",
        level: "Advanced",
        studentsCount: "2.5k+",
        color: "from-blue-500 to-cyan-500",
        description: "Master the MERN stack and build scalable web applications.",
    },

];

const iconMap: any = {
    Globe, Palette, Database, Code2, Cloud, Shield, Terminal, Cpu
};

export default function CoursesPage() {
    const [courses, setCourses] = useState < any[] > ([]);
    const [enrolled, setEnrolled] = useState < string[] > ([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const resCourses = await fetch("/api/courses");
                if (resCourses.ok) {
                    const data = await resCourses.json();
                    if (data.courses && data.courses.length > 0) {
                        setCourses(data.courses);
                    } else {
                        setCourses(fallbackCourses);
                    }
                } else {
                    setCourses(fallbackCourses);
                }

                // Fetch user enrollments
                const resUser = await fetch("/api/user/dashboard");
                if (resUser.ok) {
                    const data = await resUser.json();
                    setEnrolled(data.enrollments.map((e: any) => e.course._id));
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                setCourses(fallbackCourses);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getIcon = (iconName: string) => {
        const Icon = iconMap[iconName] || Code2;
        return <Icon className="text-white" size={28} />;
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Explore Our <span className="text-blue-400">Courses</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Unlock your potential with industry-relevant courses designed to get you hired.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-white">Loading courses...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <div key={index} className="glass-card rounded-2xl group hover:-translate-y-2 transition-transform duration-300 flex flex-col overflow-hidden">
                                {/* Thumbnail or Icon */}
                                {course.thumbnail ? (
                                    <div className="w-full h-48 overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className={`w-full h-48 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                                        <div className="text-white opacity-50">
                                            {getIcon(course.icon)}
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-3">{course.title}</h3>
                                    <p className="text-gray-400 mb-6 line-clamp-2 flex-grow">{course.description}</p>

                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{course.level}</span>
                                        <span>{course.studentsCount} Students</span>
                                    </div>

                                    {/* Pricing Display */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Discounted Price */}
                                            <span className="text-3xl font-bold text-white">
                                                ₹{course.discountPercentage > 0 && course.originalPrice > 0
                                                    ? Math.round(course.originalPrice * (1 - course.discountPercentage / 100))
                                                    : course.price || 0}
                                            </span>

                                            {/* Original Price & Badge (if discount exists) */}
                                            {course.discountPercentage > 0 && course.originalPrice > 0 && (
                                                <>
                                                    <span className="text-gray-500 line-through text-lg">
                                                        ₹{course.originalPrice}
                                                    </span>
                                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold border border-green-500/30">
                                                        {course.discountPercentage}% off
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {enrolled.includes(course._id) ? (
                                        <Button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/50">
                                            <CheckCircle className="mr-2 h-4 w-4" /> Enrolled
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => router.push(`/courses/${course._id}`)}
                                            className="w-full bg-white/10 hover:bg-white/20 border border-white/10"
                                        >
                                            View Details
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
