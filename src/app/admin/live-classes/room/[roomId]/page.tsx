"use client";

import { use } from "react";
import NativeVideoClassroom from "@/components/live-classes/NativeVideoClassroom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminLiveClassRoom({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full max-w-7xl mx-auto px-4 mt-6">
      <div className="mb-4 flex items-center justify-between">
        <Link 
          href="/admin/live-classes" 
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-sm">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Host Controls Enabled
          </div>
          <button 
            onClick={() => {
              const inviteLink = `${window.location.origin}/live-classes/room/${resolvedParams.roomId}`;
              navigator.clipboard.writeText(inviteLink);
              alert("Student invite link copied to clipboard!\nShare this link with your students.");
            }}
            className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
          >
            Copy Invite Link
          </button>
          <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-white font-medium text-sm">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full">
        {/* We pass isTeacher=true because Admin should also have host controls */}
        <NativeVideoClassroom roomName={resolvedParams.roomId} isTeacher={true} />
      </div>
    </div>
  );
}
