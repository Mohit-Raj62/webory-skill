"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, ChevronLeft, ChevronRight, Mail, Phone, Calendar, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface UserManagementClientProps {
    initialUsers: any[];
    initialPagination: any;
    currentUserRole?: string;
    currentUserEmail?: string;
    currentUserId?: string;
}

export function UserManagementClient({ 
    initialUsers, 
    initialPagination,
    currentUserRole = "admin",
    currentUserEmail,
    currentUserId,
}: UserManagementClientProps) {
    const isSuperAdmin = currentUserRole === "superadmin" || currentUserEmail?.toLowerCase() === "mohitraj7321@gmail.com";
    const [users, setUsers] = useState<any[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState<number>(initialPagination.page);
    const [totalPages, setTotalPages] = useState<number>(initialPagination.pages);
    const [totalUsers, setTotalUsers] = useState<number>(initialPagination.total);
    const [loading, setLoading] = useState(false);
    const [isInitialMount, setIsInitialMount] = useState(true);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        // Skip the very first fetch on mount because we already have initialUsers from props
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: searchTerm,
            });

            const res = await fetch(`/api/admin/users?${params}`);
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
        const target = users.find((u) => u._id === userId);
        if (target?.role === "superadmin") {
            alert("Superadmin accounts are protected and cannot be deleted.");
            return;
        }
        if (!isSuperAdmin && target?.role === "admin") {
            alert("Only Superadmin can delete Admin accounts.");
            return;
        }
        if (userId === currentUserId) {
            alert("You cannot delete your own account.");
            return;
        }

        if (!confirm(`Are you sure you want to delete user ${target?.email || userId}?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                fetchUsers();
            } else {
                const errData = await res.json();
                alert(errData.error || "Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const target = users.find((u) => u._id === userId);

        if (target?.role === "superadmin" && !isSuperAdmin) {
            alert("Only a Superadmin can modify a Superadmin account.");
            return;
        }

        if (!isSuperAdmin && (newRole === "admin" || newRole === "superadmin")) {
            alert("Only a Superadmin can promote users to Admin or Superadmin.");
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
            } else {
                const errData = await res.json();
                alert(errData.error || "Failed to update role");
            }
        } catch (error) {
            console.error("Role change error:", error);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "superadmin": return "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20";
            case "admin": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
            case "teacher": return "bg-purple-500/20 text-purple-400 border-purple-500/50";
            case "student": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
        >
            <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="overflow-auto max-h-[600px] relative">
                {/* Loading Overlay */}
                <AnimatePresence>
                    {loading && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-blue-400 font-black uppercase tracking-widest text-[10px]">Updating User List...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Table>
                    <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md font-bold">
                        <TableRow className="border-white/10">
                            <TableHead className="text-gray-300 px-6 py-4">User Details</TableHead>
                            <TableHead className="text-gray-300 px-6 py-4">Contact Info</TableHead>
                            <TableHead className="text-gray-300 px-6 py-4">Hierarchy Role</TableHead>
                            <TableHead className="text-gray-300 px-6 py-4">Joined Date</TableHead>
                            <TableHead className="text-gray-300 px-6 py-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="wait">
                            {users.length === 0 && !loading ? (
                                <TableRow><TableCell colSpan={5} className="h-64 text-center text-gray-400">No users found.</TableCell></TableRow>
                            ) : (
                                users.map((user) => (
                                    <motion.tr key={user._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-white/5 hover:bg-white/5 group">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${user.role === 'superadmin' ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/20' : user.role === 'admin' ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                                                    {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                                                        {user.role === "superadmin" && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                                                <Crown size={11} className="text-amber-400" /> Owner
                                                            </span>
                                                        )}
                                                        {user.role === "admin" && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                                                <Shield size={11} className="text-blue-400" /> Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500 text-xs">ID: {user._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm">{user.email}</span></div>
                                                {user.phone && <div className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4 text-gray-500" /><span className="text-xs">{user.phone}</span></div>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {user.role === "superadmin" && !isSuperAdmin ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20">
                                                    <Crown size={13} className="text-amber-400" /> Superadmin
                                                </span>
                                            ) : (
                                                <select 
                                                    value={user.role} 
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)} 
                                                    disabled={user.role === "superadmin" && user._id === currentUserId}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black border bg-black/40 outline-none cursor-pointer transition-all ${getRoleBadgeColor(user.role)} ${user.role === "superadmin" && user._id === currentUserId ? "opacity-80 cursor-not-allowed" : ""}`}
                                                    title={user.role === "superadmin" && user._id === currentUserId ? "Primary Superadmin (Locked)" : "Change user role"}
                                                >
                                                    <option value="student" className="bg-gray-900 text-white font-medium">Student</option>
                                                    <option value="teacher" className="bg-gray-900 text-white font-medium">Teacher</option>
                                                    {isSuperAdmin && (
                                                        <>
                                                            <option value="admin" className="bg-gray-900 text-blue-300 font-semibold">🛡️ Admin</option>
                                                            <option value="superadmin" className="bg-gray-900 text-amber-300 font-bold">👑 Superadmin</option>
                                                        </>
                                                    )}
                                                    {!isSuperAdmin && user.role === "admin" && (
                                                        <option value="admin" className="bg-gray-900 text-blue-300 font-semibold">🛡️ Admin</option>
                                                    )}
                                                </select>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4 text-gray-500" /><span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span></div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            {user.role === "superadmin" || (user.role === "admin" && !isSuperAdmin) || user._id === currentUserId ? (
                                                <span className="text-gray-500 text-xs font-medium px-2 py-1 select-none">
                                                    Protected
                                                </span>
                                            ) : (
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)} className="text-gray-400 hover:text-red-400 cursor-pointer">
                                                    <Trash2 size={18} />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
                    <div className="text-sm text-gray-400">Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="bg-black/20 border-white/10 text-white"><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="bg-black/20 border-white/10 text-white"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
