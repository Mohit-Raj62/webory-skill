"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const fetchUser = async () => {
        try {
            // Skip auth check on public routes to speed up initial load, 
            // but we might need it for "Login" vs "Dashboard" buttons.
            // So we'll fetch, but maybe lazily or we accept it might fail.
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Re-fetch on login/signup success is handled by manual refreshAuth calls usually,
    // or we can listen to pathname changes if we expect auth state to change on navigation
    // (unlikely unless logging out).

    return (
        <AuthContext.Provider value={{ user, loading, refreshAuth: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}
