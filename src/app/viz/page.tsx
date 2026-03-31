import React from "react";
import CodeViz from "@/components/viz/CodeViz";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function VizPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?callbackUrl=/viz");
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <CodeViz />
    </div>
  );
}
