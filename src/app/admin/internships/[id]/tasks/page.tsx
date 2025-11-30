"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InternshipTasksPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
    });

    useEffect(() => {
        fetchTasks();
    }, [id]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`/api/admin/internships/${id}/tasks`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/internships/${id}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchTasks();
                setIsModalOpen(false);
                setFormData({ title: "", description: "", dueDate: "" });
                alert("Task created successfully!");
            } else {
                alert("Failed to create task");
            }
        } catch (error) {
            console.error("Create task error:", error);
            alert("Failed to create task");
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/internships" className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Internship Tasks</h1>
                    <p className="text-gray-400">Manage tasks for this internship</p>
                </div>
                <div className="ml-auto">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Task
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                                    <p className="text-gray-400 mb-4">{task.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileText size={16} />
                                            Created: {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/internships/${id}/tasks/${task._id}/submissions`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                        >
                                            View Submissions
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No tasks found. Create one to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Task</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Due Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    Create Task
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
