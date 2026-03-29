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
  const [isAdding, setIsAdding] = useState(false);
  
  // New Hackathon Form
  const [newH, setNewH] = useState({
    title: "",
    theme: "",
    description: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    bannerImage: ""
  });

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

  const handleCreate = async () => {
    try {
        setLoading(true);
        // This would call POST /api/admin/hackathons (to be created)
        const res = await fetch("/api/admin/hackathons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newH)
        });
        
        if (res.ok) {
            toast.success("Hackathon created successfully! 🚀");
            setIsAdding(false);
            fetchHackathons();
        } else {
            toast.error("Failed to create hackathon");
        }
    } catch (error) {
        toast.error("Network error");
    } finally {
        setLoading(false);
    }
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
            onClick={() => setIsAdding(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black h-12 rounded-xl px-6 flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Event
        </Button>
      </div>

      {isAdding && (
          <Card className="bg-gray-900/50 border-white/10 text-white shadow-2xl backdrop-blur-3xl p-4 lg:p-10 mb-10">
              <CardHeader className="px-0">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">New Competition</CardTitle>
                  <CardDescription className="text-gray-500">Define the rules, themes, and prizes for the upcoming battle.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Title</label>
                          <Input value={newH.title} onChange={e => setNewH({...newH, title: e.target.value})} placeholder="e.g., MERN Masterclass" className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Theme / Domain</label>
                          <Input value={newH.theme} onChange={e => setNewH({...newH, theme: e.target.value})} placeholder="e.g., AI & ML" className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Description</label>
                      <textarea 
                        value={newH.description} onChange={e => setNewH({...newH, description: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 min-h-[150px] outline-none text-white focus:border-orange-500/50" 
                        placeholder="Detail about the hackathon..."
                      />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Start Date</label>
                          <Input type="date" value={newH.startDate} onChange={e => setNewH({...newH, startDate: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">End Date</label>
                          <Input type="date" value={newH.endDate} onChange={e => setNewH({...newH, endDate: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Reg. Deadline</label>
                          <Input type="date" value={newH.registrationDeadline} onChange={e => setNewH({...newH, registrationDeadline: e.target.value})} className="bg-white/[0.03] border-white/10 h-12 text-white" />
                      </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                      <Button onClick={handleCreate} className="bg-white text-black font-black flex-1 h-14 rounded-2xl hover:bg-gray-200">
                          Deploy Hackathon
                      </Button>
                      <Button onClick={() => setIsAdding(false)} variant="outline" className="border-white/10 text-white font-black flex-1 h-14 rounded-2xl hover:bg-white/5">
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
                            className="flex-1 bg-white hover:bg-gray-200 text-black font-black rounded-xl h-11 flex items-center gap-2"
                          >
                              <Award size={14} /> Judge
                          </Button>
                          <Button variant="outline" className="border-white/10 hover:border-white/20 text-white font-black rounded-xl h-11">
                              <Edit size={14} />
                          </Button>
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  );
}
