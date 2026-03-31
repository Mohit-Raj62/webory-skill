import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-4 max-w-6xl animate-pulse space-y-12">
                <div className="flex flex-col md:flex-row gap-8 items-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <Skeleton className="h-10 w-48 mx-auto md:mx-0 bg-white/10" />
                        <Skeleton className="h-6 w-64 mx-auto md:mx-0 bg-white/10" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Skeleton className="h-10 w-48 bg-white/10" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-48 rounded-2xl bg-white/10" />
                            <Skeleton className="h-48 rounded-2xl bg-white/10" />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <Skeleton className="h-80 rounded-2xl bg-white/10" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
