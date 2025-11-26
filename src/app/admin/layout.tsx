"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    router.push("/login");
                    return;
                }

                const data = await res.json();
                if (data.user.role !== "admin") {
                    router.push("/");
                    return;
                }

                setIsAdmin(true);
            } catch (error) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading admin panel...</div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-auto flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm sticky top-0 z-30">
                    <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
}
