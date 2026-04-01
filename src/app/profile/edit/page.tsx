import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { StudentInfoForm } from "@/components/profile/StudentInfoForm";

export default async function EditProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect("/login?redirect=/profile/edit");
    }

    await dbConnect();
    const fullUser = await User.findById(user._id).lean();

    if (!fullUser) {
        redirect("/login");
    }

    const serializedUser = JSON.parse(JSON.stringify(fullUser));

    return (
        <main className="min-h-screen bg-[#020617] relative overflow-hidden font-sans">
             {/* Subtle Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-600/10 via-purple-900/5 to-transparent blur-[120px] -z-10" />
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -z-10" />

            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Professional Profile</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Fill in your details to generate a premium resume and stand out to top employers. Your mock projects and hackathons are automatically synced!
                        </p>
                    </div>

                    <StudentInfoForm initialUser={serializedUser} />
                </div>
            </div>

            <Footer />
        </main>
    );
}
