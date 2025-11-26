"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function SessionProvider({ children }: { children: React.ReactNode }) {
    // TEMPORARILY DISABLED - Causing redirect loop
    // Single device login feature will be re-enabled after fixing the session persistence issue

    // const router = useRouter();
    // const pathname = usePathname();

    // useEffect(() => {
    //     // Don't check session on public pages
    //     if (pathname === '/login' || pathname === '/signup' || pathname === '/') return;

    //     const checkSession = async () => {
    //         try {
    //             const res = await fetch('/api/auth/session');
    //             if (res.status === 401) {
    //                 const data = await res.json();

    //                 // Clear cookie via API call to logout
    //                 await fetch('/api/auth/logout', { method: 'POST' });

    //                 if (data.reason === 'session_mismatch') {
    //                     toast.error("You have been logged out because your account was logged in on another device.");
    //                 }

    //                 router.push('/login');
    //             }
    //         } catch (error) {
    //             console.error("Session check failed", error);
    //         }
    //     };

    //     // Check immediately on mount
    //     checkSession();

    //     // Check periodically (every 30 seconds)
    //     const interval = setInterval(checkSession, 30000);

    //     // Check on window focus
    //     const handleFocus = () => checkSession();
    //     window.addEventListener('focus', handleFocus);

    //     return () => {
    //         clearInterval(interval);
    //         window.removeEventListener('focus', handleFocus);
    //     };
    // }, [pathname, router]);

    return <>{children}</>;
}
