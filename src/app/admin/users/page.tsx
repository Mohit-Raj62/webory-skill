"use client";

import { useEffect, useState } from "react";
import { Trash2, Shield, User as UserIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState < User[] > ([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
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
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(users.filter((u) => u._id !== userId));
                alert("User deleted successfully");
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
                setUsers(
                    users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
                );
                alert("Role updated successfully");
            } else {
                alert("Failed to update role");
            }
        } catch (error) {
            console.error("Role change error:", error);
            alert("Failed to update role");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-gray-400">Manage all registered users</p>
                </div>
            </div>

            {/* Search */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Students</p>
                    <p className="text-3xl font-bold text-white">
                        {users.filter((u) => u.role === "student").length}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Admins</p>
                    <p className="text-3xl font-bold text-white">
                        {users.filter((u) => u.role === "admin").length}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Joined
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.firstName[0]}
                                                {user.lastName[0]}
                                            </div>
                                            <span className="text-white font-medium">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500/50 outline-none"
                                        >
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                            title="Delete user"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}
