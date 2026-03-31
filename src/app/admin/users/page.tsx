import { motion } from "framer-motion";
import { User as UserIcon, Shield, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { UserManagementClient } from "@/components/admin/UserManagementClient";

export default async function UsersPage() {
    const user = await getUser();

    if (!user || user.role !== "admin") {
        redirect("/login?redirect=/admin/users");
    }

    await dbConnect();

    // Fetch initial stats and users on server
    const [totalUsersCount, studentsCount, teachersCount, adminsCount, initialUsers] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
        User.countDocuments({ role: "admin" }),
        User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
    ]);

    const stats = {
        totalUsers: totalUsersCount,
        studentsCount,
        teachersCount,
        adminsCount,
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
                    <h1 className="text-4xl font-black tracking-tighter text-white">
                        User Management
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg font-medium opacity-80 uppercase tracking-widest text-[10px]">Manage permissions and monitor user growth</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value={stats.totalUsers} icon={UserIcon} color="text-blue-400" bg="bg-blue-500/10" />
                <StatCard label="Students" value={stats.studentsCount} icon={GraduationCap} color="text-emerald-400" bg="bg-emerald-500/10" />
                <StatCard label="Teachers" value={stats.teachersCount} icon={Shield} color="text-purple-400" bg="bg-purple-500/10" />
                <StatCard label="Admins" value={stats.adminsCount} icon={Shield} color="text-orange-400" bg="bg-orange-500/10" />
            </div>

            {/* Main Interactive Table */}
            <UserManagementClient 
                initialUsers={serializedUsers} 
                initialPagination={pagination} 
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
