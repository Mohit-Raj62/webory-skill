"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TwoFactorSettings } from "@/components/profile/TwoFactorSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Setup2FAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Note: We don't need to do much here since the TwoFactorSettings component handles the API calls.
  // We just provide a wrapper that forces them to complete it before continuing.
  
  useEffect(() => {
    // Small delay just to ensure the UI paints before we check token (though middleware handles access)
    setLoading(false);
  }, []);

  if (loading) {
      return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-white/10 text-white shadow-2xl">
        <CardHeader className="text-center pb-8 border-b border-white/5">
          <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-400">
            <ShieldAlert size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Security Requirement</CardTitle>
          <CardDescription className="text-slate-400 text-base mt-2">
            Your organization requires your account role to have Two-Factor Authentication enabled before accessing the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <TwoFactorSettings initialEnabled={false} />

          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
            <p className="text-sm text-slate-500">Need help? Contact your administrator.</p>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300" onClick={() => router.push("/login")}>
                Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
