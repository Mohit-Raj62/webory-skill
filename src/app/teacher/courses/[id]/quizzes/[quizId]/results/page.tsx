"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function QuizResultsPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const quizId = params.quizId as string;

    const [attempts, setAttempts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState<any>(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            // Fetch quiz details
            const resQuiz = await fetch(`/api/teacher/courses/${courseId}/quizzes/${quizId}`);
            if (resQuiz.ok) {
                const quizData = await resQuiz.json();
                setQuiz(quizData.quiz);
            }

            // TODO: Fetch all attempts for this quiz
            // For now, showing placeholder
            setAttempts([]);
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href={`/teacher/courses/${courseId}/quizzes`}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Quizzes
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Quiz Results</h1>
                <p className="text-gray-400">View all student attempts</p>
            </div>

            {loading ? (
                <div className="text-white">Loading results...</div>
            ) : (
                <>
                    {quiz && (
                        <div className="glass-card p-6 rounded-2xl mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">{quiz.title}</h2>
                            <div className="flex gap-6 text-sm text-gray-300">
                                <span>{quiz.questions.length} questions</span>
                                <span>{quiz.duration} minutes</span>
                                <span>{quiz.totalMarks} marks</span>
                                <span>Pass: {quiz.passingScore}%</span>
                            </div>
                        </div>
                    )}

                    {attempts.length === 0 ? (
                        <div className="glass-card p-12 rounded-2xl text-center">
                            <p className="text-gray-400">No attempts yet</p>
                            <p className="text-sm text-gray-500 mt-2">Students haven't taken this quiz</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {attempts.map((attempt) => (
                                <div key={attempt._id} className="glass-card p-6 rounded-2xl">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                                <User className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Student Name</h3>
                                                <p className="text-gray-400 text-sm">student@example.com</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white mb-1">
                                                {attempt.obtainedMarks}/{attempt.totalMarks}
                                            </div>
                                            <div className={`text-sm ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                {attempt.percentage}% - {attempt.passed ? 'PASSED' : 'FAILED'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
