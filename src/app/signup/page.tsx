import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { SignupForm } from "@/components/auth/SignupForm";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your Webory account and start your learning journey.",
};

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex flex-col selection:bg-blue-500/30 font-sans">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="flex-grow flex items-center justify-center pt-24 pb-10 px-4 relative z-10">
                <div className="w-full max-w-md">
                    <Suspense fallback={<div className="text-center text-white py-10">Loading...</div>}>
                        <SignupForm />
                    </Suspense>
                </div>
            </div >

            <Footer />
        </main >
    );
}
