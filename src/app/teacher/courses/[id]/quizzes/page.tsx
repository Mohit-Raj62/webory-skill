"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";

interface Quiz {
    _id: string;
    title: string;
    description: string;
    type: string;
    duration: number;
    totalMarks: number;
    passingScore: number;
    questions: any[];
    isActive: boolean;
}

export default function QuizzesListPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch(`/api/teacher/courses/${courseId}/quizzes`);
            if (res.ok) {
                const data = await res.json();
                setQuizzes(data.quizzes);
            }
        } catch (error) {
            console.error("Failed to fetch quizzes", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteQuiz = async (quizId: string) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        try {
            // Note: We might need to implement the DELETE endpoint for individual quizzes as well
            // For now, assuming it follows the same pattern or we need to create it.
            // Since I haven't created the specific DELETE endpoint for quizzes yet, this might fail if not implemented.
            // I will implement the DELETE endpoint in a subsequent step if needed, but for now let's point to where it should be.
            const res = await fetch(`/api/teacher/courses/${courseId}/quizzes/${quizId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Quiz deleted successfully");
                fetchQuizzes();
            } else {
                alert("Failed to delete quiz");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete quiz");
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
                        <h1 className="text-4xl font-bold text-white mb-2">Quizzes & Tests</h1>
                        <p className="text-gray-400">Manage course assessments</p>
                    </div>
                    <Link href={`/teacher/courses/${courseId}/quizzes/new`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <Plus size={20} className="mr-2" />
                            Create Quiz
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-white">Loading quizzes...</div>
            ) : quizzes.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <p className="text-gray-400 mb-4">No quizzes created yet</p>
                    <Link href={`/teacher/courses/${courseId}/quizzes/new`}>
                        <Button>Create Your First Quiz</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="glass-card p-6 rounded-2xl">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-white">{quiz.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${quiz.type === "exam" ? "bg-red-500/20 text-red-300" :
                                                quiz.type === "test" ? "bg-yellow-500/20 text-yellow-300" :
                                                    "bg-blue-500/20 text-blue-300"
                                            }`}>
                                            {quiz.type.toUpperCase()}
                                        </span>
                                    </div>

                                    {quiz.description && (
                                        <p className="text-gray-400 mb-3">{quiz.description}</p>
                                    )}

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                        <span>📝 {quiz.questions.length} Questions</span>
                                        <span>⏱️ {quiz.duration} minutes</span>
                                        <span>📊 {quiz.totalMarks} marks</span>
                                        <span>✅ Pass: {quiz.passingScore}%</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/teacher/courses/${courseId}/quizzes/${quiz._id}/results`)}
                                    >
                                        <Users size={16} className="mr-1" />
                                        Results
                                    </Button>
                                    {/* Edit functionality to be implemented later if needed */}
                                    {/* <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/teacher/courses/${courseId}/quizzes/${quiz._id}/edit`)}
                                    >
                                        <Edit size={16} />
                                    </Button> */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => deleteQuiz(quiz._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
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
