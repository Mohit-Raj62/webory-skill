"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EnrolledCourses() {
    const [enrolledCourses, setEnrolledCourses] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrolled = async () => {
            try {
                const res = await fetch("/api/user/dashboard");
                if (res.ok) {
                    const data = await res.json();
                    setEnrolledCourses(data.enrollments || []);
                }
            } catch (error) {
                console.error("Failed to fetch enrolled courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrolled();
    }, []);

    if (loading || enrolledCourses.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Your <span className="text-blue-400">Enrolled Courses</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400">Continue learning from where you left off</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {enrolledCourses.slice(0, 3).map((enrollment: any, index: number) => (
                        <motion.div
                            key={enrollment._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-4 md:p-6 rounded-2xl hover:border-blue-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                                    Enrolled
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {enrollment.course?.title || "Course"}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {enrollment.course?.description || "Continue your learning journey"}
                            </p>

                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <Clock size={16} className="mr-2" />
                                Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                            </div>

                            <Link href={`/courses/${enrollment.course?._id}`}>
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
                                    Continue Learning
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {enrolledCourses.length > 3 && (
                    <div className="text-center mt-8">
                        <Link href="/profile">
                            <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                                View All Courses
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
