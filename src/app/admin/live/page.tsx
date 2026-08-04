"use client";

import { Suspense } from "react";
import LiveDashboardContent from "@/components/live-classes/LiveDashboardContent";

export default function AdminLiveDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
      <LiveDashboardContent role="admin" />
    </Suspense>
  );
}
