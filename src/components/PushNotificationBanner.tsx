"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BCxEvdZ2iQZcPB7fKRvQk6JauiuMracpAnA3Tc5L6zHKKPE9I7WAPPyQMCUdzYwTH5pQb1ixCm-TWJbbyVHIlJfk";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      
      // Show banner if permission is not granted and not previously dismissed in this session
      if (Notification.permission === "default") {
        const dismissed = sessionStorage.getItem("notification-banner-dismissed");
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    }
  }, []);

  const handleEnable = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted" && "serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        await fetch("/api/push/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      
      setIsVisible(false);
    } catch (error) {
      console.error("Error enabling notifications:", error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("notification-banner-dismissed", "true");
  };

  if (!isVisible || permission === "granted" || permission === "denied") {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Bell className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Enable Notifications</h3>
            <p className="text-xs text-blue-100 opacity-90">Get important updates on your phone.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleEnable}
            className="bg-white text-blue-700 hover:bg-blue-50 text-xs py-1.5 h-auto rounded-xl font-bold transition-all active:scale-95"
          >
            Enable
          </Button>
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
