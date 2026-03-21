"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, GraduationCap, Briefcase, Bot, BrainCircuit, Code, User, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NavItem = ({ href, icon: Icon, label, isActive, onClick }: { 
    href?: string; 
    icon: any; 
    label: string; 
    isActive?: boolean;
    onClick?: () => void;
}) => {
    const content = (
        <div className="flex flex-col items-center justify-center flex-1 h-full relative group cursor-pointer pt-1">
            <div className={cn(
                "relative p-1 rounded-xl transition-all duration-300",
                isActive ? "text-blue-400 bg-blue-500/10" : "text-gray-500 group-hover:text-gray-300"
            )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-blue-500/20 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </div>
            <span className={cn(
                "text-[9px] sm:text-[10px] whitespace-nowrap font-bold mt-0.5 tracking-tight transition-colors duration-300",
                isActive ? "text-blue-400" : "text-gray-500"
            )}>
                {label}
            </span>
        </div>
    );

    if (onClick) {
        return <div onClick={onClick}>{content}</div>;
    }

    // Prevent navigation if already active to stop redundant re-mounting
    if (isActive) {
        return <div className="flex-1 h-full cursor-default">{content}</div>;
    }

    return (
        <Link href={href || "#"} className="flex-1 h-full">
            {content}
        </Link>
    );
};

export function MobileBottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const isApp = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
        setIsStandalone(isApp);
        
        if (isApp) {
            document.body.classList.add('pb-32');
        } else {
            document.body.classList.remove('pb-32');
        }

        return () => {
            document.body.classList.remove('pb-32');
        };
    }, []);

    // Only show on mobile AND in standalone mode
    // Hide on admin and teacher pages
    const isRestrictedPage = pathname?.startsWith('/admin') || pathname?.startsWith('/teacher');
    if (!isStandalone || isRestrictedPage) return null;
    return (
        <>
            <div 
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none origin-bottom"
                style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
            >
                <motion.nav 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full bg-black/90 backdrop-blur-3xl border-t border-white/10 shadow-2xl pointer-events-auto flex items-center justify-between px-1 pb-[env(safe-area-inset-bottom,0px)] h-[calc(4.5rem+env(safe-area-inset-bottom,0px))] relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
                    
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
                        label="Intern" 
                        isActive={pathname === "/internships"} 
                    />
                <NavItem 
                    href="/playground" 
                    icon={Code} 
                    label="DevLab" 
                    isActive={pathname === "/playground"} 
                />

                    <NavItem 
                        href="/ai-weboryskills" 
                        icon={Bot} 
                        label="AI Mentor" 
                        isActive={pathname === "/ai-weboryskills"} 
                    />

                    <NavItem 
                        href="/ai-prep" 
                        icon={BrainCircuit} 
                        label="AI Nexus" 
                        isActive={pathname === "/ai-prep"} 
                    />

                </motion.nav>
            </div>
        </>
    );
}
