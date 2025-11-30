"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AssignmentsListPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`/api/teacher/courses/${courseId}/assignments`);
            if (res.ok) {
                const data = await res.json();
                setAssignments(data.assignments);
            }
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href="/teacher/courses">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Courses
                    </Button>
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Assignments</h1>
                        <p className="text-gray-400">Manage course assignments</p>
                    </div>
                    <Link href={`/teacher/courses/${courseId}/assignments/new`}>
                        <Button className="bg-gradient-to-r from-green-600 to-blue-600">
                            <Plus size={20} className="mr-2" />
                            Create Assignment
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-white">Loading assignments...</div>
            ) : assignments.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <p className="text-gray-400 mb-4">No assignments created yet</p>
                    <Link href={`/teacher/courses/${courseId}/assignments/new`}>
                        <Button>Create Your First Assignment</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {assignments.map((assignment) => (
                        <div key={assignment._id} className="glass-card p-6 rounded-2xl">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">{assignment.title}</h3>
                                    <p className="text-gray-400 mb-3">{assignment.description}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText size={16} />
                                            {assignment.totalMarks} marks
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/teacher/courses/${courseId}/assignments/${assignment._id}/submissions`)}
                                    >
                                        View Submissions
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
