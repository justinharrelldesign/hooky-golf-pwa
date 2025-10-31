import logoImg from "figma:asset/ed23857f34d6f0a2a5b953c943f636d2775b57ff.png";
import { BottomNav } from "./BottomNav";

interface ProfileScreenProps {
  onNavigateHome: () => void;
  onNavigateGallery: () => void;
  onStartRound: () => void;
  onLogout: () => void;
  accessToken: string;
}

export function ProfileScreen({ onNavigateHome, onNavigateGallery, onStartRound, onLogout, accessToken }: ProfileScreenProps) {
  return (
    <div className="bg-[#cee7bd] min-h-screen pb-32 relative" data-name="Profile Screen">
      {/* Scrollable Content */}
      <div className="w-full max-w-[430px] mx-auto px-[24px] pb-8" style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-[40px] w-auto">
            <img 
              src={logoImg} 
              alt="Hooky Golf" 
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="flex flex-col items-center justify-center mt-32 gap-4">
          <h2 className="luckiest-guy text-[#282828] text-[32px] text-center">
            Profile
          </h2>
          <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[18px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Coming soon!
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="profile"
        onStartRound={onStartRound}
        onHomeClick={onNavigateHome}
        onHistoryClick={onNavigateGallery}
        onProfileClick={() => {}}
      />
    </div>
  );
}
