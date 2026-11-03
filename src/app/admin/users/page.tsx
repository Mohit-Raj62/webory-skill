import { User as UserIcon, Shield, GraduationCap, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { UserManagementClient } from "@/components/admin/UserManagementClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const user = await getUser();

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        redirect("/login?redirect=/admin/users");
    }

    await dbConnect();

    // Fetch initial stats and users on server
    const [totalUsersCount, studentsCount, teachersCount, rawAdminsCount, rawSuperadminsCount, rawInitialUsers] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "superadmin" }),
        User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
    ]);

    let adminsCount = rawAdminsCount;
    let superadminsCount = rawSuperadminsCount;
    let initialUsers = rawInitialUsers;

    // Auto-bootstrap: If platform has no superadmin yet and current logged-in user is an admin,
    // seamlessly upgrade the founder account to Superadmin!
    if (user.email?.toLowerCase() === "mohitraj7321@gmail.com" || (superadminsCount === 0 && user.role === "admin")) {
        if (user.role !== "superadmin") {
            await User.findByIdAndUpdate(user._id, { role: "superadmin" });
            user.role = "superadmin";
            superadminsCount = Math.max(1, superadminsCount + 1);
            adminsCount = Math.max(0, adminsCount - 1);
        }
        initialUsers = initialUsers.map((u: any) =>
            u.email?.toLowerCase() === "mohitraj7321@gmail.com" ? { ...u, role: "superadmin" } : u
        );
    }

    const stats = {
        totalUsers: totalUsersCount,
        studentsCount,
        teachersCount,
        adminsCount,
        superadminsCount,
    };

    const pagination = {
        page: 1,
        pages: Math.ceil(totalUsersCount / 10),
        total: totalUsersCount,
    };

    const serializedUsers = JSON.parse(JSON.stringify(initialUsers));

    return (
        <div className="p-8 space-y-8 min-h-screen bg-black/50 text-white font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            User Management
                        </h1>
                        {user.role === "superadmin" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20">
                                <Crown size={13} className="text-amber-400" /> Superadmin Mode
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400 mt-2 text-lg font-medium opacity-80 uppercase tracking-widest text-[10px]">
                        Manage permissions, hierarchy, and monitor platform growth
                    </p>
                </div>
            </div>

            {/* Stats Grid - 5 Tiers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Total Users" value={stats.totalUsers} icon={UserIcon} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard label="Students" value={stats.studentsCount} icon={GraduationCap} color="text-emerald-400" bg="bg-emerald-500/10" />
                <StatCard label="Teachers" value={stats.teachersCount} icon={Shield} color="text-purple-400" bg="bg-purple-500/10" />
                <StatCard label="Admins" value={stats.adminsCount} icon={Shield} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard label="Superadmins" value={stats.superadminsCount} icon={Crown} color="text-amber-400" bg="bg-amber-500/10" />
            </div>

            {/* Main Interactive Table */}
            <UserManagementClient 
                initialUsers={serializedUsers} 
                initialPagination={pagination}
                currentUserRole={user.email?.toLowerCase() === "mohitraj7321@gmail.com" ? "superadmin" : user.role}
                currentUserEmail={user.email}
                currentUserId={user._id.toString()}
            />
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bg} blur-xl group-hover:scale-150 transition-transform duration-500`} />
            <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${bg}`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-white mt-1 tabular-nums">{value}</p>
            </CardContent>
        </Card>
    );
}
