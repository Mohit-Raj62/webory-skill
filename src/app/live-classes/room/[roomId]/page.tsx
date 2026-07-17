"use client";

import { use } from "react";
import NativeVideoClassroom from "@/components/live-classes/NativeVideoClassroom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudentLiveClassRoom({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-6 flex-grow flex flex-col container mx-auto px-4 max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <Link 
            href="/live-classes" 
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Link>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-white font-medium">Live Session</span>
          </div>
        </div>

        <div className="flex-grow w-full">
          {/* Students are not teachers, so they join as standard participants */}
        <NativeVideoClassroom roomName={resolvedParams.roomId} isTeacher={false} />
        </div>
      </div>
    </main>
  );
}
