"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SupportChatbot = dynamic(() => import("@/components/SupportChatbot"), { 
    ssr: false,
    loading: () => null 
});

export default function SupportChatbotWrapper() {
    const pathname = usePathname();
    
    // Hide chatbot on exams, admin, teacher, checkout, payment, and support paths
    if (
        pathname?.startsWith("/exams") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/teacher") ||
        pathname?.startsWith("/payment") ||
        pathname?.startsWith("/checkout") ||
        pathname?.startsWith("/support")
    ) {
        return null;
    }

    return <SupportChatbot />;
}
