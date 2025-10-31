import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Image as ImageIcon, PlusCircle, UserPlus, Trash2 } from "lucide-react";
import svgPaths from "../imports/svg-loafuvc81w";
import logoImg from "figma:asset/ed23857f34d6f0a2a5b953c943f636d2775b57ff.png";
import pinImg from "figma:asset/9c21fc09b3fda17d2e0a231e63a8c0283cf95721.png";
import { getSupabaseClient } from "../utils/supabase/client";
import HeroiconsMicroEllipsisVertical from "../imports/HeroiconsMicroEllipsisVertical";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FriendSelectModal } from "./FriendSelectModal";
import { CreateGalleryModal } from "./CreateGalleryModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface Gallery {
  id: string;
  name: string;
  createdBy: string;
  memberIds: string[];
  createdAt: string;
  photoCount?: number;
  coverPhotoUrl?: string;
}

interface GalleriesHubScreenProps {
  accessToken: string;
  onLogout: () => void;
  onGallerySelect: (galleryId: string) => void;
  onNavigateToHome: () => void;
  onNavigateToProfile: () => void;
  onStartRound: () => void;
  currentUserProfile?: {
    id: string;
    display_name: string;
    avatar_url?: string;
    rank?: string;
  };
}

function HeroiconsMiniPhoto() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path clipRule="evenodd" d={svgPaths.p2dab6700} fill="#0F172A" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function HeroiconsOutlineHome({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p11460780} stroke={isActive ? "#282828" : "#517B34"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HeroiconsOutlinePhoto({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p2d4a6600} stroke={isActive ? "#282828" : "#517B34"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HeroiconsOutlineUserCircle({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p22e17a00} stroke={isActive ? "#282828" : "#517B34"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HeroiconsOutlineFlag() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p127ccb80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function IconOutlineLogout() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p3606c300} stroke="#282828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function GalleriesHubScreen({
  accessToken,
  onLogout,
  onGallerySelect,
  onNavigateToHome,
  onNavigateToProfile,
  onStartRound,
  currentUserProfile
}: GalleriesHubScreenProps) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateGalleryModal, setShowCreateGalleryModal] = useState(false);
  const [showFriendSelectModal, setShowFriendSelectModal] = useState(false);
  const [selectedGalleryForAction, setSelectedGalleryForAction] = useState<string | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);
  const [currentGalleryMembers, setCurrentGalleryMembers] = useState<string[]>([]);

  useEffect(() => {
    loadGalleries();
  }, []);

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

  const loadGalleries = async () => {
    setIsLoading(true);
    try {
      // Get fresh token before fetching
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for loading galleries");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries`,
        {
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGalleries(data.galleries || []);
      } else {
        const errorText = await response.text();
        console.error("Failed to load galleries:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error loading galleries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGallery = () => {
    setShowCreateGalleryModal(true);
  };

  const handleGalleryCreated = async (galleryId: string) => {
    setShowCreateGalleryModal(false);
    // Reload galleries before navigating to ensure the new gallery is in the list
    await loadGalleries();
    onGallerySelect(galleryId);
  };

  const handleDeleteGallery = async (galleryId: string) => {
    try {
      // Get fresh token before deleting gallery
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for deleting gallery");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries/${galleryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        // Reload galleries after deletion
        await loadGalleries();
        setGalleryToDelete(null);
      } else {
        const errorText = await response.text();
        console.error("Failed to delete gallery:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error deleting gallery:", error);
    }
  };

  const handleAddFriendToGallery = async (galleryId: string) => {
    setSelectedGalleryForAction(galleryId);
    
    // Fetch current gallery members
    try {
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for fetching gallery members");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries/${galleryId}/members`,
        {
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Extract user IDs from members
        const memberIds = data.members?.map((member: any) => member.user_id) || [];
        setCurrentGalleryMembers(memberIds);
        setShowFriendSelectModal(true);
      } else {
        console.error("Failed to fetch gallery members");
      }
    } catch (error) {
      console.error("Error fetching gallery members:", error);
    }
  };

  const handleAddMember = async (friendId: string) => {
    if (!selectedGalleryForAction) return;

    try {
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for adding member");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries/${selectedGalleryForAction}/members`,
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
      );

      if (response.ok) {
        // Update the local members list
        setCurrentGalleryMembers(prev => [...prev, friendId]);
        // Reload galleries to show updated member count
        await loadGalleries();
      } else {
        const errorText = await response.text();
        console.error("Failed to add member to gallery:", response.status, errorText);
        throw new Error("Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member to gallery:", error);
      throw error;
    }
  };

  const handleRemoveMember = async (friendId: string) => {
    if (!selectedGalleryForAction) return;

    try {
      const freshToken = await refreshAccessToken();
      if (!freshToken) {
        console.error("Failed to get fresh token for removing member");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/galleries/${selectedGalleryForAction}/members/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      if (response.ok) {
        // Update the local members list
        setCurrentGalleryMembers(prev => prev.filter(id => id !== friendId));
        // Reload galleries to show updated member count
        await loadGalleries();
      } else {
        const errorText = await response.text();
        console.error("Failed to remove member from gallery:", response.status, errorText);
        throw new Error("Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member from gallery:", error);
      throw error;
    }
  };

  return (
    <div className="bg-[#cee7bd] relative min-h-screen w-full max-w-[430px] mx-auto pb-[80px]">
      {/* Header */}
      <div className="px-[24px] pb-[16px]" style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}>
        <div className="flex items-center justify-between mb-6">
          {/* Logo */}
          <div className="h-[40px] w-auto">
            <img 
              alt="Hooky Golf Logo" 
              className="h-full w-auto object-contain" 
              src={logoImg} 
            />
          </div>

          {/* Logout Button */}
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

      {/* Title */}
      <p className="luckiest-guy text-[#282828] text-[32px] text-center mt-[16px] mb-[8px]">
        Galleries
      </p>

      {/* Add Gallery Button */}
      <div className="flex justify-center mb-[24px]">
        <button
          onClick={handleAddGallery}
          className="relative bg-[#cee7bd] rounded-[100px] cursor-pointer"
        >
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[24px] py-[12px] relative rounded-[inherit]">
            <PlusCircle className="size-[24px] text-[#517b34] shrink-0" />
            <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Add gallery
            </p>
          </div>
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        </button>
      </div>

      {/* Galleries Grid */}
      <div className="px-[24px]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#517b34]" />
          </div>
        ) : galleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ImageIcon className="size-[48px] text-[#517b34] mb-4" />
            <p className="font-['Geologica:SemiBold',_sans-serif] text-[18px] text-[#282828] mb-2" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              No galleries yet
            </p>
            <p className="font-['Geologica:Regular',_sans-serif] text-[14px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Create your first gallery to start sharing photos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[14px]">
            {galleries.map((gallery) => (
              <motion.div
                key={gallery.id}
                className="relative h-[245px] w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background stacked card */}
                <div className="absolute flex items-center justify-center left-0 top-[10px] w-full h-[233px]">
                  <div className="flex-none rotate-[-1.832deg]">
                    <div className="bg-white h-[233px] rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] w-full" />
                  </div>
                </div>

                {/* Main gallery card */}
                <div className="absolute bg-white box-border content-stretch flex flex-col gap-[8px] items-start left-[5px] p-[12px] rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] top-[12px] w-[calc(100%-10px)]">
                  {/* Gallery Cover Image - clickable */}
                  <button
                    onClick={() => onGallerySelect(gallery.id)}
                    className="h-[159px] relative rounded-[8px] shrink-0 w-full overflow-hidden cursor-pointer"
                  >
                    {gallery.coverPhotoUrl ? (
                      <ImageWithFallback
                        src={gallery.coverPhotoUrl}
                        alt={gallery.name}
                        className="absolute inset-0 object-cover size-full"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#cee7bd] flex items-center justify-center">
                        <ImageIcon className="size-[40px] text-[#517b34] opacity-40" />
                      </div>
                    )}
                  </button>

                  {/* Gallery Info */}
                  <div className="content-stretch flex flex-col gap-[4px] items-start w-full relative">
                    <button
                      onClick={() => onGallerySelect(gallery.id)}
                      className="w-full text-left cursor-pointer"
                    >
                      <p className="font-['Geologica:SemiBold',_sans-serif] text-[14px] text-[#282828] text-left truncate w-full pr-8" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {gallery.name}
                      </p>
                    </button>
                    <div className="content-stretch flex gap-[4px] items-center">
                      <HeroiconsMiniPhoto />
                      <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {gallery.photoCount || 0} photo{gallery.photoCount !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Ellipsis Menu - Bottom Right */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-0 right-0 size-[20px] flex items-center justify-center hover:opacity-70 transition-opacity"
                          aria-label="Gallery options"
                        >
                          <HeroiconsMicroEllipsisVertical />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddFriendToGallery(gallery.id);
                          }}
                          className="cursor-pointer text-[#282828] hover:!bg-[#517b34] hover:!text-white focus:!bg-[#517b34] focus:!text-white [&_svg]:!text-[#282828] hover:[&_svg]:!text-white focus:[&_svg]:!text-white"
                        >
                          <UserPlus className="mr-2 size-4" />
                          Add Friend
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setGalleryToDelete(gallery);
                          }}
                          className="cursor-pointer text-[#282828] hover:!bg-[#517b34] hover:!text-white focus:!bg-[#517b34] focus:!text-white [&_svg]:!text-[#282828] hover:[&_svg]:!text-white focus:[&_svg]:!text-white"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete Gallery
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Pin at the top */}
                <div className="absolute h-[20px] left-1/2 -translate-x-1/2 top-0 w-[16px] pointer-events-none z-10">
                  <div className="absolute inset-0 overflow-hidden">
                    <img alt="" className="absolute h-[159.23%] left-[-50.99%] max-w-none top-[-25.5%] w-[203.17%]" src={pinImg} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.15)] z-50">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="box-border content-stretch flex gap-[24px] items-center justify-center px-[16px] py-[12px] relative size-full max-w-[600px]">
        {/* Home Button */}
        <button
          onClick={onNavigateToHome}
          className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px] cursor-pointer"
        >
          <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
          <HeroiconsOutlineHome isActive={false} />
        </button>

        {/* Gallery Button (Active) */}
        <button
          className="bg-[#cee7bd] content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px]"
        >
          <HeroiconsOutlinePhoto isActive={true} />
        </button>

        {/* Profile Button */}
        <button
          onClick={onNavigateToProfile}
          className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px] cursor-pointer"
        >
          <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
          <HeroiconsOutlineUserCircle isActive={false} />
        </button>

        {/* Start Round Button */}
        <button
          onClick={onStartRound}
          className="basis-0 bg-[#517b34] grow min-h-px min-w-px relative rounded-[8px] shrink-0 cursor-pointer"
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative w-full">
              <HeroiconsOutlineFlag />
              <div className="flex flex-col font-['Geologica:Regular',_sans-serif] justify-end leading-[0] not-italic shrink-0 text-[16px] text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="leading-[normal]">Start round</p>
              </div>
            </div>
          </div>
        </button>
          </div>
        </div>
      </div>

      {/* Create Gallery Modal */}
      <CreateGalleryModal
        isOpen={showCreateGalleryModal}
        onClose={() => setShowCreateGalleryModal(false)}
        accessToken={accessToken}
        onGalleryCreated={handleGalleryCreated}
        totalGalleries={galleries.length}
      />

      {/* Friend Select Modal */}
      {showFriendSelectModal && currentUserProfile && (
        <FriendSelectModal
          isOpen={showFriendSelectModal}
          onClose={() => {
            setShowFriendSelectModal(false);
            setSelectedGalleryForAction(null);
            setCurrentGalleryMembers([]);
          }}
          accessToken={accessToken}
          galleryId={selectedGalleryForAction || undefined}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          currentMemberIds={currentGalleryMembers}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!galleryToDelete} onOpenChange={(open) => !open && setGalleryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{galleryToDelete?.name}"? This action cannot be undone and all photos in this gallery will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => galleryToDelete && handleDeleteGallery(galleryToDelete.id)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
