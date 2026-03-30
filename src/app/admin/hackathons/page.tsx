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
  Edit,
  ExternalLink,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Hackathon {
  _id: string;
  title: string;
  theme: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
  registeredUsers: string[];
}

export default function AdminHackathonsPage() {
  const router = useRouter();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialForm = {
    title: "",
    theme: "",
    description: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    bannerImage: ""
  };

  const [formH, setFormH] = useState(initialForm);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await fetch("/api/hackathons");
      const data = await res.json();
      if (res.ok) setHackathons(data.data);
    } catch (error) {
      toast.error("Failed to load events");
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

  const openEdit = (h: any) => {
    setIsEditing(true);
    setEditingId(h._id);
    setFormH({
        title: h.title,
        theme: h.theme,
        description: h.description || "",
        startDate: h.startDate.split('T')[0],
        endDate: h.endDate.split('T')[0],
        registrationDeadline: h.registrationDeadline ? h.registrationDeadline.split('T')[0] : "",
        bannerImage: h.bannerImage || ""
    });
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
              <CardContent className="px-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Title</label>
                          <Input value={formH.title} onChange={e => setFormH({...formH, title: e.target.value})} placeholder="e.g., MERN Masterclass" className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Theme / Domain</label>
                          <Input value={formH.theme} onChange={e => setFormH({...formH, theme: e.target.value})} placeholder="e.g., AI & ML" className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                      <textarea 
                        value={formH.description} onChange={e => setFormH({...formH, description: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 min-h-[150px] outline-none text-white focus:border-orange-500/50" 
                        placeholder="Detail about the hackathon..."
                      />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Start Date</label>
                          <Input type="date" value={formH.startDate} onChange={e => setFormH({...formH, startDate: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">End Date</label>
                          <Input type="date" value={formH.endDate} onChange={e => setFormH({...formH, endDate: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reg. Deadline</label>
                          <Input type="date" value={formH.registrationDeadline} onChange={e => setFormH({...formH, registrationDeadline: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                      <Button onClick={handleSave} className="bg-white text-black font-black flex-1 h-14 rounded-2xl hover:bg-gray-200 uppercase tracking-tighter">
                          {isEditing ? "Update Event" : "Deploy Hackathon"}
                      </Button>
                      <Button onClick={() => setIsModalOpen(false)} variant="outline" className="border-white/10 text-white font-black flex-1 h-14 rounded-2xl hover:bg-white/5 uppercase tracking-tighter">
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
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-gray-400">{h.status}</span>
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
                            onClick={() => openEdit(h)}
                            variant="outline" 
                            className="border-white/10 hover:border-white/20 text-white font-black rounded-xl h-11"
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
