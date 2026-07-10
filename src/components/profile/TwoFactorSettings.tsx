"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, KeyRound, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function TwoFactorSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialEnabled);
  const [setupMethod, setSetupMethod] = useState<"app" | "email">("app");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [setupSecret, setSetupSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const handleGenerate2FA = async () => {
    setIsProcessing(true);
    try {
      if (setupMethod === "app") {
        const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          setQrCodeUrl(data.qrCodeUrl);
          setSetupSecret(data.secret);
          setShowSetup(true);
        } else {
          toast.error(data.error || "Failed to generate 2FA setup");
        }
      } else {
        const res = await fetch("/api/auth/2fa/generate-email", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          setEmailOtpSent(true);
          setShowSetup(true);
          toast.success("Verification code sent to your email!");
        } else {
          toast.error(data.error || "Failed to send email OTP");
        }
      }
    } catch (error) {
      toast.error("Failed to generate 2FA setup");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    
    setIsProcessing(true);
    try {
      const endpoint = setupMethod === "app" ? "/api/auth/2fa/enable" : "/api/auth/2fa/enable-email";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Two-Factor Authentication enabled successfully");
        setTwoFactorEnabled(true);
        setRecoveryCodes(data.recoveryCodes);
        setShowSetup(false);
      } else {
        toast.error(data.error || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to enable 2FA");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code to disable");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Two-Factor Authentication disabled");
        setTwoFactorEnabled(false);
        setVerificationCode("");
      } else {
        toast.error(data.error || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight text-lg">Two-Factor Authentication (2FA)</h3>
            <p className="text-slate-400 text-sm">Add an extra layer of security to your account.</p>
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            twoFactorEnabled 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {!twoFactorEnabled && !showSetup && (
        <div className="p-6 border border-white/5 bg-slate-900/50 rounded-xl space-y-6">
          <p className="text-slate-300 text-sm">Protect your account by requiring a code every time you log in.</p>
          
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Choose Setup Method:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-xl cursor-pointer transition-all ${setupMethod === 'app' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                onClick={() => setSetupMethod('app')}
              >
                <Smartphone className={`mb-2 ${setupMethod === 'app' ? 'text-blue-400' : 'text-slate-400'}`} />
                <h5 className="text-white font-medium">Authenticator App</h5>
                <p className="text-xs text-slate-400 mt-1">Use Google Authenticator or Authy. Recommended for best security.</p>
              </div>
              <div 
                className={`p-4 border rounded-xl cursor-pointer transition-all ${setupMethod === 'email' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                onClick={() => setSetupMethod('email')}
              >
                <Mail className={`mb-2 ${setupMethod === 'email' ? 'text-blue-400' : 'text-slate-400'}`} />
                <h5 className="text-white font-medium">Email OTP</h5>
                <p className="text-xs text-slate-400 mt-1">Receive a 6-digit code via email when you log in.</p>
              </div>
            </div>
          </div>

          <Button onClick={handleGenerate2FA} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
            {isProcessing ? "Setting up..." : "Continue Setup"}
          </Button>
        </div>
      )}

      {showSetup && !twoFactorEnabled && (
        <div className="p-6 border border-blue-500/20 bg-blue-500/5 rounded-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {setupMethod === "app" ? (
                <>
                <div className="bg-white p-4 rounded-xl shrink-0">
                {qrCodeUrl ? (
                    <Image src={qrCodeUrl} alt="2FA QR Code" width={160} height={160} className="rounded-lg" />
                ) : (
                    <div className="w-[160px] h-[160px] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400 text-xs">Loading QR...</div>
                )}
                </div>
                <div className="flex-1 space-y-4">
                <div>
                    <h4 className="text-white font-bold mb-2">1. Scan the QR Code</h4>
                    <p className="text-sm text-slate-400">Open your authenticator app (like Google Authenticator, Authy, or 1Password) and scan this QR code.</p>
                    {setupSecret && (
                    <p className="text-xs text-slate-500 mt-2">
                        Can't scan? Use this setup key: <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-300 select-all">{setupSecret}</code>
                    </p>
                    )}
                </div>
                <div className="pt-2">
                    <h4 className="text-white font-bold mb-2">2. Enter Verification Code</h4>
                    <p className="text-sm text-slate-400 mb-3">Enter the 6-digit code generated by your app to verify setup.</p>
                    <div className="flex items-center gap-3">
                    <Input 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="max-w-[150px] font-mono text-lg tracking-widest text-center bg-slate-950 border-white/20"
                        maxLength={6}
                    />
                    <Button onClick={handleEnable2FA} disabled={isProcessing || verificationCode.length !== 6} className="bg-emerald-600 hover:bg-emerald-700">
                        Verify & Enable
                    </Button>
                    </div>
                </div>
                </div>
                </>
            ) : (
                <div className="flex-1 space-y-4">
                <div>
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Mail size={18}/> Check Your Email</h4>
                    <p className="text-sm text-slate-400">We've sent a 6-digit verification code to your email address. It will expire in 10 minutes.</p>
                </div>
                <div className="pt-2">
                    <h4 className="text-white font-bold mb-2">Enter Verification Code</h4>
                    <div className="flex items-center gap-3">
                    <Input 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="max-w-[150px] font-mono text-lg tracking-widest text-center bg-slate-950 border-white/20"
                        maxLength={6}
                    />
                    <Button onClick={handleEnable2FA} disabled={isProcessing || verificationCode.length !== 6} className="bg-emerald-600 hover:bg-emerald-700">
                        Verify & Enable
                    </Button>
                    </div>
                    <Button variant="link" onClick={handleGenerate2FA} className="text-blue-400 px-0 h-auto mt-4" disabled={isProcessing}>
                        Resend Code
                    </Button>
                </div>
                </div>
            )}
          </div>
        </div>
      )}

      {twoFactorEnabled && recoveryCodes.length > 0 && (
        <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-4">
          <div className="flex items-start gap-3">
            <KeyRound className="text-amber-500 mt-1 shrink-0" />
            <div>
              <h4 className="text-white font-bold">Recovery Codes</h4>
              <p className="text-sm text-amber-500/80 mt-1 mb-4">Save these codes in a secure place. You can use them to access your account if you lose your device. They will only be shown once!</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recoveryCodes.map((code, idx) => (
                  <div key={idx} className="bg-slate-950 px-3 py-2 rounded-lg font-mono text-sm tracking-wider text-slate-300 border border-white/5 text-center">
                    {code.substring(0,4)}-{code.substring(4)}
                  </div>
                ))}
              </div>
              <Button onClick={() => setRecoveryCodes([])} variant="outline" className="mt-4 border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                I have saved these codes
              </Button>
            </div>
          </div>
        </div>
      )}

      {twoFactorEnabled && recoveryCodes.length === 0 && (
        <div className="p-6 border border-red-500/20 bg-slate-900/50 rounded-xl space-y-4">
          <h4 className="text-white font-bold text-red-400">Disable Two-Factor Authentication</h4>
          <p className="text-sm text-slate-400">To disable 2FA, please enter a code from your current 2FA method (App or Email).</p>
          <div className="flex flex-col gap-3 max-w-sm">
            <Input 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="max-w-[150px] font-mono text-lg tracking-widest text-center bg-slate-950 border-white/20"
              maxLength={6}
            />
            <Button onClick={handleDisable2FA} disabled={isProcessing || verificationCode.length !== 6} variant="destructive">
              Verify & Disable 2FA
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
