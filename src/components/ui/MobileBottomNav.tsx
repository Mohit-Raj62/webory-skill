"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, GraduationCap, Briefcase, Code2, User } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import { cn } from "@/lib/utils";

const NavItem = ({ href, icon: Icon, label, isActive }: { 
    href: string; 
    icon: any; 
    label: string; 
    isActive: boolean;
}) => (
    <Link href={href} className="flex flex-col items-center justify-center flex-1 h-full relative group">
        <div className={cn(
            "relative p-2 rounded-xl transition-all duration-300",
            isActive ? "text-blue-400 bg-blue-500/10" : "text-gray-500 group-hover:text-gray-300"
        )}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-blue-500/20 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </div>
        <span className={cn(
            "text-[10px] font-bold mt-1 tracking-tight transition-colors duration-300",
            isActive ? "text-blue-400 shadow-blue-500/50" : "text-gray-500"
        )}>
            {label}
        </span>
    </Link>
);

export function MobileBottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Only show on mobile
    return (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[100] h-16 pointer-events-none">
            <motion.nav 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full h-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto flex items-center justify-around px-2 relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
                
                <NavItem 
                    href="/" 
                    icon={Home} 
                    label="Home" 
                    isActive={pathname === "/"} 
                />
                
                <NavItem 
                    href="/courses" 
                    icon={GraduationCap} 
                    label="Courses" 
                    isActive={pathname === "/courses"} 
                />

                <NavItem 
                    href="/internships" 
                    icon={Briefcase} 
                    label="Hiring" 
                    isActive={pathname === "/internships"} 
                />

                <NavItem 
                    href="/playground" 
                    icon={Code2} 
                    label="DevLab" 
                    isActive={pathname === "/playground"} 
                />

                <NavItem 
                    href={user ? (user.role === 'admin' ? "/admin" : "/profile") : "/login"} 
                    icon={User} 
                    label={user ? "Profile" : "Log In"} 
                    isActive={pathname === "/profile" || pathname === "/admin" || pathname === "/login"} 
                />
            </motion.nav>
        </div>
    );
}
