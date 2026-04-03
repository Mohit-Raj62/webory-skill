import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SectionSkeleton = ({ height = "h-96", className = "" }) => (
    <div className={`container mx-auto px-4 py-20 ${className}`}>
        <div className="flex flex-col items-center gap-4 mb-12">
            <Skeleton className="h-4 w-32 bg-white/5" />
            <Skeleton className="h-10 w-64 bg-white/5" />
            <Skeleton className="h-4 w-96 bg-white/5" />
        </div>
        <div className={`w-full ${height} bg-white/5 rounded-3xl animate-pulse border border-white/5`} />
    </div>
);

export const FeatureSkeleton = () => (
    <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/5 p-8">
                    <Skeleton className="w-12 h-12 rounded-2xl bg-white/10 mb-6" />
                    <Skeleton className="h-6 w-3/4 bg-white/10 mb-4" />
                    <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                    <Skeleton className="h-4 w-2/3 bg-white/10" />
                </div>
            ))}
        </div>
    </div>
);

export const CoursesPreviewSkeleton = () => (
    <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
                <Skeleton className="h-4 w-32 bg-white/5" />
                <Skeleton className="h-10 w-64 bg-white/5" />
            </div>
            <Skeleton className="h-12 w-40 bg-white/5 rounded-xl underline" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] bg-white/5 rounded-2xl animate-pulse border border-white/5 overflow-hidden">
                    <div className="h-48 bg-white/10" />
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4 bg-white/10" />
                        <Skeleton className="h-4 w-full bg-white/10" />
                        <div className="pt-4 border-t border-white/5 flex justify-between">
                            <Skeleton className="h-4 w-20 bg-white/10" />
                            <Skeleton className="h-4 w-20 bg-white/10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const TrustProofSkeleton = () => (
    <div className="w-full py-16 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-20">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-32 bg-white/20 rounded-lg" />
                ))}
            </div>
        </div>
    </div>
);
