"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateCourse() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "Beginner",
        price: "",
        color: "#3B82F6",
        icon: "BookOpen",
        outcome: "",
        whoIsThisFor: [] as string[],
        projects: [] as { title: string; description: string }[],
        careerOutcomes: [] as string[]
    });

    const [whoIsThisForInput, setWhoIsThisForInput] = useState("");
    const [careerInput, setCareerInput] = useState("");
    const [projectInput, setProjectInput] = useState({ title: "", description: "" });

    const addWhoIsThisFor = () => {
        if (whoIsThisForInput.trim()) {
            setFormData({ ...formData, whoIsThisFor: [...formData.whoIsThisFor, whoIsThisForInput.trim()] });
            setWhoIsThisForInput("");
        }
    };
    const removeWhoIsThisFor = (index: number) => {
        setFormData({ ...formData, whoIsThisFor: formData.whoIsThisFor.filter((_, i) => i !== index) });
    };

    const addCareerOutcome = () => {
        if (careerInput.trim()) {
            setFormData({ ...formData, careerOutcomes: [...formData.careerOutcomes, careerInput.trim()] });
            setCareerInput("");
        }
    };
    const removeCareerOutcome = (index: number) => {
        setFormData({ ...formData, careerOutcomes: formData.careerOutcomes.filter((_, i) => i !== index) });
    };

    const addProject = () => {
        if (projectInput.title.trim() && projectInput.description.trim()) {
            setFormData({ ...formData, projects: [...formData.projects, { ...projectInput }] });
            setProjectInput({ title: "", description: "" });
        }
    };
    const removeProject = (index: number) => {
        setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== index) });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/teacher/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Course created successfully!");
                router.push("/teacher/courses");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create course");
            }
        } catch (error) {
            console.error("Failed to create course", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/teacher/courses"
                    className="p-2 bg-gray-900 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white">Create New Course</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Course Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="e.g. Advanced React Patterns"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Level</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                            placeholder="Brief description of what students will learn..."
                        />
                    </div>
                    </div>



                    {/* Curriculum & Outcomes */}
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">Curriculum & Outcomes</h2>

                        <div className="space-y-2">
                             <label className="text-sm font-medium text-gray-400">One-Line Outcome</label>
                             <input
                                 type="text"
                                 name="outcome"
                                 value={formData.outcome}
                                 onChange={handleChange}
                                 className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                 placeholder="e.g. Build real-world web applications and become job-ready."
                             />
                     </div>

                    {/* Dynamic Fields Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Who Is This For */}
                        <div>
                            <label className="text-sm font-medium text-gray-400 mb-2 block">Who Is This For?</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Add Target Audience"
                                    className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                    value={whoIsThisForInput}
                                    onChange={(e) => setWhoIsThisForInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addWhoIsThisFor())}
                                />
                                <button type="button" onClick={addWhoIsThisFor} className="bg-purple-600 px-3 rounded-lg text-white">+</button>
                            </div>
                            <div className="space-y-1">
                                {formData.whoIsThisFor.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
                                        <span className="text-white text-sm">{item}</span>
                                        <button type="button" onClick={() => removeWhoIsThisFor(index)} className="text-red-400 text-xs">Remove</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Career Outcomes */}
                         <div>
                            <label className="text-sm font-medium text-gray-400 mb-2 block">Career Outcomes</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Add Job Role"
                                    className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                    value={careerInput}
                                    onChange={(e) => setCareerInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCareerOutcome())}
                                />
                                <button type="button" onClick={addCareerOutcome} className="bg-purple-600 px-3 rounded-lg text-white">+</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.careerOutcomes.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                                        <span className="text-white text-xs">{item}</span>
                                        <button type="button" onClick={() => removeCareerOutcome(index)} className="text-red-400 text-xs">x</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Projects */}
                     <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Projects</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Project Title"
                                className="bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                value={projectInput.title}
                                onChange={(e) => setProjectInput({ ...projectInput, title: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Brief Description"
                                    className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                    value={projectInput.description}
                                    onChange={(e) => setProjectInput({ ...projectInput, description: e.target.value })}
                                />
                                <button type="button" onClick={addProject} className="bg-purple-600 px-3 rounded-lg text-white">+</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {formData.projects.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div>
                                        <p className="text-white text-sm font-bold">{item.title}</p>
                                        <p className="text-gray-400 text-xs">{item.description}</p>
                                    </div>
                                    <button type="button" onClick={() => removeProject(index)} className="text-red-400 text-xs">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Details */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Course Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="0 for free"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Theme Color</label>
                            <input
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                className="w-full h-[50px] bg-gray-800 border border-white/10 rounded-xl px-2 py-2 cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Icon Name</label>
                            <input
                                type="text"
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="e.g. Code, Database"
                            />
                            <p className="text-xs text-gray-500">Lucide React icon name</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Create Course
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
