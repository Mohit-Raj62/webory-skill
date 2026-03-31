import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" className="text-gray-400 hover:text-white" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <Skeleton className="h-10 w-64 bg-white/5 mb-2" />
          <Skeleton className="h-4 w-80 bg-white/5" />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-white/5" />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-80 rounded-2xl bg-white/5" />
        <Skeleton className="h-80 rounded-2xl bg-white/5" />
        <Skeleton className="h-96 rounded-2xl lg:col-span-2 bg-white/5" />
      </div>

      {/* Table Section */}
      <Skeleton className="h-96 rounded-2xl bg-white/5" />
    </div>
  );
}
