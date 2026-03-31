import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-6 text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse rounded-full" />
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">Initializing LogicRoom</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">by webory skills</span>
      </div>
      
      {/* Skeleton for Layout Preview */}
      <div className="fixed bottom-12 left-12 right-12 h-20 bg-white/5 border border-white/5 rounded-[40px] animate-pulse" />
    </div>
  );
}
