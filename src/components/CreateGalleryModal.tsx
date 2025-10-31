import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { X, Check } from "lucide-react";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import svgPathsPlusCircle from "../imports/svg-af33y3phrk";
import { projectId } from "../utils/supabase/info";
import { Input } from "./ui/input";
import { getSupabaseClient } from "../utils/supabase/client";

interface Friend {
  userId: string;
  name: string;
  email: string;
  level: number;
  profilePhotoUrl?: string;
}

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  onGalleryCreated: (galleryId: string) => void;
  totalGalleries: number;
}

function IconOutlinePlusCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/plus-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPathsPlusCircle.p2782fd00} id="Icon" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function CreateGalleryModal({ 
  isOpen, 
  onClose, 
  accessToken, 
  onGalleryCreated,
  totalGalleries
}: CreateGalleryModalProps) {
  const [galleryName, setGalleryName] = useState(`Gallery ${totalGalleries + 1}`);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        console.error("Failed to refresh session:", error);
        return null;
      }
      
      return session.access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setGalleryName(`Gallery ${totalGalleries + 1}`);
      setSelectedFriendIds(new Set());
      fetchFriends();
    }
  }, [isOpen, totalGalleries]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get fresh token
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for fetching friends");
        setError("Session expired. Please refresh the page.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/friends`,
        {
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch friends:", response.status, errorText);
        setError("Failed to load friends");
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriendIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId);
      } else {
        newSet.add(friendId);
      }
      return newSet;
    });
  };

  const handleCreate = async () => {
    if (!galleryName.trim()) {
      setError("Please enter a gallery name");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      // Get fresh token
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for creating gallery");
        setError("Session expired. Please refresh the page.");
        setCreating(false);
        return;
      }

      // Create the gallery
      const createResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshToken}`,
          },
          body: JSON.stringify({
            name: galleryName.trim(),
          }),
        }
      );

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("Failed to create gallery:", createResponse.status, errorText);
        setError("Failed to create gallery");
        return;
      }

      const createData = await createResponse.json();
      const galleryId = createData.gallery.id;

      // Add selected friends as members
      if (selectedFriendIds.size > 0) {
        const memberPromises = Array.from(selectedFriendIds).map(friendId =>
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries/${galleryId}/members`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${freshToken}`,
              },
              body: JSON.stringify({
                friendId: friendId,
              }),
            }
          )
        );

        await Promise.all(memberPromises);
      }

      // Navigate to the newly created gallery
      onGalleryCreated(galleryId);
    } catch (err) {
      console.error("Error creating gallery:", err);
      setError("Failed to create gallery");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-['Geologica:SemiBold',_sans-serif] text-[20px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Create Gallery
          </h2>
          <button 
            onClick={onClose}
            className="size-6 flex items-center justify-center text-[#282828] hover:text-[#517b34] transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Gallery Name Input */}
          <div className="mb-6">
            <label className="block font-['Geologica:SemiBold',_sans-serif] text-[14px] text-[#282828] mb-2" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Gallery Name
            </label>
            <Input
              type="text"
              value={galleryName}
              onChange={(e) => setGalleryName(e.target.value)}
              placeholder="Enter gallery name"
              className="w-full"
              disabled={creating}
            />
          </div>

          {/* Friends List */}
          <div>
            <label className="block font-['Geologica:SemiBold',_sans-serif] text-[14px] text-[#282828] mb-3" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Add Friends (Optional)
            </label>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#517b34]" />
              </div>
            ) : error && friends.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {error}
                </p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  No friends to add yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => {
                  const isSelected = selectedFriendIds.has(friend.userId);
                  
                  return (
                    <button
                      key={friend.userId}
                      onClick={() => toggleFriend(friend.userId)}
                      disabled={creating}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-[#517b34] text-white' 
                          : 'bg-gray-50 hover:bg-gray-100 text-[#282828]'
                      } ${creating ? 'opacity-50' : ''}`}
                    >
                      <Avatar className="size-10 shrink-0">
                        <AvatarImage src={friend.profilePhotoUrl || defaultAvatarImg} alt={friend.name} />
                        <AvatarFallback>
                          <img src={defaultAvatarImg} alt="" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 text-left">
                        <p className="font-['Geologica:SemiBold',_sans-serif] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {friend.name}
                        </p>
                        <p className={`font-['Geologica:Regular',_sans-serif] text-[12px] ${isSelected ? 'text-white/80' : 'text-[#282828]/60'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Level {friend.level}
                        </p>
                      </div>

                      <div className={`size-5 flex items-center justify-center ${isSelected ? 'text-white' : 'text-[#517b34]'}`}>
                        {isSelected ? <Check className="size-5" /> : <IconOutlinePlusCircle />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && friends.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-red-600" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={creating}
            className="flex-1 px-6 py-3 rounded-lg border border-[#517b34] text-[#517b34] font-['Geologica:SemiBold',_sans-serif] text-[16px] hover:bg-gray-50 transition-colors disabled:opacity-50"
            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating || !galleryName.trim()}
            className="flex-1 px-6 py-3 rounded-lg bg-[#517b34] text-white font-['Geologica:SemiBold',_sans-serif] text-[16px] hover:bg-[#3f5f29] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Creating...
              </>
            ) : (
              'Add'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
