import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#020617] relative overflow-hidden font-sans">
             <Navbar />
             <div className="pt-24 md:pt-32 pb-20 container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <Skeleton className="h-4 w-40 mx-auto mb-8 rounded-full bg-white/5" />
                    <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto mb-5 rounded-xl bg-white/5" />
                    <Skeleton className="h-6 w-full max-w-md mx-auto rounded-lg bg-white/5" />
                </div>

                <div className="max-w-4xl mx-auto mb-16 flex flex-col md:flex-row gap-4 justify-between">
                    <Skeleton className="h-12 w-full md:max-w-md rounded-2xl bg-white/5" />
                    <Skeleton className="h-12 w-full md:w-64 rounded-2xl bg-white/5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-slate-900/40 border border-white/10 rounded-[2rem] overflow-hidden h-[500px]">
                            <Skeleton className="h-64 w-full bg-white/5" />
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4 bg-white/5" />
                                <Skeleton className="h-4 w-full bg-white/5" />
                                <Skeleton className="h-4 w-2/3 bg-white/5" />
                                <div className="pt-4 flex justify-between">
                                    <Skeleton className="h-10 w-24 bg-white/5" />
                                    <Skeleton className="h-10 w-24 bg-white/5" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-xl bg-white/5 mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             <Footer />
        </main>
    );
}
