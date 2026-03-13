"use client";

import { useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BCxEvdZ2iQZcPB7fKRvQk6JauiuMracpAnA3Tc5L6zHKKPE9I7WAPPyQMCUdzYwTH5pQb1ixCm-TWJbbyVHIlJfk";

function urlBase64ToUint8Array(base64String: any) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushSubscriptionHandler() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerPush();
    }
  }, []);

  async function registerPush() {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Request permission if not already granted
        if (Notification.permission === "default") {
          // Transparently wait for a user interaction or just request?
          // For now, we request. In a real app, maybe trigger on a button.
          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;
        } else if (Notification.permission !== "granted") {
          return;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("PWA: Push subscription registered");
    } catch (error) {
      console.error("PWA: Push registration failed:", error);
    }
  }

  return null;
}
