import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Great_Vibes } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SessionProvider } from "@/components/auth/session-provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import dynamic from "next/dynamic";

// Defer non-critical global components to boost initial performance and LCP
import { GlobalClientBootstrap } from "@/components/GlobalClientBootstrap";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-great-vibes"
});

export const viewport: Viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://www.weboryskills.in"),
    title: {
        default: "WEBORY - Skill Custom Startup Platform | Learn, Build, Grow",
        template: "%s | WEBORY"
    },
    description: "Master industry-relevant skills, build real-world projects, and launch your career with Webory. Join thousands of students learning and growing together.",
    keywords: ["online courses", "internships", "skill development", "web development", "coding", "career growth", "webory", "webory skills", "startup"],
    authors: [{ name: "Mohit Sinha", url: "https://www.linkedin.com/in/mohit0sinha" }, { name: "Webory Team" }],
    creator: "Mohit Sinha",
    publisher: "Webory Skills",
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
        icon: "/favicon.png?v=6",
    },
    manifest: "/manifest.json?v=6",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "WeborySkills",
    },
    formatDetection: {
        telephone: false,
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
        <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
            <body className={cn(
                "min-h-screen bg-background font-sans antialiased",
                inter.variable,
                outfit.variable,
                greatVibes.variable
            )}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "Organization",
                                    "@id": "https://www.weboryskills.in/#organization",
                                    "name": "Webory",
                                    "alternateName": "Webory Skills",
                                    "url": "https://www.weboryskills.in",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://www.weboryskills.in/favicon.png"
                                    },
                                    "founder": {
                                        "@id": "https://www.weboryskills.in/#person"
                                    },
                                    "sameAs": [
                                        "https://www.linkedin.com/in/webory-skills-01244b3a9",
                                        "https://www.instagram.com/weboryskills",
                                        "https://www.youtube.com/@CodeWithWebory"
                                    ]
                                },
                                {
                                    "@type": "Person",
                                    "@id": "https://www.weboryskills.in/#person",
                                    "name": "Mohit Sinha",
                                    "jobTitle": "Founder & CEO",
                                    "url": "https://www.weboryskills.in",
                                    "sameAs": [
                                        "https://www.linkedin.com/in/mohit0sinha",
                                        "https://github.com/Mohit-Raj62",
                                        "https://www.instagram.com/mohit_sinha_official"
                                    ],
                                    "worksFor": {
                                        "@id": "https://www.weboryskills.in/#organization"
                                    }
                                }
                            ]
                        })
                    }}
                />
                <Script id="pwa-install-capture" strategy="afterInteractive">
                    {`
                        window.deferredPrompt = null;
                        window.addEventListener('beforeinstallprompt', (e) => {
                            e.preventDefault();
                            window.deferredPrompt = e;
                            console.log('PWA: Prompt captured globally');
                            window.dispatchEvent(new Event('pwa-prompt-captured'));
                        });
                    `}
                </Script>
                <Suspense fallback={null}>
                    <ProgressBar />
                </Suspense>
                <SessionProvider>
                    <GlobalClientBootstrap />
                    {children}
                </SessionProvider>
                <Toaster position="top-right" richColors />
                <SpeedInsights />
            </body>
        </html>
    );
}
