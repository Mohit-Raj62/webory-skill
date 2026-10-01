import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Badges */}
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
          <Skeleton className="h-6 w-32 bg-white/10 rounded-full" />
        </div>
        <Skeleton className="h-10 sm:h-12 w-3/4 max-w-2xl bg-white/10 rounded-2xl" />
        <Skeleton className="h-5 w-1/2 max-w-lg bg-white/5 rounded-lg" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-8 w-28 bg-white/10 rounded-xl" />
          <Skeleton className="h-8 w-28 bg-white/10 rounded-xl" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-72 sm:h-96 w-full bg-white/5 rounded-3xl" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-7 w-48 bg-white/10 rounded-xl" />
            <Skeleton className="h-24 w-full bg-white/5 rounded-2xl" />
            <Skeleton className="h-24 w-full bg-white/5 rounded-2xl" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[420px] w-full bg-white/5 rounded-3xl border border-white/5" />
        </div>
      </div>
    </div>
  );
}
