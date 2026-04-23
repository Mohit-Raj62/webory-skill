"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, GraduationCap, Briefcase, Bot, BrainCircuit, Code, User, MessageSquare, LayoutGrid } from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NavItem = ({ href, icon: Icon, label, isActive, onClick, isCenter }: { 
    href?: string; 
    icon: any; 
    label: string; 
    isActive?: boolean;
    onClick?: () => void;
    isCenter?: boolean;
}) => {
    const content = (
        <motion.div 
            whileTap={{ y: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex flex-col items-center justify-center flex-1 h-full relative group cursor-pointer pt-1 min-w-0"
        >
            <div className={cn(
                "relative transition-all duration-300 flex items-center justify-center",
                isCenter 
                    ? "w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/40 text-white border border-white/20"
                    : "p-1 rounded-xl",
                !isCenter && (isActive ? "text-blue-400 bg-blue-500/10" : "text-gray-500 group-hover:text-gray-300")
            )}>
                <Icon size={isCenter ? 22 : 22} strokeWidth={isActive || isCenter ? 2.5 : 2} />
                {isActive && !isCenter && (
                    <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-blue-500/20 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </div>
            <span className={cn(
                "text-[8px] sm:text-[10px] whitespace-nowrap font-bold tracking-tight transition-colors duration-300 truncate w-full px-0.5 text-center mt-0.5",
                isCenter ? "text-gray-300" : (isActive ? "text-blue-400" : "text-gray-500")
            )}>
                {label}
            </span>
        </motion.div>
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
    const [isHiddenByMain, setIsHiddenByMain] = useState(false);
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

        // Specific fix for AI Mentor immersive mode
        let observer: MutationObserver | null = null;
        if (typeof window !== 'undefined' && window.MutationObserver) {
            observer = new window.MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "attributes" && mutation.attributeName === "class") {
                        setIsHiddenByMain(document.body.classList.contains("hide-mobile-bottom-nav"));
                    }
                });
            });

            observer.observe(document.body, { attributes: true });
            setIsHiddenByMain(document.body.classList.contains("hide-mobile-bottom-nav"));
        }

        return () => {
            document.body.classList.remove('pb-32');
            if (observer) observer.disconnect();
        };
    }, []);

    // Only show on mobile AND in standalone mode
    // Hide on admin and teacher pages, or when suppressed by main content
    const isRestrictedPage = pathname?.startsWith('/admin') || pathname?.startsWith('/teacher');
    if (!isStandalone || isRestrictedPage || isHiddenByMain) return null;
    return (
        <>
            <div 
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none origin-bottom"
                style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
            >
                <motion.nav 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full bg-black/95 backdrop-blur-3xl border-t border-white/10 shadow-2xl pointer-events-auto flex items-center justify-between px-1 pb-[env(safe-area-inset-bottom,0px)] h-[calc(4.5rem+env(safe-area-inset-bottom,0px))] relative"
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
                        href="/explore" 
                        icon={LayoutGrid} 
                        label="Menu" 
                        isActive={pathname === "/explore"}
                        isCenter={true}
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
