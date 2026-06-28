"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoPopup {
  id: string;
  page: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

export function PromoPopupDisplay() {
  const pathname = usePathname();
  const [popups, setPopups] = useState<PromoPopup[]>([]);
  const [activePopup, setActivePopup] = useState<PromoPopup | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.promoPopups) {
            setPopups(data.promoPopups.filter((p: PromoPopup) => p.isActive));
          }
        }
      } catch (error) {
        console.error("Failed to fetch promo popups", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    // Determine the logical "page" identifier for the current route
    let currentPage = "home";
    if (pathname === "/") currentPage = "home";
    else if (pathname.startsWith("/courses")) currentPage = "courses";
    else if (pathname.startsWith("/internships")) currentPage = "internships";
    else currentPage = pathname.replace("/", ""); // Fallback

    // Check if there is an active popup for this page
    const popupForPage = popups.find(p => p.page === currentPage || p.page === "all");

    if (popupForPage) {
      // Check session storage to see if dismissed in this session
      const sessionKey = `promo_dismissed_${popupForPage.id}`;
      const hasDismissed = sessionStorage.getItem(sessionKey);
      
      if (!hasDismissed) {
        setActivePopup(popupForPage);
        setIsDismissed(false);
      } else {
        setActivePopup(null);
      }
    } else {
      setActivePopup(null);
    }
  }, [pathname, popups]);

  const handleDismiss = () => {
    if (activePopup) {
      sessionStorage.setItem(`promo_dismissed_${activePopup.id}`, "true");
      setIsDismissed(true);
      setTimeout(() => setActivePopup(null), 300);
    }
  };

  if (!activePopup || isDismissed) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center justify-center shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden bg-[#030616] border border-white/10"
        >
          {/* Close Button - Responsive padding and size */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 p-2 sm:p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all shadow-lg border border-white/10"
            aria-label="Close promotion"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>

          {/* Image Container */}
          <div className="relative w-full overflow-hidden flex justify-center items-center">
            {activePopup.linkUrl ? (
              <a href={activePopup.linkUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={activePopup.imageUrl} 
                  alt="Promotion" 
                  className="w-full h-auto max-h-[70vh] object-contain md:object-cover hover:scale-[1.02] transition-transform duration-500" 
                />
              </a>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={activePopup.imageUrl} 
                alt="Promotion" 
                className="w-full h-auto max-h-[70vh] object-contain md:object-cover" 
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
