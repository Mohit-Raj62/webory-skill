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
    Star,
    Tag,
    Video,
    Settings,
    CreditCard,
    Award,
    Database,
    Megaphone,
    Gift,
    Shield,
    ShieldCheck,
    Home,
    Terminal,
    Trophy,
    Film,
    Crown,
    History,
    X,
    CheckSquare,
    BrainCircuit,
} from "lucide-react";

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    superadminOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { name: "Back to Website", href: "/", icon: Home },
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Examinations", href: "/admin/exams", icon: CheckSquare },
    { name: "Question Bank", href: "/admin/question-bank", icon: BrainCircuit },
    { name: "Internships", href: "/admin/internships", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
    { name: "Doubts", href: "/admin/doubts", icon: MessageCircle },
    { name: "Feedback", href: "/admin/feedback", icon: Star },
    { name: "Video Testimonials", href: "/admin/video-testimonials", icon: Film },
    { name: "Promo Codes", href: "/admin/promo-codes", icon: Tag },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Live Classes", href: "/admin/live-classes", icon: Video },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Careers (Jobs)", href: "/admin/careers/jobs", icon: Briefcase },
    { name: "Job Applications", href: "/admin/careers/applications", icon: FileText },
    { name: "Live Interest", href: "/admin/activity", icon: Video },
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "Rewards", href: "/admin/rewards", icon: Gift },
    { name: "WeboryOS", href: "/admin/simulators", icon: Terminal },
    { name: "Hackathons", href: "/admin/hackathons", icon: Trophy },
    { name: "Campus Ambassadors", href: "/admin/ambassadors", icon: Megaphone },
    // 👑 Founder & Superadmin Exclusive Controls:
    { name: "Audit Logs", href: "/admin/audit-logs", icon: History, superadminOnly: true },
    { name: "Analytics & Revenue", href: "/admin/analytics", icon: BarChart3, superadminOnly: true },
    { name: "Broadcast Emails", href: "/admin/broadcast", icon: Megaphone, superadminOnly: true },
    { name: "Employee KYC", href: "/admin/employee-verifications", icon: Shield, superadminOnly: true },
    { name: "Maintenance", href: "/admin/maintenance", icon: Database, superadminOnly: true },
    { name: "System Settings", href: "/admin/settings", icon: Settings, superadminOnly: true },
    { name: "Consent Logs", href: "/admin/consent", icon: ShieldCheck, superadminOnly: true },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    role?: string;
}

export function AdminSidebar({ isOpen, onClose, role = "admin" }: AdminSidebarProps) {
    const pathname = usePathname();
    const isSuperAdmin = role === "superadmin";

    // Filter menu items: Hide sensitive founder items from regular admins
    const visibleMenuItems = menuItems.filter((item) => !item.superadminOnly || isSuperAdmin);

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
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo & Close Button */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                {isSuperAdmin ? "Super Admin Panel" : "Admin Panel"}
                            </h1>
                            {isSuperAdmin && (
                                <Crown size={17} className="text-amber-400 shrink-0" />
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            {isSuperAdmin ? "Founder Control Center" : "Webory Skills Management"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white md:hidden"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {visibleMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Icon size={18} className="shrink-0" />
                                <span className="font-medium text-sm truncate">{item.name}</span>
                                {item.superadminOnly && isSuperAdmin && (
                                    <span className="ml-auto text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                                        Owner
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/login";
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-semibold cursor-pointer"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
