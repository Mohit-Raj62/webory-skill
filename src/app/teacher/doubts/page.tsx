"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Edit2 } from "lucide-react";

export default function TeacherDoubtsPage() {
    const router = useRouter();
    const [doubts, setDoubts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all');
    const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDoubts();
    }, [filter]);

    const fetchDoubts = async () => {
        try {
            const url = filter === 'all'
                ? '/api/teacher/doubts'
                : `/api/teacher/doubts?status=${filter}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setDoubts(data.doubts || []);
            }
        } catch (error) {
            console.error("Failed to fetch doubts", error);
            toast.error("Failed to load doubts");
        } finally {
            setLoading(false);
        }
    };

    const answerDoubt = async () => {
        if (!answer.trim() || !selectedDoubt) {
            toast.error('Please enter an answer');
            return;
        }

        try {
            const res = await fetch(`/api/teacher/doubts/${selectedDoubt._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answer })
            });

            if (res.ok) {
                toast.success(isEditing ? 'Answer updated successfully!' : 'Doubt answered successfully!');
                setSelectedDoubt(null);
                setAnswer('');
                setIsEditing(false);
                fetchDoubts();
            } else {
                toast.error('Failed to save answer');
            }
        } catch (error) {
            console.error('Failed to save answer', error);
            toast.error('Failed to save answer');
        }
    };

    const deleteDoubt = async (doubtId: string) => {
        if (!confirm('Are you sure you want to delete this doubt? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`/api/teacher/doubts/${doubtId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Doubt deleted successfully');
                fetchDoubts();
            } else {
                toast.error('Failed to delete doubt');
            }
        } catch (error) {
            console.error('Failed to delete doubt', error);
            toast.error('Failed to delete doubt');
        }
    };

    const openEditModal = (doubt: any) => {
        setSelectedDoubt(doubt);
        setAnswer(doubt.answer || '');
        setIsEditing(true);
    };

    const pendingCount = doubts.filter(d => d.status === 'pending').length;
    const answeredCount = doubts.filter(d => d.status === 'answered').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Student Doubts
                </h1>
                <p className="text-gray-400 mt-2">View and answer student questions from your courses</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'all'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    All ({doubts.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'pending'
                            ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Pending ({pendingCount})
                </button>
                <button
                    onClick={() => setFilter('answered')}
                    className={`px-4 py-2 rounded-lg transition-all ${filter === 'answered'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    Answered ({answeredCount})
                </button>
            </div>

            {/* Doubts List */}
            {doubts.length > 0 ? (
                <div className="space-y-4">
                    {doubts.map((doubt) => (
                        <div
                            key={doubt._id}
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
                        >
                            {/* Doubt Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm text-blue-400">
                                            👤 {doubt.student?.name || 'Unknown Student'}
                                        </span>
                                        <span className="text-sm text-gray-500">•</span>
                                        <span className="text-sm text-purple-400">
                                            📚 {doubt.course?.title || 'Unknown Course'}
                                        </span>
                                    </div>
                                    {doubt.videoTitle && (
                                        <p className="text-sm text-green-400 mb-2">
                                            📹 Video: {doubt.videoTitle}
                                        </p>
                                    )}
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {doubt.question}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Asked on {new Date(doubt.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${doubt.status === 'answered'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}
                                    >
                                        {doubt.status === 'answered' ? '✓ Answered' : '⏳ Pending'}
                                    </span>
                                    <div className="flex gap-2">
                                        {doubt.status === 'answered' && (
                                            <button
                                                onClick={() => openEditModal(doubt)}
                                                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                title="Edit Answer"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteDoubt(doubt._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete Doubt"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Answer Section */}
                            {doubt.status === 'answered' && doubt.answer ? (
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-semibold text-green-400">
                                            💡 Answer:
                                        </span>
                                        {doubt.answeredBy && (
                                            <span className="text-xs text-gray-500">
                                                by {doubt.answeredBy.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap bg-gray-800/50 p-4 rounded-lg">
                                        {doubt.answer}
                                    </p>
                                    {doubt.answeredAt && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Answered on {new Date(doubt.answeredAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <Button
                                        onClick={() => {
                                            setSelectedDoubt(doubt);
                                            setAnswer('');
                                            setIsEditing(false);
                                        }}
                                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                    >
                                        Answer This Doubt
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {filter === 'all'
                            ? 'No doubts yet'
                            : `No ${filter} doubts`}
                    </p>
                </div>
            )}

            {/* Answer Modal */}
            {selectedDoubt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => {
                    setSelectedDoubt(null);
                    setIsEditing(false);
                }}>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            {isEditing ? 'Edit Answer' : 'Answer Doubt'}
                        </h2>

                        {/* Question */}
                        <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
                            <p className="text-sm text-gray-400 mb-2">Student Question:</p>
                            <p className="text-white">{selectedDoubt.question}</p>
                            {selectedDoubt.videoTitle && (
                                <p className="text-sm text-blue-400 mt-2">
                                    📹 {selectedDoubt.videoTitle}
                                </p>
                            )}
                        </div>

                        {/* Answer Input */}
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full bg-gray-800 text-white rounded-lg p-4 border border-gray-700 focus:border-orange-500 focus:outline-none min-h-[200px] resize-y mb-4"
                        />

                        {/* Actions */}
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setSelectedDoubt(null);
                                    setAnswer('');
                                    setIsEditing(false);
                                }}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={answerDoubt}
                                disabled={!answer.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-all"
                            >
                                {isEditing ? 'Update Answer' : 'Submit Answer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
