"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, ChevronLeft, ChevronRight, User as UserIcon, Shield, GraduationCap, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    studentsCount: number;
    teachersCount: number;
    adminsCount: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm]);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/stats/users");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: searchTerm,
                _t: Date.now().toString(), // Force refresh
            });

            const res = await fetch(`/api/admin/users?${params}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.pagination.pages);
                setTotalUsers(data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                fetchUsers();
                fetchStats();
                 // Show toast would be better here
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete user");
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
                fetchStats();
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error("Role change error:", error);
            alert("Failed to update role");
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin": return "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/50";
            case "teacher": return "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-purple-500/50";
            case "student": return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/50";
            default: return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border-gray-500/50";
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-black/50">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        User Management
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Manage permissions and monitor user growth</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: "Total Users", value: stats?.totalUsers || 0, icon: UserIcon, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Students", value: stats?.studentsCount || 0, icon: GraduationCap, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Teachers", value: stats?.teachersCount || 0, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Admins", value: stats?.adminsCount || 0, icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" }
                ].map((stat, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-xl group-hover:scale-150 transition-transform duration-500`} />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{loading && !stats ? "-" : stat.value}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
                {/* Search Header */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto max-h-[600px] relative">
                    <Table>
                        <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-gray-300 font-semibold px-6 py-4">User Details</TableHead>
                                <TableHead className="text-gray-300 font-semibold px-6 py-4">Contact Info</TableHead>
                                <TableHead className="text-gray-300 font-semibold px-6 py-4">Role</TableHead>
                                <TableHead className="text-gray-300 font-semibold px-6 py-4">Joined Date</TableHead>
                                <TableHead className="text-gray-300 font-semibold px-6 py-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="wait">
                                {users.length === 0 && !loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <Search className="w-12 h-12 opacity-20" />
                                                <p>No users found matching your search</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                                                        {user.firstName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-base">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-0.5">ID: {user._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-gray-300">
                                                        <Mail className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm">{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <Phone className="w-4 h-4 text-gray-500" />
                                                            <span className="text-xs">{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border bg-black/20 outline-none cursor-pointer appearance-none ${getRoleBadgeColor(user.role)}`}
                                                >
                                                    <option value="student" className="bg-gray-900 text-white">Student</option>
                                                    <option value="teacher" className="bg-gray-900 text-white">Teacher</option>
                                                    <option value="admin" className="bg-gray-900 text-white">Admin</option>
                                                </select>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
                        <div className="text-sm text-gray-400">
                            Showing <span className="text-white font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)}</span> of <span className="text-white font-medium">{totalUsers}</span> users
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="bg-black/20 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {/* Page Numbers */}
                            <div className="flex items-center gap-1 mx-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(1 + i)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === 1 + i
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-400 hover:bg-white/10"
                                            }`}
                                        >
                                           {1 + i}
                                        </button>
                                    )
                                })} 
                                <span className="text-sm text-gray-400">
                                   Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="bg-black/20 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
