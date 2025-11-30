"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const quizId = params.quizId as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "quiz",
        duration: 30,
        passingScore: 70,
        allowRetake: true,
        showAnswers: true,
        questions: [] as any[],
    });

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = async () => {
        try {
            const res = await fetch(`/api/teacher/courses/${courseId}/quizzes/${quizId}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    title: data.quiz.title,
                    description: data.quiz.description || "",
                    type: data.quiz.type,
                    duration: data.quiz.duration,
                    passingScore: data.quiz.passingScore,
                    allowRetake: data.quiz.allowRetake,
                    showAnswers: data.quiz.showAnswers,
                    questions: data.quiz.questions,
                });
            }
        } catch (error) {
            console.error("Failed to fetch quiz", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/teacher/courses/${courseId}/quizzes/${quizId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Quiz updated successfully!");
                router.push(`/teacher/courses/${courseId}/quizzes`);
            } else {
                alert("Failed to update quiz");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update quiz");
        } finally {
            setSaving(false);
        }
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    questionText: "",
                    questionType: "mcq",
                    options: ["", "", "", ""],
                    correctAnswer: 0,
                    marks: 1,
                    explanation: "",
                },
            ],
        });
    };

    const removeQuestion = (index: number) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter((_, i) => i !== index),
        });
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...formData.questions];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, questions: updated });
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading quiz...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <Link href={`/teacher/courses/${courseId}/quizzes`}>
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Quizzes
                    </Button>
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">Edit Quiz</h1>
                <p className="text-gray-400">Update quiz details and questions</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="glass-card p-8 rounded-2xl mb-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

                    <div className="space-y-4">
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
                            <label className="text-sm text-gray-300 block mb-2">Description</label>
                            <textarea
                                rows={3}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                <label className="text-sm text-gray-300 block mb-2">Passing Score (%) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.passingScore}
                                    onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-2xl mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Questions</h2>
                        <Button type="button" onClick={addQuestion}>
                            <Plus size={18} className="mr-2" />
                            Add Question
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.questions.map((question, index) => (
                            <div key={index} className="bg-white/5 p-6 rounded-xl">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeQuestion(index)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Question text"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={question.questionText}
                                        onChange={(e) => updateQuestion(index, "questionText", e.target.value)}
                                    />

                                    {question.questionType === "mcq" && (
                                        <div className="space-y-2">
                                            {question.options.map((option: string, optIndex: number) => (
                                                <input
                                                    key={optIndex}
                                                    type="text"
                                                    placeholder={`Option ${optIndex + 1}`}
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...question.options];
                                                        newOptions[optIndex] = e.target.value;
                                                        updateQuestion(index, "options", newOptions);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            className="bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                            value={question.correctAnswer}
                                            onChange={(e) => updateQuestion(index, "correctAnswer", Number(e.target.value))}
                                        >
                                            {question.questionType === "mcq" ? (
                                                question.options.map((_: any, i: number) => (
                                                    <option key={i} value={i}>Correct: Option {i + 1}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value={0}>True</option>
                                                    <option value={1}>False</option>
                                                </>
                                            )}
                                        </select>

                                        <input
                                            type="number"
                                            placeholder="Marks"
                                            min="1"
                                            className="bg-black/20 border border-white/10 rounded-xl p-3 text-white outline-none"
                                            value={question.marks}
                                            onChange={(e) => updateQuestion(index, "marks", Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Save size={18} className="mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
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
