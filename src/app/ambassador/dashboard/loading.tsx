import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen bg-black text-white font-sans">
            <Navbar />
            <div className="pt-24 pb-20 container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <Skeleton className="h-10 w-64 bg-white/5 mb-2" />
                        <Skeleton className="h-4 w-48 bg-white/5" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-24 rounded-full bg-white/5" />
                        <Skeleton className="h-10 w-32 rounded-full bg-white/5" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-3xl bg-white/10" />
                    ))}
                </div>

                <Skeleton className="h-64 w-full rounded-3xl bg-white/5 mb-10" />

                <div className="mb-8">
                    <Skeleton className="h-8 w-48 bg-white/5 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-72 rounded-3xl bg-white/10" />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
