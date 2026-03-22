"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Mail, CheckSquare, Code, Save, Loader2, ChevronLeft, AlertCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSimulators() {
    const [simulators, setSimulators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        role: "Frontend Developer",
        company: "TechNova Inc.",
        difficulty: "Beginner",
        emails: [{ sender: "Alex (Tech Lead)", email: "alex@technova.inc", subject: "URGENT: Button fix", body: "Hey, fix the button padding please.", time: "10:00 AM" }],
        tasks: [{ id: "WEB-101", title: "Fix Button Padding", desc: "Decrease padding to 20px.", reporter: "Alex", priority: "High" }],
        initialCode: ".cta-button {\n  padding: 40px;\n}",
        expectedRegex: "/padding:\\s*20px\\s*;/",
        timeLimit: 30,
        hints: ["Check the CSS padding property."],
    });

    useEffect(() => {
        fetchSimulators();
    }, []);

    const fetchSimulators = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/simulators");
            const json = await res.json();
            if (json.success) setSimulators(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeed = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/simulators", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json.success) {
                alert("Simulators seeded with initial data!");
                fetchSimulators();
            }
        } catch (error) {
            alert("Failed to seed data.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (sim: any) => {
        setFormData({
            role: sim.role || "",
            company: sim.company || "",
            difficulty: sim.difficulty || "Beginner",
            emails: sim.emails?.length > 0 ? sim.emails : [{ sender: "", email: "", subject: "", body: "", time: "" }],
            tasks: sim.tasks?.length > 0 ? sim.tasks : [{ id: "", title: "", desc: "", reporter: "", priority: "" }],
            initialCode: sim.initialCode || "",
            expectedRegex: sim.expectedRegex || "",
            timeLimit: sim.timeLimit || 30,
            hints: sim.hints?.length > 0 ? sim.hints : [""],
        });
        setEditId(sim._id);
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this scenario?")) return;
        try {
            const res = await fetch(`/api/admin/simulators/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                fetchSimulators();
            } else {
                alert("Error: " + json.error);
            }
        } catch (error) {
            alert("Failed to delete.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(editId ? `/api/admin/simulators/${editId}` : "/api/admin/simulators", {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (json.success) {
                alert(editId ? "Scenario updated successfully!" : "Scenario created successfully!");
                setIsAdding(false);
                setEditId(null);
                fetchSimulators();
            } else {
                alert("Error: " + json.error);
            }
        } catch (error) {
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-4" /> Loading scenarios...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">WeboryOS Management</h1>
                        <p className="text-slate-400 text-lg">Create and edit interactive career simulations for WeboryOS.</p>
                    </div>
                    {!isAdding && (
                        <Button onClick={() => {
                            setEditId(null);
                            setFormData({
                                role: "Frontend Developer",
                                company: "TechNova Inc.",
                                difficulty: "Beginner",
                                emails: [{ sender: "Alex (Tech Lead)", email: "alex@technova.inc", subject: "URGENT: Button fix", body: "Hey, fix the button padding please.", time: "10:00 AM" }],
                                tasks: [{ id: "WEB-101", title: "Fix Button Padding", desc: "Decrease padding to 20px.", reporter: "Alex", priority: "High" }],
                                initialCode: ".cta-button {\n  padding: 40px;\n}",
                                expectedRegex: "/padding:\\s*20px\\s*;/",
                                timeLimit: 30,
                                hints: ["Check the CSS padding property."],
                            });
                            setIsAdding(true);
                        }} className="bg-blue-600 hover:bg-blue-700 h-11 px-6">
                            <Plus className="mr-2" size={20} /> New Scenario
                        </Button>
                    )}
                </div>

                {isAdding ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 animate-in fade-in slide-in-from-top-4">
                        <Button variant="ghost" onClick={() => { setIsAdding(false); setEditId(null); }} className="mb-6 -ml-2 text-slate-400 hover:text-white">
                            <ChevronLeft className="mr-1" size={18} /> Back to list
                        </Button>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Target Job Role</label>
                                    <Input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Frontend Developer" className="bg-slate-950 border-slate-800" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-400">Virtual Company Name</label>
                                    <Input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="e.g. Google" className="bg-slate-950 border-slate-800" required />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 font-bold text-slate-200"><Mail size={18} className="text-blue-500" /> Virtual Email</h3>
                                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                                    <Input value={formData.emails[0].subject} onChange={(e) => {
                                        let newEmails = [...formData.emails];
                                        newEmails[0].subject = e.target.value;
                                        setFormData({...formData, emails: newEmails});
                                    }} placeholder="Subject Line" className="bg-slate-900 border-slate-800" required />
                                    <Textarea value={formData.emails[0].body} onChange={(e) => {
                                        let newEmails = [...formData.emails];
                                        newEmails[0].body = e.target.value;
                                        setFormData({...formData, emails: newEmails});
                                    }} placeholder="Email Content" className="min-h-[150px] bg-slate-900 border-slate-800" required />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 font-bold text-slate-200"><Code size={18} className="text-blue-500" /> Challenge & Validation</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Initial Starter Code</label>
                                        <Textarea value={formData.initialCode} onChange={(e) => setFormData({...formData, initialCode: e.target.value})} className="font-mono bg-slate-950 border-slate-800" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-red-400 uppercase flex items-center gap-2"><AlertCircle size={14} /> Validation Regex (Required)</label>
                                        <Input value={formData.expectedRegex} onChange={(e) => setFormData({...formData, expectedRegex: e.target.value})} placeholder="/padding:\s*20px\s*;/" className="font-mono bg-slate-950 border-slate-800" required />
                                        <p className="text-xs text-slate-500">The simulator will check if the student's code matches this pattern to win.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mt-6">
                                    <h4 className="text-sm font-bold text-slate-400 flex justify-between items-center">
                                        Target Hints
                                        <Button type="button" variant="outline" size="sm" className="h-8 border-slate-700 hover:bg-slate-800 text-xs" onClick={() => setFormData({...formData, hints: [...formData.hints, ""]})}>
                                            <Plus size={14} className="mr-1" /> Add Hint
                                        </Button>
                                    </h4>
                                    {formData.hints.map((hint, idx) => (
                                        <div key={idx} className="flex gap-2 relative">
                                            <Input value={hint} onChange={(e) => {
                                                const newHints = [...formData.hints];
                                                newHints[idx] = e.target.value;
                                                setFormData({...formData, hints: newHints});
                                            }} placeholder={`Hint ${idx + 1}`} className="bg-slate-950 border-slate-800" required />
                                            {formData.hints.length > 1 && (
                                                <Button type="button" variant="ghost" className="px-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => {
                                                    const newHints = formData.hints.filter((_, i) => i !== idx);
                                                    setFormData({...formData, hints: newHints});
                                                }}>
                                                    <X size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
                                {saving ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : <><Save className="mr-2" /> {editId ? "Update" : "Create"} Simulator scenario</>}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {simulators.length === 0 ? (
                            <div className="col-span-full py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center">
                                <div className="text-slate-500 mb-4 flex justify-center"><Briefcase size={48} /></div>
                                <h3 className="text-xl font-bold text-slate-300">No scenarios yet</h3>
                                <p className="text-slate-500 mb-6">Create your first job simulator to get started.</p>
                                <div className="flex justify-center gap-4">
                                    <Button onClick={() => setIsAdding(true)} variant="outline" className="border-slate-700 hover:bg-slate-800">Create One Now</Button>
                                    <Button onClick={handleSeed} variant="secondary" className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border-blue-500/30">
                                        <Plus className="mr-2" size={18} /> Seed Default Data
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            simulators.map((sim: any) => (
                                <div key={sim._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col hover:border-blue-500/50 transition-colors">
                                    <div className="text-xs font-bold text-blue-400 uppercase mb-2 tracking-widest">{sim.difficulty}</div>
                                    <h3 className="text-xl font-bold mb-1">{sim.role}</h3>
                                    <p className="text-slate-500 text-sm mb-6 flex-1">{sim.company}</p>
                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" className="flex-1 border-slate-800 hover:bg-slate-800" onClick={() => window.open(`/simulator?id=${sim._id}`, '_blank')}>View Live</Button>
                                        <Button variant="outline" className="text-blue-400 border-slate-800 hover:bg-blue-500/10 hover:text-blue-500" onClick={() => handleEdit(sim)}>
                                            Edit
                                        </Button>
                                        <Button variant="outline" className="text-red-400 border-slate-800 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleDelete(sim._id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
