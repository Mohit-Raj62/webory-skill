"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function PWAUpdater() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window["workbox"] !== undefined
    ) {
      const wb = window["workbox"];

      // Add event listener to handle updates
      const showSkipWaitingPrompt = () => {
        toast.info("New Update Available", {
          description: "Updating to the latest version of Webory Skills.",
          duration: 4000,
          action: {
            label: "Refresh Now",
            onClick: () => {
              wb.addEventListener("controlling", () => {
                window.location.reload();
              });
              wb.messageSkipWaiting();
            },
          },
        });
      };

      // Listen for when an update is found and waiting
      wb.addEventListener("waiting", showSkipWaitingPrompt);

      // Register the service worker
      wb.register();
    }
  }, []);

  return null;
}
