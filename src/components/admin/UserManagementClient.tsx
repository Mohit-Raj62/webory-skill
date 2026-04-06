"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Search, ChevronLeft, ChevronRight, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function UserManagementClient({ initialUsers, initialPagination }: { initialUsers: any[], initialPagination: any }) {
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
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error("Delete error:", error);
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
            }
        } catch (error) {
            console.error("Role change error:", error);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
            case "teacher": return "bg-purple-500/20 text-purple-400 border-purple-500/50";
            case "student": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
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
                            <TableHead className="text-gray-300 px-6 py-4">Role</TableHead>
                            <TableHead className="text-gray-300 px-6 py-4">Joined Date</TableHead>
                            <TableHead className="text-gray-300 px-6 py-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="wait">
                            {users.length === 0 && !loading ? (
                                <TableRow><TableCell colSpan={5} className="h-64 text-center text-gray-400">No users found.</TableCell></TableRow>
                            ) : (
                                users.map((user, index) => (
                                    <motion.tr key={user._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border-b border-white/5 hover:bg-white/5 group">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">{user.firstName[0]}</div>
                                                <div><p className="text-white font-medium">{user.firstName} {user.lastName}</p><p className="text-gray-500 text-xs">ID: {user._id.slice(-6).toUpperCase()}</p></div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-300"><Mail className="w-4 h-4" /><span className="text-sm">{user.email}</span></div>
                                                {user.phone && <div className="flex items-center gap-2 text-gray-400"><Phone className="w-4 h-4" /><span className="text-xs">{user.phone}</span></div>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className={`px-3 py-1.5 rounded-lg text-sm font-black border bg-black/20 outline-none ${getRoleBadgeColor(user.role)}`}>
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4" /><span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span></div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)} className="text-gray-400 hover:text-red-400"><Trash2 size={18} /></Button>
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
