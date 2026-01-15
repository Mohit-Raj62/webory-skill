"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Code2, Database, Globe, Palette, Terminal, Cpu, Cloud, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const iconMap: any = {
    Globe, Palette, Database, Code2, Cloud, Shield, Terminal, Cpu
};

interface CoursesViewProps {
    courses: any[];
    enrolledCourseIds: string[];
}

export function CoursesView({ courses, enrolledCourseIds }: CoursesViewProps) {
    // We can rely on props for initial data, but if we wanted to support real-time updates we might keep state.
    // For now, let's just use the props directly as the source of truth for rendering.
    // If further interaction changes these lists (e.g. valid enrollment without refresh), we might need state.
    // Given the current architecture (enrollment -> payment -> redirect), a refresh/redirect happens anyway.
    
    // However, the original code had `enrolled` in state. Let's keep it simple.
    
    const router = useRouter();

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
                                <div className={`w-full h-48 bg-gradient-to-br ${course.color || "from-blue-500 to-cyan-500"} flex items-center justify-center`}>
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

                                {enrolledCourseIds.includes(course._id) ? (
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
            </div>

            <Footer />
        </main>
    );
}
