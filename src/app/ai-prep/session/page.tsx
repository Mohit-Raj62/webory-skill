"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the session content to avoid blocking the initial page load
const SessionContent = dynamic(
    () => import('@/components/ai-prep/SessionContent').then(mod => mod.SessionContent),
    {
        ssr: false, // Ensure this only runs on the client due to heavy browser API usage (Web Speech)
        loading: () => (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            </div>
        )
    }
);

export default function AIPrepSessionPage() {
    return <SessionContent />;
}
