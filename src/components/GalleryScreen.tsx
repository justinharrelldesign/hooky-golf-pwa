import { useState, useEffect, startTransition } from "react";
import svgPaths from "../imports/svg-ce14zaez1k";
import logoImg from "figma:asset/ed23857f34d6f0a2a5b953c943f636d2775b57ff.png";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import { BottomNav } from "./BottomNav";
import { projectId } from "../utils/supabase/info";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FriendSelectModal } from "./FriendSelectModal";
import { getSupabaseClient } from "../utils/supabase/client";

interface GalleryScreenProps {
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateProfile: () => void;
  onStartRound: () => void;
  onLogout: () => void;
  accessToken: string;
  currentUserProfile?: {
    userId: string;
    name: string;
    profilePhotoUrl?: string;
  };
  prefetchedGalleries?: Gallery[];
  selectedGalleryId?: string;
}

interface Gallery {
  id: string;
  name: string;
  createdBy: string;
  memberIds: string[];
  createdAt: string;
}

interface GalleryMember {
  userId: string;
  name: string;
  profilePhotoUrl?: string;
}

// Separate component for photo avatar - exactly matching working friends list pattern
const PhotoAvatar = ({ photo, currentUserProfile }: { 
  photo: any; 
  currentUserProfile?: { userId: string; name: string; profilePhotoUrl?: string } 
}) => {
  const uploader = photo.uploaderProfile;
  const uploaderName = uploader?.name || 'Friend';
  const uploaderPhoto = uploader?.profilePhotoUrl;
  
  return (
    <div className="relative shrink-0 size-[40px] rounded-full">
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <Avatar className="w-full h-full bg-[#cee7bd]">
          <AvatarImage src={uploaderPhoto || defaultAvatarImg} alt={uploaderName} className="object-cover" />
          <AvatarFallback className="bg-[#cee7bd]">
            <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-full" />
    </div>
  );
};

function HeroiconsSolidChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-solid/chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-solid/chevron-down">
          <path clipRule="evenodd" d={svgPaths.p1426a500} fill="var(--fill-0, #517B34)" fillRule="evenodd" id="Vector 335 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlinePlus() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/plus">
          <path d="M12 4.5V19.5M19.5 12L4.5 12" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineChatBubbleOvalLeft() {
  return (
    <div className="relative size-[24px]" data-name="heroicons-outline/chat-bubble-oval-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/chat-bubble-oval-left">
          <path d={svgPaths.p6f3ca00} id="Union" stroke="var(--stroke-0, #0F172A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconOutlineLogout() {
  return (
    <div className="relative size-[24px]" data-name="Icon/Outline/logout">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/logout">
          <path d={svgPaths.p3606c300} id="Icon" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export function GalleryScreen({ onNavigateHome, onNavigateBack, onNavigateProfile, onStartRound, onLogout, accessToken, currentUserProfile, prefetchedGalleries, selectedGalleryId }: GalleryScreenProps) {
  console.log('[Gallery Screen] Current user profile:', {
    userId: currentUserProfile?.userId,
    name: currentUserProfile?.name,
    hasProfilePhoto: !!currentUserProfile?.profilePhotoUrl,
    profilePhotoUrl: currentUserProfile?.profilePhotoUrl
  });
  
  const [galleries, setGalleries] = useState<Gallery[]>(prefetchedGalleries || []);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(() => {
    if (!prefetchedGalleries || prefetchedGalleries.length === 0) return null;
    if (selectedGalleryId) {
      const matchingGallery = prefetchedGalleries.find(g => g.id === selectedGalleryId);
      return matchingGallery || prefetchedGalleries[0];
    }
    return prefetchedGalleries[0];
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [galleryMembers, setGalleryMembers] = useState<GalleryMember[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [currentAccessToken, setCurrentAccessToken] = useState(accessToken);

  // Debug log current user profile
  console.log('[Gallery Screen] Current user profile:', {
    userId: currentUserProfile?.userId,
    name: currentUserProfile?.name,
    hasProfilePhoto: !!currentUserProfile?.profilePhotoUrl,
    profilePhotoUrl: currentUserProfile?.profilePhotoUrl
  });

  // Only fetch galleries if not prefetched
  useEffect(() => {
    if (!prefetchedGalleries || prefetchedGalleries.length === 0) {
      fetchGalleries();
    }
  }, [prefetchedGalleries]);

  // Handle selectedGalleryId from navigation
  useEffect(() => {
    if (selectedGalleryId && galleries.length > 0) {
      const gallery = galleries.find(g => g.id === selectedGalleryId);
      if (gallery) {
        setSelectedGallery(gallery);
      }
    }
  }, [selectedGalleryId, galleries]);

  // Fetch member details when selected gallery changes
  useEffect(() => {
    if (!selectedGallery?.memberIds || selectedGallery.memberIds.length === 0) {
      setGalleryMembers([]);
      return;
    }
    
    // Use startTransition to mark this as a low-priority update
    startTransition(() => {
      fetchGalleryMembers(selectedGallery.memberIds);
    });
  }, [selectedGallery?.id, selectedGallery?.memberIds?.length]);

  // Fetch photos when selected gallery changes
  useEffect(() => {
    if (!selectedGallery) {
      setPhotos([]);
      return;
    }
    
    // Use startTransition to mark this as a low-priority update
    startTransition(() => {
      fetchPhotos(selectedGallery.id);
    });
  }, [selectedGallery?.id]);

  // Token refresh helper - defined early so other functions can use it
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        console.error("Failed to refresh session:", error);
        return null;
      }
      
      setCurrentAccessToken(session.access_token);
      return session.access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const fetchGalleries = async () => {
    try {
      // Get fresh token before fetching
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for fetching galleries");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries`,
        {
          headers: {
            "Authorization": `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGalleries(data.galleries || []);
        
        // Auto-select first gallery or create default if none exist
        if (data.galleries && data.galleries.length > 0) {
          setSelectedGallery(data.galleries[0]);
        } else {
          // Create a default gallery for new users
          await createDefaultGallery();
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to load galleries:", response.status, errorData);
      }
    } catch (error) {
      console.error("Failed to fetch galleries:", error);
    }
  };

  const createDefaultGallery = async () => {
    try {
      // Get fresh token before creating
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for creating default gallery");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${freshToken}`,
          },
          body: JSON.stringify({ name: "My First Gallery" }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGalleries([data.gallery]);
        setSelectedGallery(data.gallery);
      }
    } catch (error) {
      console.error("Failed to create default gallery:", error);
    }
  };

  const handleCreateGallery = async () => {
    if (!newGalleryName.trim()) return;

    setIsCreating(true);
    try {
      // Get fresh token before creating
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for creating gallery");
        alert("Failed to authenticate. Please try again.");
        setIsCreating(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${freshToken}`,
          },
          body: JSON.stringify({ name: newGalleryName.trim() }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGalleries([...galleries, data.gallery]);
        setSelectedGallery(data.gallery);
        setShowCreateModal(false);
        setNewGalleryName("");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create gallery");
      }
    } catch (error) {
      console.error("Failed to create gallery:", error);
      alert("Failed to create gallery");
    } finally {
      setIsCreating(false);
    }
  };

  const fetchGalleryMembers = async (memberIds: string[]) => {
    try {
      // Get fresh token before fetching members
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for fetching members");
        return;
      }

      console.log('[Gallery Members] Fetching profiles for member IDs:', memberIds);

      // Fetch profiles for all member IDs
      const memberProfiles = await Promise.all(
        memberIds.map(async (memberId) => {
          try {
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/profile/${memberId}`,
              {
                headers: {
                  "Authorization": `Bearer ${freshToken}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              console.log('[Gallery Members] Fetched profile for', memberId, ':', {
                name: data.profile.name,
                hasProfilePhoto: !!data.profile.profilePhotoUrl,
                profilePhotoUrl: data.profile.profilePhotoUrl
              });
              return {
                userId: data.profile.userId,
                name: data.profile.name,
                profilePhotoUrl: data.profile.profilePhotoUrl,
              };
            }
            console.error(`Failed to fetch member ${memberId}, status:`, response.status);
            return null;
          } catch (error) {
            console.error(`Failed to fetch member ${memberId}:`, error);
            return null;
          }
        })
      );

      // Filter out any null results and set members
      const validMembers = memberProfiles.filter((m): m is GalleryMember => m !== null);
      console.log(`[Gallery Members] Fetched ${validMembers.length} valid members:`, validMembers);
      setGalleryMembers(validMembers);
    } catch (error) {
      console.error("Failed to fetch gallery members:", error);
      setGalleryMembers([]);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !selectedGallery) {
      return;
    }

    const files = Array.from(event.target.files);
    setIsUploading(true);

    try {
      // Get fresh token before uploading
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for photo upload");
        alert("Failed to authenticate. Please try again.");
        setIsUploading(false);
        return;
      }

      // Upload each photo to the backend
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('galleryId', selectedGallery.id);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/gallery-photos`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${freshToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to upload photo:', errorText);
          throw new Error('Failed to upload photo');
        }

        return response.json();
      });

      await Promise.all(uploadPromises);

      // Refresh photos to show new uploads
      if (selectedGallery) {
        await fetchPhotos(selectedGallery.id);
      }
      
      console.log('Photos uploaded successfully');
    } catch (error) {
      console.error('Failed to upload photos:', error);
      alert('Failed to upload some photos. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const triggerPhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = handlePhotoUpload as any;
    input.click();
  };

  const fetchPhotos = async (galleryId: string) => {
    setIsLoadingPhotos(true);
    try {
      // Get fresh token before fetching
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for fetching photos");
        setPhotos([]);
        setIsLoadingPhotos(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/gallery-photos/${galleryId}`,
        {
          headers: {
            "Authorization": `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fetchedPhotos = data.photos || [];

        // Extract unique uploader IDs from photos
        const uploaderIds = [...new Set(
          fetchedPhotos
            .map((photo: any) => photo.uploadedBy)
        )];

        console.log('[Gallery Photos] Fetching uploader profiles for:', uploaderIds);

        // Create a map to store uploader profiles
        const uploaderProfilesMap = new Map<string, GalleryMember>();

        // Add current user to the map if they uploaded any photos
        if (currentUserProfile && uploaderIds.includes(currentUserProfile.userId)) {
          uploaderProfilesMap.set(currentUserProfile.userId, currentUserProfile);
          console.log('[Gallery Photos] Added current user to uploader map:', {
            userId: currentUserProfile.userId,
            name: currentUserProfile.name,
            hasPhoto: !!currentUserProfile.profilePhotoUrl,
            photoUrl: currentUserProfile.profilePhotoUrl
          });
        }

        // Fetch profiles for all other uploaders
        const otherUploaderIds = uploaderIds.filter(id => id !== currentUserProfile?.userId);
        if (otherUploaderIds.length > 0) {
          const uploaderProfiles = await Promise.all(
            otherUploaderIds.map(async (uploaderId: string) => {
              try {
                const profileResponse = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/profile/${uploaderId}`,
                  {
                    headers: {
                      "Authorization": `Bearer ${freshToken}`,
                    },
                  }
                );

                if (profileResponse.ok) {
                  const profileData = await profileResponse.json();
                  console.log('[Gallery Photos] Fetched uploader profile:', {
                    userId: uploaderId,
                    name: profileData.profile.name,
                    hasPhoto: !!profileData.profile.profilePhotoUrl,
                    photoUrl: profileData.profile.profilePhotoUrl
                  });
                  return {
                    userId: profileData.profile.userId,
                    name: profileData.profile.name,
                    profilePhotoUrl: profileData.profile.profilePhotoUrl,
                  };
                }
                console.error(`Failed to fetch uploader profile ${uploaderId}`);
                return null;
              } catch (error) {
                console.error(`Error fetching uploader ${uploaderId}:`, error);
                return null;
              }
            })
          );

          // Add fetched profiles to the map
          uploaderProfiles.forEach(profile => {
            if (profile) {
              uploaderProfilesMap.set(profile.userId, profile);
            }
          });

          // Merge uploader profiles with existing gallery members (avoid duplicates)
          const validUploaderProfiles = uploaderProfiles.filter(p => p !== null);
          
          setGalleryMembers(prevMembers => {
            console.log('[Gallery Photos] Current members before merge:', prevMembers.length);
            const existingMemberIds = new Set(prevMembers.map(m => m.userId));
            const newProfiles = validUploaderProfiles.filter(p => !existingMemberIds.has(p!.userId));
            
            if (newProfiles.length > 0) {
              console.log('[Gallery Photos] Adding uploader profiles to members:', newProfiles.map(p => ({ userId: p!.userId, name: p!.name, hasPhoto: !!p!.profilePhotoUrl })));
              const merged = [...prevMembers, ...newProfiles as any[]];
              console.log('[Gallery Photos] Total members after merge:', merged.length);
              return merged;
            }
            
            console.log('[Gallery Photos] No new profiles to add');
            return prevMembers;
          });
        }

        // Enrich photos with uploader data
        const enrichedPhotos = fetchedPhotos.map((photo: any) => ({
          ...photo,
          uploaderProfile: uploaderProfilesMap.get(photo.uploadedBy) || null
        }));

        console.log('[Gallery Photos] Enriched photos with uploader data:', enrichedPhotos.map((p: any) => ({
          photoId: p.id,
          uploadedBy: p.uploadedBy,
          hasUploaderProfile: !!p.uploaderProfile,
          uploaderName: p.uploaderProfile?.name,
          uploaderPhotoUrl: p.uploaderProfile?.profilePhotoUrl
        })));

        // Set enriched photos
        setPhotos(enrichedPhotos);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch photos:", response.status, errorText);
        setPhotos([]);
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error);
      setPhotos([]);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const handleAddMemberClick = async () => {
    // Refresh token before opening modal
    const freshToken = await refreshAccessToken();
    if (freshToken) {
      setShowAddMemberModal(true);
    } else {
      alert("Session expired. Please log in again.");
    }
  };

  const handleAddMember = async (friend: { userId: string; name: string; profilePhotoUrl?: string }) => {
    if (!selectedGallery) return;

    setIsAddingMember(true);
    try {
      // Get fresh token
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        alert("Session expired. Please log in again.");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries/${selectedGallery.id}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${freshToken}`,
          },
          body: JSON.stringify({ friendId: friend.userId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update the selected gallery with new member list
        setSelectedGallery(data.gallery);
        
        // Update galleries list
        setGalleries(galleries.map(g => g.id === data.gallery.id ? data.gallery : g));
        
        // Refresh member details
        if (data.gallery.memberIds) {
          startTransition(() => {
            fetchGalleryMembers(data.gallery.memberIds);
          });
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add member to gallery");
      }
    } catch (error) {
      console.error("Failed to add member to gallery:", error);
      alert("Failed to add member to gallery");
    } finally {
      setIsAddingMember(false);
    }
  };

  return (
    <div className="bg-[#cee7bd] min-h-screen pb-32 relative" data-name="Gallery Screen">
      {/* Scrollable Content */}
      <div className="w-full max-w-[430px] mx-auto">
        {/* Header */}
        <div className="px-[24px] pb-[16px]" style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}>
          <div className="flex items-center justify-between mb-6">
          <button
            onClick={onNavigateBack}
            className="flex items-center justify-center h-[40px] w-[40px] hover:opacity-70 transition-opacity"
            aria-label="Back to galleries"
          >
            <svg className="size-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="size-[24px]">
                <IconOutlineLogout />
              </div>
              <span className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Log out
              </span>
            </button>
          </div>
          </div>
        </div>

        {/* Gallery Name and Team Members */}
        <div className="px-[24px]">
        <div className="content-stretch flex gap-[16px] items-end mb-4">
          {/* Gallery Name */}
          <div className="basis-0 grow min-h-px min-w-px">
            <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[24px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {selectedGallery?.name || "Gallery"}
            </p>
          </div>

          {/* Team Member Avatars */}
          <div className="box-border content-stretch flex items-start pl-0 pr-[8px] py-0 relative shrink-0">
            {/* Always show current user first */}
            {currentUserProfile && (
              <div className="relative mr-[-8px] shrink-0 size-[40px] rounded-full">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <Avatar className="w-full h-full bg-[#cee7bd]">
                    <AvatarImage src={currentUserProfile.profilePhotoUrl || defaultAvatarImg} alt={currentUserProfile.name} className="object-cover" />
                    <AvatarFallback className="bg-[#cee7bd]">
                      <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div aria-hidden="true" className="absolute border-2 border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-full" />
              </div>
            )}

            {/* Show other members (excluding current user), up to 2 more members */}
            {(galleryMembers || [])
              .filter(member => member.userId !== currentUserProfile?.userId)
              .slice(0, 2)
              .map((member) => (
                <div key={member.userId} className="relative mr-[-8px] shrink-0 size-[40px] rounded-full">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full bg-[#cee7bd]">
                      <AvatarImage src={member.profilePhotoUrl || defaultAvatarImg} alt={member.name} className="object-cover" />
                      <AvatarFallback className="bg-[#cee7bd]">
                        <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div aria-hidden="true" className="absolute border-2 border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-full" />
                </div>
              ))}

            {/* Show remaining member count if more than 3 total members */}
            {(galleryMembers || []).filter(member => member.userId !== currentUserProfile?.userId).length > 2 && (
              <div className="mr-[-8px] relative rounded-[100px] shrink-0 size-[40px]">
                <div className="bg-[#517b34] absolute inset-0 rounded-[100px]">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-[40px]">
                    <p className="font-['Geologica:Bold',_sans-serif] leading-[normal] not-italic text-[14px] text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      +{(galleryMembers || []).filter(member => member.userId !== currentUserProfile?.userId).length - 2}
                    </p>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border-2 border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
              </div>
            )}

            {/* Add Member Button */}
            <button
              onClick={handleAddMemberClick}
              className="bg-[#282828] mr-[-8px] relative rounded-[100px] shrink-0 size-[40px] hover:bg-[#3a3a3a] transition-colors cursor-pointer"
              disabled={isAddingMember}
              aria-label="Add member to gallery"
            >
              <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-[40px]">
                <HeroiconsOutlinePlus />
              </div>
              <div aria-hidden="true" className="absolute border-2 border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
            </button>
          </div>
        </div>
        </div>

        {/* Photo Cards or Empty State */}
        <div className="px-[24px]">
        {isLoadingPhotos ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="font-['Geologica:Regular',_sans-serif] text-[#64748b] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Loading photos...
            </p>
          </div>
        ) : photos.length > 0 ? (
          <div className="content-stretch flex flex-col gap-[16px] items-start pb-[100px]">
            {(() => {
              console.log('[Gallery Render] Photos array:', photos.map(p => ({
                id: p.id,
                hasUploaderProfile: !!p.uploaderProfile,
                uploaderPhotoUrl: p.uploaderProfile?.profilePhotoUrl
              })));
              return null;
            })()}
            {photos.map((photo) => {
              // Format date
              const uploadDate = new Date(photo.uploadedAt);
              const formattedDate = uploadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div key={photo.id} className="h-[382px] relative rounded-[32px] shrink-0 w-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]">
                  <div className="flex flex-col justify-end size-full">
                    <div className="box-border content-stretch flex flex-col gap-[16px] h-[382px] items-start justify-end p-[24px] relative w-full">
                      {/* Photo Image */}
                      <div className="basis-0 grow min-h-px min-w-px relative rounded-[16px] shrink-0 w-full">
                        <img 
                          alt="Gallery photo" 
                          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none rounded-[16px] size-full" 
                          src={photo.url}
                        />
                      </div>

                      {/* Photo Info */}
                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                        {/* User Info */}
                        <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                          {/* Avatar */}
                          <PhotoAvatar 
                            key={`${photo.id}-${photo.uploaderProfile?.profilePhotoUrl || 'no-photo'}`}
                            photo={photo} 
                            currentUserProfile={currentUserProfile}
                          />
                          
                          {/* Name and Date */}
                          <div className="absolute box-border content-stretch flex flex-col font-['Geologica:Light',_sans-serif] gap-[2px] items-start leading-[normal] left-[56px] not-italic overflow-clip px-0 py-[2px] text-[#282828]">
                            <p className="relative shrink-0 text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {photo.uploadedBy === currentUserProfile?.userId ? 'You' : (photo.uploaderProfile?.name || 'Friend')}
                            </p>
                            <p className="relative shrink-0 text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {formattedDate}
                            </p>
                          </div>
                        </div>

                        {/* Comment Count - placeholder for future feature */}
                        <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                          <HeroiconsOutlineChatBubbleOvalLeft />
                          <p className="font-['Geologica:SemiBold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            0
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4 text-center w-full">
              <div className="w-16 h-16 rounded-full bg-[#517b34]/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-[#517b34]" />
              </div>
              <div>
                <h3 className="font-['Geologica:Bold',_sans-serif] text-[#282828] text-[20px] mb-2" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  No Photos Yet
                </h3>
                <p className="font-['Geologica:Regular',_sans-serif] text-[#64748b] text-[14px] mb-4" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  This gallery is empty. Start adding photos to share your golf memories!
                </p>
                <button
                  onClick={triggerPhotoUpload}
                  disabled={isUploading}
                  className="bg-[#517b34] hover:bg-[#456628] disabled:bg-[#517b34]/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-[16px] font-['Geologica:SemiBold',_sans-serif] text-[16px] transition-colors flex items-center gap-2 mx-auto"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  <Camera className="w-5 h-5" />
                  {isUploading ? 'Uploading...' : 'Add Photos'}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Floating Add Photo Button - only show when gallery has photos */}
      {selectedGallery && photos.length > 0 && (
        <button
          onClick={triggerPhotoUpload}
          disabled={isUploading}
          className="fixed right-[24px] bg-[#517b34] hover:bg-[#456628] disabled:bg-[#517b34]/50 disabled:cursor-not-allowed text-white rounded-full w-[56px] h-[56px] flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-40"
          style={{ bottom: 'calc(64px + 24px + env(safe-area-inset-bottom))' }}
          aria-label="Add photo"
        >
          <Camera className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="history"
        onStartRound={onStartRound}
        onHomeClick={onNavigateHome}
        onHistoryClick={() => {}}
        onProfileClick={onNavigateProfile}
      />

      {/* Create Gallery Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-white border-[#517b34]">
          <DialogHeader>
            <DialogTitle className="font-['Geologica:Bold',_sans-serif] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Create New Gallery
            </DialogTitle>
            <DialogDescription className="font-['Geologica:Regular',_sans-serif] text-[#64748b]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Create a new photo gallery to share with friends.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="gallery-name" className="font-['Geologica:SemiBold',_sans-serif] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Gallery Name
            </Label>
            <Input
              id="gallery-name"
              value={newGalleryName}
              onChange={(e) => setNewGalleryName(e.target.value)}
              placeholder="e.g., Summer Golf Trip"
              maxLength={50}
              className="mt-2 font-['Geologica:Regular',_sans-serif]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateGallery();
                }
              }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewGalleryName("");
              }}
              className="font-['Geologica:SemiBold',_sans-serif] border-[#517b34]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGallery}
              disabled={!newGalleryName.trim() || isCreating}
              className="bg-[#517b34] text-white hover:bg-[#456628] font-['Geologica:Bold',_sans-serif]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <FriendSelectModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSelectFriend={handleAddMember}
        accessToken={currentAccessToken}
        excludedFriendIds={selectedGallery?.memberIds || []}
      />
    </div>
  );
}
