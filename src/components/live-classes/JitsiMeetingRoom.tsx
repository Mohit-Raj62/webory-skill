"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/session-provider";
import { Loader2 } from "lucide-react";

interface JitsiMeetingRoomProps {
  roomName: string;
  isTeacher: boolean;
  onReadyToClose?: () => void;
}

export default function JitsiMeetingRoom({ roomName, isTeacher, onReadyToClose }: JitsiMeetingRoomProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Use the session user data if available, otherwise default to a guest
  const displayName = user ? `${user.firstName} ${user.lastName}` : (isTeacher ? "Instructor" : "Student");
  const email = user?.email || "";

  useEffect(() => {
    // Just a small timeout to let the UI settle before initializing Jitsi
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold">Preparing the classroom...</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`skill-webory-${roomName}`}
        configOverwrite={{
          startWithAudioMuted: !isTeacher,
          startWithVideoMuted: !isTeacher,
          requireDisplayName: true,
          disableDeepLinking: true, // Prevents mobile app download prompt
          prejoinPageEnabled: false, // Skip the pre-join page and go straight in
          disableThirdPartyRequests: true,
          hideConferenceSubject: true,
          disableInviteFunctions: true,
          whiteboard: {
            enabled: true, // Enable the Excalidraw whiteboard
            collabServerBaseUrl: 'https://excalidraw-backend.jitsi.net'
          },
          localRecording: {
            enabled: true,
            format: 'ogg'
          }
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false, // Hide mobile app promo
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'whiteboard'
          ],
        }}
        userInfo={{
          displayName: displayName,
          email: email
        }}
        onApiReady={(externalApi) => {
          // You can attach event listeners here if needed
          externalApi.addListener('videoConferenceLeft', () => {
            if (onReadyToClose) {
              onReadyToClose();
            } else {
              window.history.back(); // Or redirect to /live-classes
            }
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
}
