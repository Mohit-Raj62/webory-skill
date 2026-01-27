"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";

interface Question {
    questionText: string;
    questionType: "mcq" | "true-false";
    options: string[];
    marks: number;
}

interface Quiz {
    _id: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    questions: Question[];
}

export default function TakeQuizPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const quizId = params.quizId as string;

    const [quiz, setQuiz] = useState < Quiz | null > (null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState < number[] > ([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        fetchQuiz();
    }, []);

    useEffect(() => {
        if (timeLeft <= 0 && quiz) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, quiz]);

    const fetchQuiz = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}/quizzes/${quizId}`);
            if (res.ok) {
                const data = await res.json();
                setQuiz(data.quiz);
                setTimeLeft(data.quiz.duration * 60);
                setAnswers(new Array(data.quiz.questions.length).fill(-1));
            } else {
                alert("Failed to load quiz");
                router.push(`/courses/${courseId}`);
            }
        } catch (error) {
            console.error("Failed to fetch quiz", error);
            alert("Failed to load quiz");
            router.push(`/courses/${courseId}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (submitting) return;

        const unanswered = answers.filter(a => a === -1).length;
        if (unanswered > 0 && timeLeft > 0) {
            if (!confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
                return;
            }
        }

        setSubmitting(true);

        try {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);

            console.log("🎯 Submitting quiz to API...");
            console.log("Course ID:", courseId);
            console.log("Quiz ID:", quizId);
            console.log("Answers:", answers);

            const res = await fetch(`/api/courses/${courseId}/quizzes/${quizId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: answers.map((answer, index) => ({ questionIndex: index, answer })),
                    timeSpent,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("✅ Quiz submitted successfully!");
                console.log("Result:", data.result);
                sessionStorage.setItem('quizResult', JSON.stringify(data.result));
                router.push(`/courses/${courseId}/quiz/${quizId}/result?attemptId=${data.result.attemptId}`);
            } else {
                console.error("❌ Quiz submission failed:", res.status, res.statusText);
                alert("Failed to submit quiz");
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Failed to submit quiz");
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading quiz...</div>
            </div>
        );
    }

    if (!quiz) {
        return null;
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-6 rounded-2xl mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
                            <p className="text-gray-400 mt-1">
                                Question {currentQuestion + 1} of {quiz.questions.length}
                            </p>
                        </div>

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 300 ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                            <Clock size={20} />
                            <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <div className="mt-4 bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl mb-6">
                    <div className="flex items-start gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium">
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                        </span>
                    </div>

                    <h2 className="text-2xl text-white mb-6 leading-relaxed">
                        {question.questionText}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === index
                                        ? 'border-blue-500 bg-blue-500/20'
                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === index
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-400'
                                        }`}>
                                        {answers[currentQuestion] === index && (
                                            <CheckCircle size={16} className="text-white" />
                                        )}
                                    </div>
                                    <span className="text-white text-lg">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {quiz.questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestion(index)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${index === currentQuestion
                                        ? 'bg-blue-600 text-white'
                                        : answers[index] !== -1
                                            ? 'bg-green-500/20 text-green-300'
                                            : 'bg-white/10 text-gray-400'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestion === quiz.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-gradient-to-r from-green-600 to-blue-600"
                        >
                            {submitting ? "Submitting..." : "Submit Quiz"}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
