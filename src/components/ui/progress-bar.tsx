"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // When pathname or searchParams change, it means navigation completed
        setIsLoading(false);
    }, [pathname, searchParams]);

    // We can't easily detect "start" of navigation in App Router without wrapping Link
    // But we can show a loader when the user clicks a link by intercepting clicks globally
    // or just relying on the fact that Next.js is fast.

    // However, for a "smooth redirect experience", users often want to see *something* happening.
    // A common trick is to start the loader when a link is clicked.

    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.href && anchor.href.startsWith(window.location.origin) && !anchor.target) {
                if (anchor.href !== window.location.href) {
                    setIsLoading(true);
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100]">
            <div className="h-full bg-blue-500 animate-progress origin-left"></div>
        </div>
    );
}
