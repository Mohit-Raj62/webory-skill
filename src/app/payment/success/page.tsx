"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { motion } from "framer-motion";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Although not used directly for params, usually fine.
    const txnid = searchParams.get("txnid");
    
    // Timer logic could remain or be simplified. 
    // Keeping it simple as per original file, though it had timer logic not really used for auto-redirect in the snippet I read fully (it had commented out redirect).
    // I'll keep the timer state just to match the visual if it was displaying "redirecting in..." but your original didn't show the count. 
    // The original code had state 'count' but didn't render it. I will keep it as is.
    
    return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-lg w-full p-8 rounded-3xl border-green-500/30 text-center relative z-10"
        >
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <CheckCircle2 size={48} className="text-green-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400 mb-6">
                Thank you for your purchase. Your course/internship has been activated successfully.
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
                <p className="text-white font-mono">{txnid || "Loading..."}</p>
            </div>

            <div className="space-y-3">
                <Link href="/profile">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg">
                        Go to Dashboard <ArrowRight className="ml-2" />
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <main className="min-h-screen bg-black relative overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center relative p-4">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <PaymentSuccessContent />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
