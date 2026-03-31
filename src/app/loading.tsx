import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      <Navbar />
      
      {/* Hero Section Skeleton */}
      <section className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8">
            <Skeleton className="h-6 w-48 rounded-full bg-white/5" />
            <Skeleton className="h-16 w-full max-w-3xl rounded-2xl bg-white/5" />
            <Skeleton className="h-8 w-full max-w-2xl rounded-xl bg-white/5" />
            <div className="flex gap-4">
                <Skeleton className="h-14 w-40 rounded-xl bg-blue-500/20" />
                <Skeleton className="h-14 w-40 rounded-xl bg-white/5" />
            </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-3xl bg-white/5" />
            ))}
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 bg-black/40 border-y border-white/5">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64 bg-white/5" />
                    <Skeleton className="h-4 w-96 bg-white/5" />
                </div>
                <Skeleton className="h-10 w-32 bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-3xl bg-white/5" />
                ))}
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
