import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt for garbage collection
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Optionally set a flag in localStorage to not show again
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Don't show if user already dismissed or if in standalone mode
  if (!showPrompt || localStorage.getItem('installPromptDismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-[430px]">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-[#517b34] p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-[#517b34] rounded-xl flex items-center justify-center text-2xl">
            ⛳
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-['Geologica',_sans-serif] font-semibold text-[#282828] text-[16px] mb-1" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Install Hooky Golf
          </h3>
          <p className="font-['Geologica',_sans-serif] text-[#517b34] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Add to home screen for the best experience
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="bg-[#517b34] text-white px-4 py-2 rounded-xl font-['Geologica',_sans-serif] font-medium text-[14px] hover:bg-[#456628] transition-colors"
            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}