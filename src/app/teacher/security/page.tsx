import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { TwoFactorSettings } from "@/components/profile/TwoFactorSettings";
import { ShieldCheck } from "lucide-react";

export default async function TeacherSecurityPage() {
    const user = await getUser();

    if (!user || user.role !== "teacher") {
        redirect("/login");
    }

    await dbConnect();
    const fullUser = await User.findById(user._id).lean();

    if (!fullUser) {
        redirect("/login");
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
            <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                        Security Settings
                    </h1>
                    <p className="text-slate-400">
                        Manage your teacher account security and two-factor authentication.
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <TwoFactorSettings initialEnabled={fullUser.isTwoFactorEnabled || false} />
            </div>
        </div>
    );
}
