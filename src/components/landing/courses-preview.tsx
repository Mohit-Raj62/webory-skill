"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, Globe, Palette, BookOpen } from "lucide-react";

interface PopularCourse {
    _id: string;
    title: string;
    level: string;
    studentsCount: string;
    color: string;
    icon?: string; // Icon name string if coming from DB, or component hardcoded
}

interface CoursesPreviewProps {
    popularCourses?: any[]; // Using any[] for now to map DB fields to UI
}

// Fallback data if no popular courses found
const fallbackCourses = [
    {
        title: "Full Stack Development",
        icon: Globe,
        level: "Advanced",
        studentsCount: "10+",
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "UI/UX Design",
        icon: Palette,
        level: "Intermediate",
        studentsCount: "10+",
        color: "from-purple-500 to-pink-500",
    },
    {
        title: "Backend Architecture",
        icon: Database,
        level: "Advanced",
        studentsCount: "10+",
        color: "from-orange-500 to-red-500",
    },
    {
        title: "Frontend Mastery",
        icon: Code2,
        level: "Beginner",
        studentsCount: "10+",
        color: "from-green-500 to-emerald-500",
    },
];

const getIcon = (iconName: string) => {
    switch(iconName) {
        case "Code2": return Code2;
        case "Database": return Database;
        case "Palette": return Palette;
        case "Globe": return Globe;
        default: return BookOpen;
    }
};

export function CoursesPreview({ popularCourses = [] }: CoursesPreviewProps) {
    const displayCourses = popularCourses.length > 0 ? popularCourses : fallbackCourses;

    return (
        <section id="courses" className="py-20 bg-black/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Popular Courses</h2>
                        <p className="text-gray-400">Master in-demand skills with our expert-led curriculum.</p>
                    </div>
                    <Link href="/courses" className="hidden md:flex">
                        <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                            View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayCourses.map((course, index) => {
                         const Icon = course.icon && typeof course.icon === 'string' ? getIcon(course.icon) : (course.icon || BookOpen);
                         
                        return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-2xl group cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <Icon className="text-white" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                            <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                                <span>{course.level}</span>
                                <span>{course.studentsCount || course.students} Students</span>
                            </div>
                        </motion.div>
                    )})}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/courses">
                        <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                            View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
