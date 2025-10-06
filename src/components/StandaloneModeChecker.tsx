import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Development tool to check if app is running in standalone mode
 * Shows a dismissible banner if NOT in standalone mode on iOS
 */
export function StandaloneModeChecker() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isiOS, setIsiOS] = useState(false);
  const [permanentlyDismissed, setPermanentlyDismissed] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    displayMode: '',
    navStandalone: '',
    userAgent: '',
    viewport: ''
  });

  useEffect(() => {
    // Check if user permanently dismissed the banner
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed === 'true') {
      setPermanentlyDismissed(true);
      return;
    }

    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsiOS(iOS);

    // Check if in standalone mode
    const matchesStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const navStandalone = (window.navigator as any).standalone;
    
    // iOS 18 workaround: Check if window is running in fullscreen viewport
    // which indicates it was launched from home screen even if standalone flag is false
    const isFullViewport = iOS && (
      window.innerHeight === window.screen.height ||
      window.innerHeight >= window.screen.height - 100 // Allow for some OS UI
    );
    
    // Also check if Safari UI is hidden (another indicator of home screen launch)
    const noSafariUI = iOS && (
      // In true Safari, window.innerHeight is less than screen.availHeight
      // In PWA mode, they should be close
      Math.abs(window.innerHeight - window.screen.availHeight) < 100
    );
    
    const standalone = matchesStandalone || navStandalone === true || isFullViewport || noSafariUI;
    
    setIsStandalone(standalone);

    // Collect debug info
    const displayMode = matchesStandalone ? 'standalone' :
                        window.matchMedia('(display-mode: fullscreen)').matches ? 'fullscreen' :
                        window.matchMedia('(display-mode: minimal-ui)').matches ? 'minimal-ui' : 'browser';
    
    setDebugInfo({
      displayMode,
      navStandalone: String(navStandalone),
      userAgent: navigator.userAgent.substring(0, 80),
      viewport: `${window.innerWidth}x${window.innerHeight} (screen: ${window.screen.availHeight})`
    });

    // Show banner only if on iOS and NOT in standalone mode
    if (iOS && !standalone) {
      setShowBanner(true);
    }
  }, []);

  const handlePermanentDismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', 'true');
    setPermanentlyDismissed(true);
    setShowBanner(false);
  };

  // Don't show anything if not on iOS or already in standalone or permanently dismissed
  if (!showBanner || permanentlyDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#f97316] text-white px-4 py-3 shadow-lg">
      <div className="flex flex-col gap-2 max-w-[430px] mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-['Geologica:Bold',_sans-serif] text-[14px] mb-1" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              ⚠️ Not in Standalone Mode
            </p>
            <p className="font-['Geologica:Regular',_sans-serif] text-[12px] opacity-90" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              You're in Safari browser mode. Tap the home screen icon to launch the app properly.
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

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center gap-2 text-[12px] opacity-75 hover:opacity-100 transition-opacity"
          >
            {showDebug ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Debug Info</span>
          </button>
          
          <button
            onClick={handlePermanentDismiss}
            className="text-[12px] opacity-75 hover:opacity-100 transition-opacity underline"
          >
            Don't show again
          </button>
        </div>

        {/* Debug info panel */}
        {showDebug && (
          <div className="bg-black/20 rounded p-3 text-[11px] font-mono">
            <div className="space-y-1">
              <div><span className="opacity-75">Display Mode:</span> {debugInfo.displayMode}</div>
              <div><span className="opacity-75">Nav Standalone:</span> {debugInfo.navStandalone}</div>
              <div><span className="opacity-75">Viewport:</span> {debugInfo.viewport}</div>
              <div><span className="opacity-75">Screen Height:</span> {window.screen.height}</div>
              <div><span className="opacity-75">Avail Height:</span> {window.screen.availHeight}</div>
              <div><span className="opacity-75">Window Height:</span> {window.innerHeight}</div>
              <div className="truncate"><span className="opacity-75">UA:</span> {debugInfo.userAgent}...</div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/20 text-[10px] opacity-75">
              {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? (
                <p>⚠️ Running locally - iOS PWA features only work on HTTPS deployment</p>
              ) : (
                <>
                  <p className="mb-1">ℹ️ If you see "browser" mode after launching from home screen icon, this is an iOS 18 bug.</p>
                  <p>✅ The app still works fine - tap "Don't show again" to hide this banner.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
