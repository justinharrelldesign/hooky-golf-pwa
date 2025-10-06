import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { X } from "lucide-react";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import svgPathsPlusCircle from "../imports/svg-af33y3phrk";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Friend {
  userId: string;
  name: string;
  email: string;
  level: number;
  profilePhotoUrl?: string;
}

interface FriendSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFriend: (friend: Friend) => void;
  onManualEntry?: () => void; // Optional callback for manual entry
  accessToken: string;
  excludedFriendIds?: string[]; // Friend IDs that are already added as players
}

function IconOutlinePlusCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/plus-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPathsPlusCircle.p2782fd00} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function FriendSelectModal({ isOpen, onClose, onSelectFriend, onManualEntry, accessToken, excludedFriendIds = [] }: FriendSelectModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/friends`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }

      const data = await response.json();
      setFriends(data.friends || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    onSelectFriend(friend);
    onClose();
  };

  // Filter out already selected friends
  const availableFriends = friends.filter(f => !excludedFriendIds.includes(f.userId));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#cee7bd] rounded-[32px] w-full max-w-[420px] max-h-[600px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="py-6 px-6 border-b border-[#517b34]/20 flex items-center justify-between">
          <h2 className="luckiest-guy text-[#282828] text-[24px]">
            Select a friend
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="size-6 text-[#282828]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Loading friends...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="font-['Geologica:Regular',_sans-serif] text-[#C43C3C] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {error}
              </p>
            </div>
          ) : availableFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {friends.length === 0 
                  ? "No friends added yet. Add friends from your profile to invite them to games!"
                  : "All your friends have already been added to this game."
                }
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {availableFriends.map((friend) => (
                <button
                  key={friend.userId}
                  onClick={() => handleSelectFriend(friend)}
                  className="bg-white rounded-[16px] p-4 flex items-center gap-4 hover:bg-[#f8fafc] transition-colors cursor-pointer border border-[#517b34]/10"
                >
                  {/* Avatar */}
                  <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-[#517b34] flex-shrink-0">
                    <Avatar className="w-full h-full">
                      {friend.profilePhotoUrl && (
                        <AvatarImage 
                          src={friend.profilePhotoUrl} 
                          alt={friend.name}
                          onError={(e) => {
                            // Hide broken image on error
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <AvatarFallback className="bg-[#517b34] text-white text-[18px]">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Friend info */}
                  <div className="flex-1 text-left">
                    <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      {friend.name}
                    </p>
                    <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      Level {friend.level}
                    </p>
                  </div>

                  {/* Plus circle indicator */}
                  <div className="w-[24px] h-[24px] flex-shrink-0">
                    <IconOutlinePlusCircle />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#517b34]/20">
          <button
            onClick={() => {
              if (onManualEntry) {
                onManualEntry();
              }
              onClose();
            }}
            className="w-full bg-[#cee7bd] rounded-[100px] py-3 border border-[#517b34] hover:bg-[#b8d1a7] transition-colors"
          >
            <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[16px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Or, enter name manually
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}