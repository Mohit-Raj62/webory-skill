import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { TwoFactorSettings } from "@/components/profile/TwoFactorSettings";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SecurityPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login?redirect=/profile/security");
    }

    await dbConnect();
    const fullUser = await User.findById(user._id).lean();

    if (!fullUser) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[#020617] relative overflow-hidden font-sans">
             {/* Subtle Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-600/10 via-purple-900/5 to-transparent blur-[120px] -z-10" />
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium text-sm">
                        <ChevronLeft size={16} /> Back to Profile
                    </Link>
                    
                    <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                                Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Settings</span>
                            </h1>
                            <p className="text-slate-400 text-lg">
                                Manage your account security and two-factor authentication.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 md:p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl">
                        <TwoFactorSettings initialEnabled={fullUser.isTwoFactorEnabled || false} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
