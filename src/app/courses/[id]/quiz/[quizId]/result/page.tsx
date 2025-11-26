"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, Clock } from "lucide-react";
import Link from "next/link";

interface Answer {
    questionIndex: number;
    answer: number;
    isCorrect: boolean;
    marksObtained: number;
    correctAnswer?: number;
    explanation?: string;
    questionText?: string;
    options?: string[];
}

interface Result {
    obtainedMarks: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    answers: Answer[];
}

export default function QuizResultPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const courseId = params.id as string;
    const quizId = params.quizId as string;

    const [result, setResult] = useState < Result | null > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real implementation, fetch result by attemptId
        // For now, we'll get it from the previous page's navigation state
        const resultData = sessionStorage.getItem('quizResult');
        if (resultData) {
            setResult(JSON.parse(resultData));
            sessionStorage.removeItem('quizResult');
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading results...</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white mb-4">No results found</p>
                    <Link href={`/courses/${courseId}`}>
                        <Button>Back to Course</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                {/* Score Card */}
                <div className={`glass-card p-8 rounded-2xl mb-6 ${result.passed ? 'border-2 border-green-500/50' : 'border-2 border-red-500/50'
                    }`}>
                    <div className="text-center">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                            {result.passed ? (
                                <Trophy className="text-green-400" size={40} />
                            ) : (
                                <XCircle className="text-red-400" size={40} />
                            )}
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-2">
                            {result.passed ? 'Congratulations!' : 'Keep Trying!'}
                        </h1>

                        <p className="text-gray-400 mb-6">
                            {result.passed ? 'You passed the quiz!' : 'You can retake the quiz to improve your score'}
                        </p>

                        <div className="flex justify-center gap-8 mb-6">
                            <div>
                                <p className="text-gray-400 text-sm">Score</p>
                                <p className="text-3xl font-bold text-white">
                                    {result.obtainedMarks}/{result.totalMarks}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Percentage</p>
                                <p className="text-3xl font-bold text-white">
                                    {result.percentage.toFixed(1)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Correct</p>
                                <p className="text-3xl font-bold text-white">
                                    {result.answers.filter(a => a.isCorrect).length}/{result.answers.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Link href={`/courses/${courseId}`}>
                                <Button variant="outline">Back to Course</Button>
                            </Link>
                            <Link href={`/courses/${courseId}/quiz/${quizId}`}>
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                                    Retake Quiz
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Answers Review */}
                {result.answers[0]?.questionText && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white mb-4">Review Answers</h2>

                        {result.answers.map((answer, index) => (
                            <div key={index} className="glass-card p-6 rounded-2xl">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${answer.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}>
                                        {answer.isCorrect ? (
                                            <CheckCircle className="text-green-400" size={24} />
                                        ) : (
                                            <XCircle className="text-red-400" size={24} />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-white font-medium mb-2">
                                            Q{index + 1}. {answer.questionText}
                                        </h3>

                                        {answer.options && (
                                            <div className="space-y-2 mb-3">
                                                {answer.options.map((option, optIndex) => (
                                                    <div
                                                        key={optIndex}
                                                        className={`p-3 rounded-lg ${optIndex === answer.correctAnswer
                                                                ? 'bg-green-500/20 border-2 border-green-500/50'
                                                                : optIndex === answer.answer && !answer.isCorrect
                                                                    ? 'bg-red-500/20 border-2 border-red-500/50'
                                                                    : 'bg-white/5'
                                                            }`}
                                                    >
                                                        <span className="text-white">{option}</span>
                                                        {optIndex === answer.correctAnswer && (
                                                            <span className="ml-2 text-green-400 text-sm">✓ Correct</span>
                                                        )}
                                                        {optIndex === answer.answer && !answer.isCorrect && (
                                                            <span className="ml-2 text-red-400 text-sm">✗ Your answer</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {answer.explanation && (
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                                <p className="text-blue-300 text-sm font-medium mb-1">Explanation:</p>
                                                <p className="text-gray-300 text-sm">{answer.explanation}</p>
                                            </div>
                                        )}

                                        <p className="text-gray-400 text-sm mt-2">
                                            Marks: {answer.marksObtained}/{answer.marksObtained + (answer.isCorrect ? 0 : 1)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
