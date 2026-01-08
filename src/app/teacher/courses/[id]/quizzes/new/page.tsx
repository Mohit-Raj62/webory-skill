"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import Link from "next/link";

interface Question {
    questionText: string;
    questionType: "mcq" | "true-false";
    options: string[];
    correctAnswer: number;
    marks: number;
    explanation: string;
}

export default function CreateQuizPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "quiz" as "quiz" | "test" | "exam",
        duration: 30,
        passingScore: 70,
        allowRetake: true,
        showAnswers: true,
        afterModule: 0,
    });

    const [modules, setModules] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourseModules = async () => {
            try {
                const res = await fetch(`/api/courses/${courseId}?includeUnavailable=true`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.course && data.course.modules) {
                        setModules(data.course.modules);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch course modules", error);
            }
        };
        fetchCourseModules();
    }, [courseId]);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        questionText: "",
        questionType: "mcq",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 1,
        explanation: "",
    });

    const addQuestion = () => {
        if (!currentQuestion.questionText) {
            alert("Please enter question text");
            return;
        }

        if (currentQuestion.questionType === "mcq") {
            const filledOptions = currentQuestion.options.filter(opt => opt.trim());
            if (filledOptions.length < 2) {
                alert("Please add at least 2 options");
                return;
            }
        }

        setQuestions([...questions, { ...currentQuestion }]);
        setCurrentQuestion({
            questionText: "",
            questionType: "mcq",
            options: ["", "", "", ""],
            correctAnswer: 0,
            marks: 1,
            explanation: "",
        });
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert("Please add at least one question");
            return;
        }

        setLoading(true);

        try {
            const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

            const res = await fetch(`/api/teacher/courses/${courseId}/quizzes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    totalMarks,
                    questions,
                }),
            });

            if (res.ok) {
                alert("Quiz created successfully!");
                router.push(`/teacher/courses/${courseId}/quizzes`);
            } else {
                alert("Failed to create quiz");
            }
        } catch (error) {
            console.error("Create quiz error:", error);
            alert("Failed to create quiz");
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
                <h1 className="text-4xl font-bold text-white mb-2">Create Quiz</h1>
                <p className="text-gray-400">Add quiz/test/exam to your course</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {/* Basic Info */}
                <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Title *</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Type *</label>
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            >
                                <option value="quiz">Quiz</option>
                                <option value="test">Test</option>
                                <option value="exam">Exam</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-300 block mb-2">Place in Module</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                            value={formData.afterModule}
                            onChange={(e) => setFormData({ ...formData, afterModule: Number(e.target.value) })}
                        >
                            <option value={0} className="bg-gray-900 text-gray-300">General / Global Resources</option>
                            {modules.map((module, index) => (
                                <option key={index} value={index + 1} className="bg-gray-900 text-white">
                                    Module {index + 1}: {module.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm text-gray-300 block mb-2">Description</label>
                        <textarea
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Duration (minutes) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Passing Score (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.passingScore}
                                onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                            />
                        </div>

                        <div className="flex items-center gap-4 mt-6">
                            <label className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={formData.allowRetake}
                                    onChange={(e) => setFormData({ ...formData, allowRetake: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Allow Retake
                            </label>
                        </div>
                    </div>
                </div>

                {/* Add Question */}
                <div className="glass-card p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Add Question</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Question Text *</label>
                            <textarea
                                rows={2}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={currentQuestion.questionText}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                                placeholder="Enter your question here..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Question Type</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={currentQuestion.questionType}
                                    onChange={(e) => {
                                        const type = e.target.value as "mcq" | "true-false";
                                        setCurrentQuestion({
                                            ...currentQuestion,
                                            questionType: type,
                                            options: type === "true-false" ? ["True", "False"] : ["", "", "", ""],
                                            correctAnswer: 0,
                                        });
                                    }}
                                >
                                    <option value="mcq">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Marks</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={currentQuestion.marks}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Options */}
                        {currentQuestion.questionType === "mcq" ? (
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Options (Select correct answer)</label>
                                <div className="space-y-2">
                                    {currentQuestion.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={currentQuestion.correctAnswer === index}
                                                onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                                                className="w-4 h-4"
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Correct Answer</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-gray-300">
                                        <input
                                            type="radio"
                                            checked={currentQuestion.correctAnswer === 0}
                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 0 })}
                                            className="w-4 h-4"
                                        />
                                        True
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-300">
                                        <input
                                            type="radio"
                                            checked={currentQuestion.correctAnswer === 1}
                                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 1 })}
                                            className="w-4 h-4"
                                        />
                                        False
                                    </label>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Explanation (Optional)</label>
                            <textarea
                                rows={2}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={currentQuestion.explanation}
                                onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                                placeholder="Explain the correct answer..."
                            />
                        </div>

                        <Button type="button" onClick={addQuestion} className="w-full">
                            <Plus size={20} className="mr-2" />
                            Add Question
                        </Button>
                    </div>
                </div>

                {/* Questions List */}
                {questions.length > 0 && (
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Questions ({questions.length}) - Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
                        </h2>

                        <div className="space-y-3">
                            {questions.map((q, index) => (
                                <div key={index} className="bg-white/5 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-white font-medium">
                                                Q{index + 1}. {q.questionText}
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Type: {q.questionType === "mcq" ? "Multiple Choice" : "True/False"} |
                                                Marks: {q.marks} |
                                                Correct: {q.questionType === "mcq" ? q.options[q.correctAnswer] : (q.correctAnswer === 0 ? "True" : "False")}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Submit */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? "Creating..." : "Create Quiz"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/teacher/courses/${courseId}/quizzes`)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
