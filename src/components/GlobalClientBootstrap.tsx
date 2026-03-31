"use client";

import dynamic from "next/dynamic";

const SupportChatbotWrapper = dynamic(() => import("@/components/SupportChatbotWrapper"), { ssr: false });
const PWAUpdater = dynamic(() => import("@/components/PWAUpdater").then(mod => mod.PWAUpdater), { ssr: false });
const PushSubscriptionHandler = dynamic(() => import("@/components/PushSubscriptionHandler").then(mod => mod.PushSubscriptionHandler), { ssr: false });
const PushNotificationBanner = dynamic(() => import("@/components/PushNotificationBanner").then(mod => mod.PushNotificationBanner), { ssr: false });
const InactivityLogout = dynamic(() => import("@/components/auth/inactivity-logout").then(mod => mod.InactivityLogout), { ssr: false });
const MobileBottomNav = dynamic(() => import("@/components/ui/MobileBottomNav").then(mod => mod.MobileBottomNav), { ssr: false });

export function GlobalClientBootstrap() {
  return (
    <>
      <SupportChatbotWrapper />
      <PWAUpdater />
      <PushSubscriptionHandler />
      <PushNotificationBanner />
      <InactivityLogout />
      <MobileBottomNav />
    </>
  );
}
