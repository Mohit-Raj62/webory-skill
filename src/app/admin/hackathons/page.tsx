"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Calendar, 
  Users, 
  FileText, 
  Loader2, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Award,
  X,
  FileCode,
  ListChecks,
  Gift,
  Files,
  Edit,
  EyeOff,
  Eye,
  Download,
  FileDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Hackathon {
  _id: string;
  title: string;
  theme: string;
  domains: string[];
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
  registeredUsers: any[];
  problemStatement?: string;
  prizes?: { title: string; reward: string; value: number }[];
  rules?: string[];
  simulatorPrerequisite?: boolean;
  isHidden?: boolean;
}

export default function AdminHackathonsPage() {
  const router = useRouter();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "details" | "dates">("general");
  
  const initialForm = {
    title: "",
    theme: "",
    description: "",
    problemStatement: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    bannerImage: "",
    domains: [] as string[],
    prizes: [] as { title: string; reward: string; value: number }[],
    rules: [] as string[],
    simulatorPrerequisite: false,
    isHidden: false
  };

  const [formH, setFormH] = useState(initialForm);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await fetch("/api/admin/hackathons");
      const data = await res.json();
      if (res.ok) setHackathons(data.data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const toggleHide = async (id: string, currentStatus: boolean) => {
    try {
        setLoading(true);
        const res = await fetch(`/api/admin/hackathons/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isHidden: !currentStatus })
        });
        
        if (res.ok) {
            toast.success(currentStatus ? "Hackathon is now LIVE! 🌏" : "Hackathon is now HIDDEN! 🔒");
            fetchHackathons();
        } else {
            toast.error("Failed to update status");
        }
    } catch (error) {
        toast.error("Network error");
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
        setLoading(true);
        const url = isEditing ? `/api/admin/hackathons/${editingId}` : "/api/admin/hackathons";
        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formH)
        });
        
        if (res.ok) {
            toast.success(isEditing ? "Hackathon updated! 🚀" : "Hackathon created! 🚀");
            setIsModalOpen(false);
            setFormH(initialForm);
            setIsEditing(false);
            fetchHackathons();
        } else {
            const err = await res.json();
            toast.error(err.error || "Operation failed");
        }
    } catch (error) {
        toast.error("Network error");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
        setLoading(true);
        const res = await fetch(`/api/admin/hackathons/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            toast.success("Hackathon deleted! 🗑️");
            fetchHackathons();
        } else {
            toast.error("Failed to delete");
        }
    } catch (error) {
        toast.error("Network error");
    } finally {
        setLoading(false);
    }
  };

  const handleExport = async (id: string, title: string) => {
    try {
      toast.promise(
        fetch(`/api/admin/hackathons/${id}/export`).then(async (res) => {
          if (!res.ok) throw new Error("Export failed");
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_registrations.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }),
        {
          loading: "Generating Excel file...",
          success: "Download started!",
          error: "Failed to export registrations"
        }
      );
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const openEdit = (h: any) => {
    setIsEditing(true);
    setEditingId(h._id);
    setFormH({
        title: h.title,
        theme: h.theme,
        description: h.description || "",
        problemStatement: h.problemStatement || "",
        startDate: h.startDate.split('T')[0],
        endDate: h.endDate.split('T')[0],
        registrationDeadline: h.registrationDeadline ? h.registrationDeadline.split('T')[0] : "",
        bannerImage: h.bannerImage || "",
        domains: h.domains || [],
        prizes: h.prizes || [],
        rules: h.rules || [],
        simulatorPrerequisite: h.simulatorPrerequisite || false,
        isHidden: h.isHidden || false
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  if (loading && hackathons.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Hackathon Manager</h1>
          <p className="text-gray-500 font-medium">Create and judge skill-based coding battles.</p>
        </div>
        <Button 
            onClick={() => { setIsEditing(false); setFormH(initialForm); setIsModalOpen(true); }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black h-12 rounded-xl px-6 flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Event
        </Button>
      </div>

      {isModalOpen && (
          <Card className="bg-gray-900/50 border-white/10 text-white shadow-2xl backdrop-blur-3xl p-4 lg:p-10 mb-10 overflow-visible z-10">
              <CardHeader className="px-0">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">
                    {isEditing ? "Edit Competition" : "New Competition"}
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    {isEditing ? "Update the details for this competition." : "Define the rules, themes, and prizes for the upcoming battle."}
                  </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pt-6 space-y-8">
                  {/* Tab Navigation */}
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      {[ 
                        { id: 'general', icon: FileText, label: 'General' },
                        { id: 'details', icon: FileCode, label: 'Content' },
                        { id: 'dates', icon: Calendar, label: 'Schedule' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                            : 'bg-white/5 text-gray-500 hover:bg-white/10'
                          }`}
                        >
                          <tab.icon size={14} />
                          {tab.label}
                        </button>
                      ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'general' && (
                      <motion.div 
                        key="general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><FileText size={10} /> Event Title</label>
                                  <Input value={formH.title} onChange={e => setFormH({...formH, title: e.target.value})} placeholder="e.g., MERN Masterclass" className="bg-white/[0.03] border-white/10 h-12 text-white placeholder:text-gray-700 font-bold" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Trophy size={10} /> Primary Theme</label>
                                  <Input value={formH.theme} onChange={e => setFormH({...formH, theme: e.target.value})} placeholder="e.g., AI & ML" className="bg-white/[0.03] border-white/10 h-12 text-white placeholder:text-gray-700 font-bold" />
                              </div>
                          </div>

                          {/* Domains Management */}
                          <div className="space-y-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                              <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                      <ListChecks size={14} className="text-orange-500" /> Multiple Domains / Categories
                                  </label>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {(formH.domains || []).map((domain, idx) => (
                                      <div key={idx} className="flex gap-2">
                                          <Input 
                                              value={domain} 
                                              onChange={e => {
                                                  const newDomains = [...(formH.domains || [])];
                                                  newDomains[idx] = e.target.value;
                                                  setFormH({...formH, domains: newDomains});
                                              }}
                                              placeholder={`Domain ${idx + 1}`}
                                              className="bg-white/5 border-white/10 h-10 text-xs"
                                          />
                                          <Button 
                                              onClick={() => {
                                                  const newDomains = (formH.domains || []).filter((_, i) => i !== idx);
                                                  setFormH({...formH, domains: newDomains});
                                              }}
                                              variant="ghost" className="text-red-500 bg-red-500/10 hover:bg-red-500/20 h-10 px-3"
                                          >
                                              <X size={14} />
                                          </Button>
                                      </div>
                                  ))}
                                  <Button 
                                      onClick={() => setFormH({...formH, domains: [...(formH.domains || []), ""]})}
                                      className="bg-white/5 border border-dashed border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase h-10"
                                  >
                                      <Plus size={14} className="mr-2" /> Add Domain
                                  </Button>
                              </div>
                          </div>

                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Files size={10} /> Short Description</label>
                              <textarea 
                                value={formH.description} onChange={e => setFormH({...formH, description: e.target.value})}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 min-h-[100px] outline-none text-white focus:border-orange-500/50 font-medium text-sm" 
                                placeholder="A catchy brief about the event..."
                              />
                          </div>

                          <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 space-y-4 shadow-xl">
                              <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                      <h4 className="text-sm font-black text-indigo-400 uppercase">Hide Hackathon</h4>
                                      <p className="text-[10px] text-gray-500 font-medium">Temporarily hide this event from the public page.</p>
                                  </div>
                                  <button 
                                      onClick={() => setFormH({...formH, isHidden: !formH.isHidden})}
                                      className={`w-12 h-6 rounded-full transition-all relative ${formH.isHidden ? 'bg-indigo-600' : 'bg-white/10'}`}
                                  >
                                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formH.isHidden ? 'left-7' : 'left-1'}`} />
                                  </button>
                              </div>
                          </div>
                      </motion.div>
                    )}

                    {activeTab === 'details' && (
                      <motion.div 
                        key="details"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                      >
                          {/* Problem Statement */}
                          <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><FileCode size={14} className="text-orange-500" /> Problem Statement</label>
                              </div>
                              <textarea 
                                value={formH.problemStatement} onChange={e => setFormH({...formH, problemStatement: e.target.value})}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 min-h-[250px] outline-none text-white focus:border-orange-500/50 font-medium text-sm leading-relaxed" 
                                placeholder="Describe the problem, requirements, and expected outcome. Be as detailed as possible..."
                              />
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             {/* Rules Management */}
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><ListChecks size={14} className="text-blue-500" /> Ground Rules</label>
                                <div className="space-y-3">
                                    {(formH.rules || []).map((rule, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input 
                                                value={rule} 
                                                onChange={e => {
                                                    const newRules = [...(formH.rules || [])];
                                                    newRules[idx] = e.target.value;
                                                    setFormH({...formH, rules: newRules});
                                                }}
                                                className="bg-white/5 border-white/5 h-11"
                                            />
                                            <Button 
                                                onClick={() => {
                                                    const newRules = (formH.rules || []).filter((_, i) => i !== idx);
                                                    setFormH({...formH, rules: newRules});
                                                }}
                                                variant="ghost" className="text-red-500 bg-red-500/10 hover:bg-red-500/20 px-3"
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button 
                                        onClick={() => setFormH({...formH, rules: [...(formH.rules || []), ""]})}
                                        className="w-full bg-white/5 border border-dashed border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase h-11"
                                    >
                                        <Plus size={14} className="mr-2" /> Add Rule
                                    </Button>
                                </div>
                             </div>

                             {/* Prizes Management */}
                             <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Gift size={14} className="text-yellow-500" /> Reward Pool</label>
                                <div className="space-y-3">
                                    {(formH.prizes || []).map((prize, idx) => (
                                        <div key={idx} className="grid grid-cols-[1fr,1fr,80px,40px] gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 relative">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-gray-500 uppercase">Title</span>
                                                <Input 
                                                    value={prize.title} 
                                                    onChange={e => {
                                                        const newPrizes = [...(formH.prizes || [])];
                                                        newPrizes[idx].title = e.target.value;
                                                        setFormH({...formH, prizes: newPrizes});
                                                    }}
                                                    placeholder="Winner"
                                                    className="bg-transparent border-white/10 h-8 text-[10px] text-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-gray-500 uppercase">Reward</span>
                                                <Input 
                                                    value={prize.reward} 
                                                    onChange={e => {
                                                        const newPrizes = [...(formH.prizes || [])];
                                                        newPrizes[idx].reward = e.target.value;
                                                        setFormH({...formH, prizes: newPrizes});
                                                    }}
                                                    placeholder="₹5,000 + Swag"
                                                    className="bg-transparent border-white/10 h-8 text-[10px] text-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-yellow-500 uppercase">XP</span>
                                                <Input 
                                                    type="number"
                                                    value={prize.value || ""} 
                                                    onChange={e => {
                                                        const newPrizes = [...(formH.prizes || [])];
                                                        newPrizes[idx].value = Number(e.target.value);
                                                        setFormH({...formH, prizes: newPrizes});
                                                    }}
                                                    placeholder="300"
                                                    className="bg-transparent border-yellow-500/20 h-8 text-[10px] text-yellow-400"
                                                />
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    const newPrizes = (formH.prizes || []).filter((_, i) => i !== idx);
                                                    setFormH({...formH, prizes: newPrizes});
                                                }}
                                                className="text-red-500 hover:text-red-400 self-center"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <Button 
                                        onClick={() => setFormH({...formH, prizes: [...(formH.prizes || []), { title: "", reward: "", value: 0 }]})}
                                        className="w-full bg-white/5 border border-dashed border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase h-11"
                                    >
                                        <Plus size={14} className="mr-2" /> Add Prize
                                    </Button>
                                </div>
                             </div>
                          </div>
                      </motion.div>
                    )}

                    {activeTab === 'dates' && (
                      <motion.div 
                        key="dates"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Clock size={10} /> Start Date</label>
                                  <Input type="date" value={formH.startDate} onChange={e => setFormH({...formH, startDate: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Clock size={10} /> End Date</label>
                                  <Input type="date" value={formH.endDate} onChange={e => setFormH({...formH, endDate: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Clock size={10} /> Reg. Deadline</label>
                                  <Input type="date" value={formH.registrationDeadline} onChange={e => setFormH({...formH, registrationDeadline: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                              </div>
                          </div>
                          <div className="p-6 rounded-[2rem] bg-orange-600/5 border border-orange-600/10 space-y-4">
                              <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                      <h4 className="text-sm font-black uppercase">Simulator Prerequisite</h4>
                                      <p className="text-[10px] text-gray-500 font-medium">Require participants to pass a specific simulator test before joining.</p>
                                  </div>
                                  <button 
                                      onClick={() => setFormH({...formH, simulatorPrerequisite: !formH.simulatorPrerequisite})}
                                      className={`w-12 h-6 rounded-full transition-all relative ${formH.simulatorPrerequisite ? 'bg-orange-600' : 'bg-white/10'}`}
                                  >
                                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formH.simulatorPrerequisite ? 'left-7' : 'left-1'}`} />
                                  </button>
                              </div>
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                      <Button onClick={handleSave} className="bg-white text-black font-black flex-1 h-14 rounded-[1.5rem] hover:bg-orange-500 hover:text-white transition-all uppercase tracking-tighter">
                          {isEditing ? "Update Event" : "Deploy Hackathon"}
                      </Button>
                      <Button onClick={() => setIsModalOpen(false)} variant="outline" className="border-white/10 text-white font-black flex-1 h-14 rounded-[1.5rem] hover:bg-white/5 uppercase tracking-tighter">
                          Cancel
                      </Button>
                  </div>
              </CardContent>
          </Card>
      )}

      {/* Existing Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
              <Card key={h._id} className="bg-gray-900/50 border-white/10 text-white shadow-xl hover:border-orange-500/30 transition-all group p-1 lg:p-1.5 rounded-[2.5rem] overflow-hidden">
                  <div className="bg-[#050505] rounded-[2.2rem] p-8 h-full flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-2xl bg-orange-600/10 text-orange-500"><Trophy size={18} /></div>
                            <div className="flex items-center gap-2">
                                {h.isHidden && <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full flex items-center gap-1.5"><EyeOff size={10} /> Hidden</span>}
                                <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-gray-400">{h.status}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black italic uppercase leading-none tracking-tight">{h.title}</h3>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{h.theme}</p>
                        </div>
                        <div className="flex items-center gap-6 py-4 border-y border-white/5">
                             <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Participants</span>
                                 <span className="text-xl font-black text-white">{h.registeredUsers?.length || 0}</span>
                             </div>
                             <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Starts</span>
                                 <span className="text-sm font-black text-white">{new Date(h.startDate).toLocaleDateString()}</span>
                             </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-8">
                          <Button 
                            onClick={() => router.push(`/admin/hackathons/${h._id}/judge`)}
                            className="flex-1 bg-white hover:bg-gray-200 text-black font-black rounded-xl h-11 flex items-center gap-2 tracking-tighter"
                          >
                              <Award size={14} /> Judge
                          </Button>
                          
                          <Button 
                            onClick={() => handleExport(h._id, h.title)}
                            variant="outline" 
                            className="border-white/10 hover:border-orange-500/30 text-orange-400 font-black rounded-xl h-11 px-3 bg-orange-600/5"
                            title="Export to Excel"
                          >
                              <FileDown size={16} />
                          </Button>

                          <Button 
                            onClick={() => toggleHide(h._id, !!h.isHidden)}
                            variant="outline" 
                            className={`border-white/10 hover:border-white/20 text-white font-black rounded-xl h-11 px-3 ${h.isHidden ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : ''}`}
                            title={h.isHidden ? "Make Live" : "Hide from Users"}
                          >
                              {h.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                          </Button>

                          <Button 
                            onClick={() => openEdit(h)}
                            variant="outline" 
                            className="border-white/10 hover:border-white/20 text-white font-black rounded-xl h-11 px-3"
                          >
                              <Edit size={14} />
                          </Button>
                          <Button 
                            onClick={() => handleDelete(h._id, h.title)}
                            variant="ghost" 
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-11 px-3"
                          >
                              <Trash2 size={16} />
                          </Button>
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  );
}
