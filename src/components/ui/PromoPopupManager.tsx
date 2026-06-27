"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type PromoPopup = {
  id: string;
  pagePath: string;
  imageUrl: string;
  linkUrl: string;
  enabled: boolean;
};

export default function PromoPopupManager() {
  const pathname = usePathname();
  const [popups, setPopups] = useState<PromoPopup[]>([]);
  const [activePopup, setActivePopup] = useState<PromoPopup | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (mounted && data.promoPopups) {
          setPopups(data.promoPopups);
        }
      })
      .catch(err => console.error("Failed to fetch popups", err));

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!popups || popups.length === 0) return;

    // Support wildcard matching or exact path matching
    const matchingPopup = popups.find(p => 
      p.enabled && (
        p.pagePath === "*" || 
        p.pagePath === pathname || 
        (pathname.startsWith(p.pagePath) && p.pagePath !== "/" && p.pagePath.length > 1)
      )
    );

    const exactMatch = popups.find(p => p.enabled && p.pagePath === pathname);
    const popupToShow = exactMatch || matchingPopup;

    if (popupToShow) {
      const sessionKey = `promo_popup_closed_${popupToShow.id}`;
      const hasClosed = sessionStorage.getItem(sessionKey);
      
      if (!hasClosed) {
        const timer = setTimeout(() => {
          setActivePopup(popupToShow);
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        setActivePopup(null);
      }
    } else {
      setActivePopup(null);
    }
  }, [pathname, popups]);

  const handleClose = () => {
    if (activePopup) {
      sessionStorage.setItem(`promo_popup_closed_${activePopup.id}`, "true");
      setActivePopup(null);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (activePopup?.linkUrl) {
      window.location.href = activePopup.linkUrl;
    }
  };

  return (
    <AnimatePresence>
      {activePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/80 text-white/70 hover:text-white p-2 rounded-full backdrop-blur-md transition-all group"
            >
              <X size={20} className="group-hover:scale-110 transition-transform" />
            </button>

            <div 
                className={`w-full relative ${activePopup.linkUrl ? 'cursor-pointer' : ''}`}
                onClick={handleImageClick}
            >
                <img 
                    src={activePopup.imageUrl} 
                    alt="Promotional Offer" 
                    className="w-full h-auto object-contain max-h-[80vh]"
                />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
