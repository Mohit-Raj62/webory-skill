"use client";

import CodeViz from "@/components/viz/CodeViz";
import { useAuth } from "@/components/auth/session-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function VizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?callbackUrl=/viz");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initializing LogicRoom...</span>
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
