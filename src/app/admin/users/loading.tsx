import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8 space-y-8 min-h-screen bg-black/50">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 bg-white/5" />
        <Skeleton className="h-4 w-96 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-white/5" />
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 h-96 animate-pulse" />
    </div>
  );
}
