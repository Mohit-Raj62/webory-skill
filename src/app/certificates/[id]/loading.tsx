import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#020617] relative">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-16 h-16 rounded-2xl bg-white/5" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48 bg-white/5" />
                            <Skeleton className="h-4 w-64 bg-white/5" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-12 w-32 rounded-xl bg-white/5" />
                        <Skeleton className="h-12 w-32 rounded-xl bg-white/5" />
                    </div>
                </div>
                
                <div className="aspect-[297/210] w-full max-w-full bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-2xl">
                    <Loader2 className="animate-spin text-blue-500/20" size={64} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
