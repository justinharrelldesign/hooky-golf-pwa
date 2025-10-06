import { useState, useEffect } from "react";
import { X } from "lucide-react";

/**
 * Development tool to check if app is running in standalone mode
 * Shows a dismissible banner if NOT in standalone mode on iOS
 */
export function StandaloneModeChecker() {
  const [showBanner, setShowBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isiOS, setIsiOS] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsiOS(iOS);

    // Check if in standalone mode
    const standalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone);

    // Show banner only if on iOS and NOT in standalone mode
    if (iOS && !standalone) {
      setShowBanner(true);
    }
  }, []);

  // Don't show anything if not on iOS or already in standalone
  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#f97316] text-white px-4 py-3 shadow-lg">
      <div className="flex items-start gap-3 max-w-[430px] mx-auto">
        <div className="flex-1">
          <p className="font-['Geologica:Bold',_sans-serif] text-[14px] mb-1" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            ⚠️ Not in Standalone Mode
          </p>
          <p className="font-['Geologica:Regular',_sans-serif] text-[12px] opacity-90" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            To install: Tap Share → "Add to Home Screen" → Launch from home screen icon
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
