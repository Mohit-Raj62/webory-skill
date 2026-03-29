"use client";

import React, { useState, useEffect } from "react";
import CodeViz from "@/components/viz/CodeViz";
import { useAuth } from "@/components/auth/session-provider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function VizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setTimedOut(true);
    }, 10000); // 10s timeout
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?callbackUrl=/viz");
    }
  }, [user, loading, router]);

  if (loading && !timedOut) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initializing LogicRoom...</span>
      </div>
    );
  }

  if (timedOut && loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-6 text-white p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 opacity-50" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Initialization taking longer than expected</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">This usually happens due to a slow connection or server wake-up delay.</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full min-h-screen">
      <CodeViz />
    </div>
  );
}
