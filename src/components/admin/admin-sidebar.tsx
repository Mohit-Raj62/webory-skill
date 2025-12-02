"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Briefcase,
    FileText,
    GraduationCap,
    BarChart3,
    MessageCircle,
    LogOut,
    X,
    Star,
    Tag,
    Video,
    Settings,
    CreditCard,
    Award,
} from "lucide-react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Internships", href: "/admin/internships", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Doubts", href: "/admin/doubts", icon: MessageCircle },
    { name: "Feedback", href: "/admin/feedback", icon: Star },
    { name: "Promo Codes", href: "/admin/promo-codes", icon: Tag },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Live Classes", href: "/admin/live-classes", icon: Video },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo & Close Button */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                        <p className="text-sm text-gray-400 mt-1">Skill Webory</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white md:hidden"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()} // Close sidebar on mobile when link clicked
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={async () => {
                            try {
                                await fetch("/api/auth/logout", { method: "POST" });
                                window.location.href = "/login";
                            } catch (error) {
                                console.error("Logout failed", error);
                            }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
