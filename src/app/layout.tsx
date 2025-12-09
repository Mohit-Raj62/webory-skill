import type { Metadata } from "next";
import { Inter, Outfit, Great_Vibes } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import { InactivityLogout } from "@/components/auth/inactivity-logout";
import { SessionProvider } from "@/components/auth/session-provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes"
});

export const metadata: Metadata = {
    metadataBase: new URL("https://www.weboryskills.in"),
    title: {
        default: "WEBORY - Skill Custom Startup Platform | Learn, Build, Grow",
        template: "%s | WEBORY"
    },
    description: "Master industry-relevant skills, build real-world projects, and launch your career with Webory. Join thousands of students learning and growing together.",
    keywords: ["online courses", "internships", "skill development", "web development", "coding", "career growth", "webory", "webory skills", "startup"],
    authors: [{ name: "Webory Team" }],
    creator: "Webory",
    publisher: "Webory",
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://www.weboryskills.in",
        title: "WEBORY - Skill Custom Startup Platform",
        description: "Master skills, build projects, and launch your career with Webory.",
        siteName: "Webory Skills",
        images: [{
            url: "/og-image.png",
            width: 1200,
            height: 630,
            alt: "Webory - Skill Custom Startup Platform",
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "WEBORY - Skill Custom Startup Platform",
        description: "Master skills, build projects, and launch your career with Webory.",
        images: ["/og-image.png"],
    },
    icons: {
        icon: "/favicon.svg",
    },
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: "7M8LteKBcSZdSqwJCwSCL3y34uSUp4jNpUgWfTJqOCw",
        other: {
            "msvalidate.01": "9EEB13D9C5495A05BFC05E2D240C17D3",
        },
    },
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
                <Suspense fallback={null}>
                    <ProgressBar />
                </Suspense>
                <SessionProvider>
                    <InactivityLogout />
                    {children}
                </SessionProvider>
                <Toaster position="top-right" richColors />
                <SpeedInsights />
            </body>
        </html>
    );
}
