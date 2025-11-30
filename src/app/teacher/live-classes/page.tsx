"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Video, Calendar, Clock, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function LiveClassesTeacherPage() {
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 60,
        meetingUrl: "",
        recordingUrl: "",
        type: "general",
        referenceId: "",
    });

    useEffect(() => {
        fetchLiveClasses();
        fetchCourses();
    }, []);

    const fetchLiveClasses = async () => {
        try {
            const res = await fetch("/api/admin/live-classes");
            if (res.ok) {
                const data = await res.json();
                setLiveClasses(data.liveClasses);
            }
        } catch (error) {
            console.error("Failed to fetch live classes", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/teacher/courses");
            if (res.ok) {
                const data = await res.json();
                setCourses(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Combine date and time
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const payload = {
                ...formData,
                date: dateTime,
            };

            const url = editingClass
                ? `/api/admin/live-classes/${editingClass._id}`
                : "/api/admin/live-classes";
            
            const method = editingClass ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(editingClass ? "Class updated successfully" : "Class scheduled successfully");
                setIsModalOpen(false);
                setEditingClass(null);
                setFormData({
                    title: "",
                    description: "",
                    date: "",
                    time: "",
                    duration: 60,
                    meetingUrl: "",
                    recordingUrl: "",
                    type: "general",
                    referenceId: "",
                });
                fetchLiveClasses();
            } else {
                toast.error("Failed to save live class");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save live class");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;

        try {
            const res = await fetch(`/api/admin/live-classes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Class deleted successfully");
                fetchLiveClasses();
            } else {
                toast.error("Failed to delete class");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete class");
        }
    };

    const handleEdit = (liveClass: any) => {
        const dateObj = new Date(liveClass.date);
        setEditingClass(liveClass);
        setFormData({
            title: liveClass.title,
            description: liveClass.description,
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toTimeString().slice(0, 5),
            duration: liveClass.duration,
            meetingUrl: liveClass.meetingUrl,
            recordingUrl: liveClass.recordingUrl || "",
            type: liveClass.type,
            referenceId: liveClass.referenceId || "",
        });
        setIsModalOpen(true);
    };

    const openModal = () => {
        console.log("Opening modal...");
        setEditingClass(null);
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            duration: 60,
            meetingUrl: "",
            recordingUrl: "",
            type: "general",
            referenceId: "",
        });
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Live Classes</h1>
                    <p className="text-gray-400">Schedule and manage live sessions</p>
                </div>
                <Button 
                    onClick={openModal}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    <Plus size={20} className="mr-2" />
                    Schedule Class
                </Button>
            </div>

            {loading ? (
                <div className="text-white">Loading classes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveClasses.map((liveClass) => (
                        <div key={liveClass._id} className="glass-card p-6 rounded-2xl relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(liveClass)}
                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(liveClass._id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${
                                    new Date(liveClass.date) > new Date() 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                    <Video size={24} />
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5 text-gray-300 uppercase">
                                    {liveClass.type}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{liveClass.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{liveClass.description}</p>

                            <div className="space-y-2 text-sm text-gray-300 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-400" />
                                    {new Date(liveClass.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-purple-400" />
                                    {new Date(liveClass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({liveClass.duration} mins)
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <a 
                                    href={liveClass.meetingUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                        Join Meeting <ExternalLink size={16} className="ml-2" />
                                    </Button>
                                </a>
                                {liveClass.recordingUrl && (
                                    <a 
                                        href={liveClass.recordingUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                                            Watch Recording <LinkIcon size={16} className="ml-2" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingClass ? "Edit Class" : "Schedule New Class"}
                        </h2>
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
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Duration (minutes)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Meeting URL</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://meet.google.com/..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.meetingUrl}
                                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Recording URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.recordingUrl}
                                    onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Type</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="general" className="bg-black">General</option>
                                    <option value="course" className="bg-black">Course</option>
                                    <option value="internship" className="bg-black">Internship</option>
                                </select>
                            </div>

                            {formData.type === 'course' && (
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Select Course</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                                        value={formData.referenceId}
                                        onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                                        required
                                    >
                                        <option value="" className="bg-black">Select a course</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id} className="bg-black">
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

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
                                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                                >
                                    {editingClass ? "Update Class" : "Schedule Class"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
