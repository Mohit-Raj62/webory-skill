import type { Metadata } from "next";
import { Inter, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import { InactivityLogout } from "@/components/auth/inactivity-logout";
import { SessionProvider } from "@/components/auth/session-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes"
});

export const metadata: Metadata = {
    title: "WEBORY - Skill Custom Startup Platform",
    description: "Master skills, build projects, and launch your career with Webory.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.variable,
                outfit.variable,
                greatVibes.variable
            )}>
                <ProgressBar />
                <SessionProvider>
                    <InactivityLogout />
                    {children}
                </SessionProvider>
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
