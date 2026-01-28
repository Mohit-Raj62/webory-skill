"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import { motion } from "framer-motion";

function LoginContent() {
    const [loginMethod, setLoginMethod] = useState < "password" | "otp" > ("password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const router = useRouter();
    const { refreshAuth } = useAuth();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            const errorMap: { [key: string]: string } = {
                oauth_failed: "Authentication failed. Please try again.",
                oauth_not_configured: "Server configuration error. Please contact support.",
                oauth_token_failed: "Failed to verify account with provider.",
                no_email: "Your account has no email address associated.",
                oauth_callback_failed: "Login failed during callback. Please try again.",
            };
            setError(errorMap[errorParam] || "An error occurred during login.");
        }
    }, [searchParams]);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            await refreshAuth();

            if (data.user.role === "admin") {
                router.push("/admin");
            } else if (data.user.role === "teacher") {
                router.push("/teacher");
            } else {
                router.push("/profile");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send OTP");
            }

            setOtpSent(true);
            setSuccess("OTP sent to your email! Check your inbox.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Invalid OTP");
            }

            await refreshAuth();

            if (data.user.role === "admin") {
                router.push("/admin");
            } else if (data.user.role === "teacher") {
                router.push("/teacher");
            } else {
                router.push("/profile");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col selection:bg-blue-500/30 font-sans">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="flex-grow flex items-center justify-center pt-24 pb-10 px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
                        
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                            <p className="text-gray-400 text-sm">Log in to continue your journey with Webory</p>
                        </div>

                        {/* Login Method Toggle */}
                        <div className="flex gap-2 mb-8 p-1.5 bg-black/40 rounded-xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginMethod("password");
                                    setError("");
                                    setSuccess("");
                                    setOtpSent(false);
                                }}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${loginMethod === "password"
                                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                                    : "text-gray-400 hover:text-gray-300"
                                    }`}
                            >
                                <Lock className="inline mr-2 mb-0.5" size={14} />
                                Password
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginMethod("otp");
                                    setError("");
                                    setSuccess("");
                                    setOtpSent(false);
                                }}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${loginMethod === "otp"
                                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                                    : "text-gray-400 hover:text-gray-300"
                                    }`}
                            >
                                <Shield className="inline mr-2 mb-0.5" size={14} />
                                OTP Login
                            </button>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                {success}
                            </motion.div>
                        )}

                        {/* Password Login Form */}
                        {loginMethod === "password" && (
                            <form onSubmit={handlePasswordLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                                    <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'email' ? 'border-blue-500/50 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:ring-0 text-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-medium text-gray-400">Password</label>
                                        <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'password' ? 'border-blue-500/50 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-white placeholder-gray-600 focus:ring-0 text-sm"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-1"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 py-6 text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" size={18} /> Logging in...
                                        </span>
                                    ) : "Log In"}
                                </Button>
                            </form>
                        )}

                        {/* OTP Login Form */}
                        {loginMethod === "otp" && (
                            <div className="space-y-6">
                                {!otpSent ? (
                                    <form onSubmit={handleSendOtp} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                                            <div className={`relative transition-all duration-300 rounded-xl bg-black/20 border ${focusedField === 'email-otp' ? 'border-blue-500/50 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                    <Mail size={18} />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onFocus={() => setFocusedField('email-otp')}
                                                    onBlur={() => setFocusedField(null)}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:ring-0 text-sm"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <Shield className="text-blue-400 mt-0.5 shrink-0" size={18} />
                                                <div className="text-xs text-blue-300/80 leading-relaxed">
                                                    <span className="text-blue-300 font-medium block mb-0.5">Secure Passwordless Login</span>
                                                    We'll send a 6-digit code to your email. No password required.
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 py-6 text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                     <Loader2 className="animate-spin" size={18} /> Sending...
                                                </span>
                                            ) : (
                                                <>
                                                    Send OTP <ArrowRight className="inline ml-2" size={18} />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-400 mb-1">Enter code sent to</p>
                                                <p className="text-white font-medium">{email}</p>
                                            </div>
                                            
                                            <div className="flex justify-center">
                                                <input
                                                    type="text"
                                                    required
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                    className="w-48 bg-black/30 border border-white/20 rounded-xl py-3 text-center text-3xl tracking-[0.5em] font-mono text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading || otp.length !== 6}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 py-6 text-base font-semibold shadow-lg shadow-blue-500/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                                        >
                                            {loading ? "Verifying..." : "Verify & Login"}
                                        </Button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOtpSent(false);
                                                setOtp("");
                                                setError("");
                                                setSuccess("");
                                            }}
                                            className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            ← Change email or resend OTP
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="px-4 bg-[#0a0a0a] text-gray-600 backdrop-blur-xl">Or continue with</span>
                            </div>
                        </div>

                        {/* OAuth Provider Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => window.location.href = '/api/auth/google'}
                                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>

                            <button
                                type="button"
                                onClick={() => window.location.href = '/api/auth/github'}
                                className="flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium py-3 px-4 rounded-xl border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500 text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
