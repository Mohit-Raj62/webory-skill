"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Clock } from "lucide-react";

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/activity", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setActivities(data.activities);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Live Interest Tracker</h1>
        <p className="text-muted-foreground mb-6">See which logged-in students are viewing courses right now.</p>

        <div className="grid gap-4">
          {loading ? (
             <p>Loading activity...</p>
          ) : activities.length === 0 ? (
             <p>No recent activity.</p>
          ) : (
            activities.map((item, index) => (
              <Card key={index} className="hover:bg-accent/5 transition-colors border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={item.student?.avatar} />
                      <AvatarFallback>{item.student?.firstName?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {item.student ? `${item.student.firstName} ${item.student.lastName}` : "Unknown User"}
                        {item.count >= 3 && (
                            <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                                High Interest
                            </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.student?.email}
                      </p>
                      {item.student?.phone && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <span className="text-gray-500">Phone:</span> {item.student.phone}
                          </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 flex-1">
                    <div className="text-right">
                       <p className="font-medium text-blue-500 flex items-center justify-end gap-2">
                          <Eye size={16}/> {item.courseName || "Unknown Course"}
                       </p>
                       <p className="text-sm font-bold text-gray-600">
                          Viewed <span className="text-foreground text-lg">{item.count}</span> times
                       </p>
                    </div>
                    
                    <div className="text-right min-w-[120px] flex flex-col items-end gap-2">
                        <div className="text-xs text-muted-foreground">
                            <p className="flex items-center justify-end gap-1"><Clock size={12}/> Last viewed:</p>
                            <p>{new Date(item.lastViewed).toLocaleDateString()} {new Date(item.lastViewed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        
                        {item.student?.phone && (
                            <a href={`tel:${item.student.phone}`}>
                                <button className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors animate-pulse hover:animate-none">
                                    Call Now
                                </button>
                            </a>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
