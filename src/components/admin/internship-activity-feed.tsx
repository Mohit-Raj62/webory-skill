"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Clock, Phone, UserCheck, Zap, MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Activity {
  type: "guest_lead" | "logged_activity";
  student: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  name: string;
  count: number;
  lastViewed: string;
}

export function InternshipActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/admin/activity?category=internship", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setActivities(data.activities);
        }
      } catch (err) {
        console.error("Activity fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 30000); // UI updates every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
           <Zap size={20} className="fill-current" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">Live Leads & Activity</h2>
            <p className="text-xs text-gray-500 tracking-wide uppercase font-bold">Real-time interest from students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {activities.slice(0, 6).map((activity, index) => (
            <motion.div
              key={`${activity.student.phone}-${activity.lastViewed}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md hover:border-emerald-500/30 transition-all group ${activity.type === 'guest_lead' ? 'border-amber-500/20' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={activity.student.avatar} />
                        <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                          {activity.student.firstName?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {activity.student.firstName} {activity.student.lastName}
                            </h4>
                            {activity.type === 'guest_lead' && (
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] px-1.5 h-4">Guest</Badge>
                            )}
                            {activity.count >= 3 && (
                                <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[8px] px-1.5 h-4 animate-pulse">High Intent</Badge>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                           <Phone size={10} /> {activity.student.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-[9px] text-gray-600 font-black uppercase tracking-tighter flex items-center justify-end gap-1">
                          <Clock size={10} /> {new Date(activity.lastViewed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 overflow-hidden">
                        <MousePointer2 size={12} className="text-emerald-500 shrink-0" />
                        <p className="text-[10px] text-gray-400 font-bold truncate max-w-[120px]">
                            {activity.name}
                        </p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[8px] text-gray-600 uppercase font-bold leading-none">Views</p>
                            <p className="text-xs font-black text-white">{activity.count}</p>
                        </div>
                        {activity.student.phone && (
                            <a 
                                href={`tel:${activity.student.phone}`}
                                className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                            >
                                <Phone size={14} />
                            </a>
                        )}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
