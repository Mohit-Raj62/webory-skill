"use client";

import { useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BPCR1FOsyB5_iI2SCgndkhgzd8AIdRsaUFx-Bi-22bf8bzxIeSVT9IY_W6TSiWLLx5qmzRb0B21QI0RraQe1lAE";

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

      // -- DEDUPLICATION LOGIC --
      // Check if we've already registered this exact endpoint with the server
      const savedEndpoint = localStorage.getItem("last_push_endpoint");
      if (savedEndpoint === subscription.endpoint) {
        console.log("PWA: Push already registered (cached)");
        return;
      }

      // Send subscription to server
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Cache the endpoint to prevent redundant calls on next page load
        localStorage.setItem("last_push_endpoint", subscription.endpoint);
        console.log("PWA: Push subscription updated on server");
      }
    } catch (error) {
      console.error("PWA: Push registration failed:", error);
    }
  }

  return null;
}
