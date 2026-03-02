"use client";

import dynamic from "next/dynamic";

const SupportChatbot = dynamic(() => import("@/components/SupportChatbot"), { 
    ssr: false,
    loading: () => null 
});

export default function SupportChatbotWrapper() {
    return <SupportChatbot />;
}
