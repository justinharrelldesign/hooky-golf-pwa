import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-qcm451atz7";
import svgPathsDetails from "../imports/svg-07jtzyo4w3";
import { projectId } from "../utils/supabase/info";
import logoImg from "figma:asset/ed23857f34d6f0a2a5b953c943f636d2775b57ff.png";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import golfCourseBackgroundImg from "figma:asset/86b080cdcf6fe77baed5e941eb1e5146b772ecec.png";
import rookieBadgeImg from "figma:asset/1c0dad141c87b516c36d4b1fffa7a1fa6f2ce597.png";
import amateurBadgeImg from "figma:asset/81eacdab71ec68a0fb838be98711c108f95a6764.png";
import noviceBadgeImg from "figma:asset/08956f0cc4fccf953ff553805602c0eb12ddc831.png";
import prodigyBadgeImg from "figma:asset/f74f5f048e39641ac0888bd437f5f75a8045c920.png";
import expertBadgeImg from "figma:asset/061959b386d8a5784d01c2082709a07ed31c2099.png";
import legendBadgeImg from "figma:asset/b3b2b989c80a0df3822b4ed43eb2eed4fab0c612.png";
import heroBadgeImg from "figma:asset/a598caf9369222a527cea4a373bdfd89af4ba6a1.png";
import godBadgeImg from "figma:asset/fa33a8e840f031f26c729f60f907ea4f391f7c07.png";
import rankBadgeImg from "figma:asset/8c97451aa7eab202d33fde2be44dda8fa75f62a7.png";
import { CoursesMapCard } from "./CoursesMapCard";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Camera, X, ArrowLeft, Check } from "lucide-react";
import { ImageCropModal } from "./ImageCropModal";
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "./ui/sheet";
import { getProgressToNextRank, RANKS, getRankFromXP, calculatePlayerXP } from "../utils/rankSystem";
import { FriendRequestsModal } from "./FriendRequestsModal";
import HeroiconsOutlineTrash from "../imports/HeroiconsOutlineTrash";
import HeroiconsOutlineArrowRight from "../imports/HeroiconsOutlineArrowRight";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface UserProfile {
  userId: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  totalRounds: number;
  roundsWon: number;
  roundsLost: number;
  totalStrikes: number;
  createdAt: string;
  profilePhotoUrl?: string;
}

interface Round {
  id: string;
  userId: string;
  isVictory: boolean;
  difficulty: { name: string; strikes: number };
  totalHoles: number;
  players: any[];
  completedAt: string;
  startedAt?: string; // For active rounds
  course?: { placeId: string; name: string; address: string } | null;
}

interface Friend {
  userId: string;
  name: string;
  level: number;
  xp: number;
  totalRounds: number;
  roundsWon: number;
  profilePhotoUrl?: string;
}

interface AuthenticatedHomeScreenProps {
  accessToken: string;
  onStartRound: (userProfile: UserProfile) => void;
  onLogout: () => void;
}

function IconOutlineLogout() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/logout">
      <div className="absolute inset-[16.67%_12.5%]" data-name="Icon">
        <div className="absolute inset-[-6.25%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
            <path d={svgPaths.p3737d200} id="Icon" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Dashboard icons (white for green circles)
function HeroiconsOutlineStar() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/star">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/star">
          <path d={svgPaths.p29e82700} id="Star 5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineTrophy() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/trophy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/trophy">
          <path d={svgPaths.p301808c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsSolidArrowTrendingUp() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-solid/arrow-trending-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-solid/arrow-trending-up">
          <path clipRule="evenodd" d={svgPaths.p103d52b0} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineFlag() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/flag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/flag">
          <path d={svgPaths.p127ccb80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

// Drawer icons (green for friend stats)
function HeroiconsOutlineFlagGreen() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/flag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/flag">
          <path d={svgPaths.p127ccb80} id="Vector" stroke="var(--stroke-0, #517b34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineTrophyGreen() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/trophy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/trophy">
          <path d={svgPaths.p301808c0} id="Vector" stroke="var(--stroke-0, #517b34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsSolidArrowTrendingUpGreen() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-solid/arrow-trending-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-solid/arrow-trending-up">
          <path clipRule="evenodd" d={svgPaths.p103d52b0} fill="var(--fill-0, #517b34)" fillRule="evenodd" id="Vector (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineUserGroup() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/user-group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/user-group">
          <path d={svgPaths.p84e3670} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconOutlineArrowSmRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/arrow-sm-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/arrow-sm-right">
          <path d={svgPaths.p22f0df80} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconOutlinePlusCircle() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/plus-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/plus-circle">
          <path d={svgPaths.p1c26fc00} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconOutlineArrowSmRightWhite() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/arrow-sm-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/arrow-sm-right">
          <path d={svgPaths.p22f0df80} id="Icon" stroke="var(--stroke-0, #FEFFFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// Round details icon components
function HeroiconsOutlineCalendar() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPathsDetails.p14dab580} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HeroiconsOutlineMapPin() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPathsDetails.p2aabd000} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPathsDetails.p16d04a00} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineFlagDetails() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPathsDetails.p127ccb80} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function AuthenticatedHomeScreen({ accessToken, onStartRound, onLogout }: AuthenticatedHomeScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRound, setActiveRound] = useState<any>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [addFriendError, setAddFriendError] = useState("");
  const [addFriendSuccess, setAddFriendSuccess] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [showAllRounds, setShowAllRounds] = useState(false);
  const [allRounds, setAllRounds] = useState<Round[]>([]);
  const [showFriendStats, setShowFriendStats] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friendStats, setFriendStats] = useState<{
    totalRounds: number;
    roundsWon: number;
    roundsLost: number;
    xp: number;
    level: number;
  } | null>(null);
  const [loadingFriendStats, setLoadingFriendStats] = useState(false);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [roundsSheetView, setRoundsSheetView] = useState<'list' | 'details'>('list'); // Track which view to show in the sheet
  const [showBackToList, setShowBackToList] = useState(false); // Track if back arrow should be shown
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showActiveRoundDetails, setShowActiveRoundDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, [accessToken]);

  const loadData = async () => {
    try {
      // Load profile
      const profileRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/profile`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      const profileData = await profileRes.json();
      if (profileData.profile) {
        setProfile(profileData.profile);
      }

      // Load active round
      try {
        const activeRoundRes = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/active-round`,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );
        if (activeRoundRes.ok) {
          const activeRoundData = await activeRoundRes.json();
          console.log("Active round data loaded:", activeRoundData);
          if (activeRoundData.round) {
            setActiveRound(activeRoundData.round);
          } else {
            setActiveRound(null);
          }
        } else {
          setActiveRound(null);
        }
      } catch (error) {
        console.error("Failed to load active round:", error);
        setActiveRound(null);
        // Continue loading other data even if active round fails
      }

      // Load rounds
      const roundsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/rounds`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      const roundsData = await roundsRes.json();
      if (roundsData.rounds) {
        setRounds(roundsData.rounds.slice(0, 3)); // Show last 3 rounds
        setAllRounds(roundsData.rounds); // Store all rounds for the drawer
      }

      // Load friends
      const friendsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/friends`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      const friendsData = await friendsRes.json();
      if (friendsData.friends) {
        setFriends(friendsData.friends);
      }

      // Load friend requests
      const requestsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/friend-requests`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
      const requestsData = await requestsRes.json();
      if (requestsData.incomingRequests) {
        setIncomingRequests(requestsData.incomingRequests);
      }
      if (requestsData.outgoingRequests) {
        setOutgoingRequests(requestsData.outgoingRequests);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFriendError("");
    setAddFriendSuccess("");

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/add-friend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ friendEmail }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setAddFriendError(data.error || "Failed to send friend request");
        return;
      }

      if (data.autoAccepted) {
        setAddFriendSuccess("Friend request accepted (mutual)!");
      } else {
        setAddFriendSuccess("Friend request sent!");
      }
      setFriendEmail("");
      setShowAddFriend(false);
      // Reload friends list and requests
      loadData();
    } catch (error) {
      console.error("Error adding friend:", error);
      setAddFriendError("Failed to send friend request");
    }
  };

  const handleAcceptFriendRequest = async (fromUserId: string) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/accept-friend-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ fromUserId }),
        }
      );

      if (!res.ok) {
        console.error("Failed to accept friend request");
        return;
      }

      // Reload data to update friends and requests
      loadData();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDenyFriendRequest = async (fromUserId: string) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/deny-friend-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ fromUserId }),
        }
      );

      if (!res.ok) {
        console.error("Failed to deny friend request");
        return;
      }

      // Reload data to update requests
      loadData();
    } catch (error) {
      console.error("Error denying friend request:", error);
    }
  };

  const handleRemoveFriend = (e: React.MouseEvent, friend: Friend) => {
    e.stopPropagation(); // Prevent triggering the friend click
    setFriendToRemove(friend);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;
    
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/remove-friend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ friendUserId: friendToRemove.userId }),
        }
      );

      if (!res.ok) {
        console.error("Failed to remove friend");
        return;
      }

      // Reload friends list
      loadData();
      setShowRemoveConfirm(false);
      setFriendToRemove(null);
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleFriendClick = async (friend: Friend) => {
    setSelectedFriend(friend);
    setShowFriendStats(true);
    setLoadingFriendStats(true);

    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/friend-stats/${friend.userId}`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      if (data.stats) {
        setFriendStats(data.stats);
      }
    } catch (error) {
      console.error("Error loading friend stats:", error);
    } finally {
      setLoadingFriendStats(false);
    }
  };

  const handleRoundClick = (round: Round, fromList: boolean = false) => {
    setSelectedRound(round);
    setRoundsSheetView('details'); // Switch to details view within the same sheet
    setShowBackToList(fromList); // Only show back arrow if navigating from list
    if (!fromList) {
      setShowAllRounds(true); // Open the sheet if coming from recent rounds
    }
  };

  const handleBackToAllRounds = () => {
    setRoundsSheetView('list'); // Switch back to list view
    setSelectedRound(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5242880) {
      alert("File too large. Maximum size is 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PNG, JPG, and WebP are allowed");
      return;
    }

    // Create image URL for cropping
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Clear the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setShowCropModal(false);
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('photo', croppedImageBlob, 'profile-photo.jpg');

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-15cc1085/upload-profile-photo`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to upload photo");
        return;
      }

      // Update profile with new photo URL
      setProfile(prev => prev ? { ...prev, profilePhotoUrl: data.photoUrl } : null);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Memoize round details data to avoid recalculating on every render
  // Must be before any early returns to follow Rules of Hooks
  const roundDetailsData = useMemo(() => {
    if (!selectedRound) return null;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    };

    const playersWithStatus = selectedRound.players.map(player => {
      const survived = player.strikes < player.maxStrikes;
      const isCaught = player.strikes >= player.maxStrikes;
      const xp = calculatePlayerXP(
        selectedRound.isVictory,
        isCaught,
        player.strikes,
        selectedRound.difficulty?.name || 'Easy',
        selectedRound.totalHoles || 9
      );
      
      // Update avatar URL with current profile photo
      let currentAvatarUrl = player.avatarUrl;
      
      // If this is the current user, use their current profile photo
      if (player.isCurrentUser && profile?.profilePhotoUrl) {
        currentAvatarUrl = profile.profilePhotoUrl;
      }
      // If this is a friend, look up their current profile photo
      else if (player.friendId) {
        const friend = friends.find(f => f.userId === player.friendId);
        if (friend?.profilePhotoUrl) {
          currentAvatarUrl = friend.profilePhotoUrl;
        }
      }
      
      return {
        ...player,
        avatarUrl: currentAvatarUrl,
        survived,
        isCaught,
        xp
      };
    });

    const survivedPlayers = playersWithStatus.filter(p => p.survived);
    const caughtPlayers = playersWithStatus.filter(p => p.isCaught);

    return {
      formattedDate: formatDate(selectedRound.completedAt),
      survivedPlayers,
      caughtPlayers
    };
  }, [selectedRound, profile, friends]);

  if (loading) {
    return (
      <div className="bg-[#cee7bd] min-h-screen flex items-center justify-center">
        <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[18px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Loading...
        </p>
      </div>
    );
  }

  const winRate = profile && profile.totalRounds > 0 
    ? Math.round((profile.roundsWon / profile.totalRounds) * 100) 
    : 0;

  // Get rank progression using the new rank system
  const rankProgress = profile ? getProgressToNextRank(profile.xp) : {
    current: { level: 1, name: "Private Excuse", xpRequired: 0, cumulativeXP: 0 },
    next: { level: 2, name: "Corporal Calendar Blocker", xpRequired: 300, cumulativeXP: 300 },
    progress: 0,
    xpToNext: 300,
    currentRankXP: 0
  };
  
  const xpProgressWidth = rankProgress.progress * 100;

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="bg-[#cee7bd] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#517b34] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#cee7bd] min-h-screen pb-24 relative overflow-hidden" data-name="iPhone 16 Plus - 31">
      {/* Background Image - Golf Course at bottom */}
      <div className="fixed bottom-0 left-0 right-0 w-full pointer-events-none z-0">
        <img 
          src={golfCourseBackgroundImg} 
          alt="" 
          className="w-full h-auto object-cover opacity-40"
          style={{ maxHeight: '50vh' }}
        />
      </div>

      {/* Scrollable Content */}
      <div className="w-full max-w-[430px] mx-auto px-[24px] pt-[24px] pb-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-[40px] w-auto">
            <img 
              src={logoImg} 
              alt="Hooky Golf" 
              className="h-full w-auto object-contain"
            />
          </div>
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

        {/* Profile Avatar Section */}
        <motion.div 
          className="flex flex-col items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative">
            <Avatar className="size-[96px] bg-[#f97316] border-4 border-[#DDF7CB]">
              <AvatarImage src={profile?.profilePhotoUrl} alt={profile?.name} />
              <AvatarFallback className="bg-transparent p-0">
                <img src={defaultAvatarImg} alt="Default avatar" className="size-full object-cover rounded-full" />
              </AvatarFallback>
            </Avatar>
            
            {/* Upload button overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 bg-[#517b34] hover:bg-[#456628] text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50"
              aria-label="Upload profile photo"
            >
              <Camera className="size-5" />
            </button>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          
          <p className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[20px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Welcome back, {profile?.name}!
          </p>
        </motion.div>

        {/* Level Card */}
        <motion.div 
          className="box-border content-stretch flex flex-col gap-[16px] p-[24px] rounded-[32px] mb-3 relative"
          style={{ background: 'rgba(206, 231, 189, 0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
          
          {/* Level Info Row */}
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
            {/* Rank Badge */}
            <div className="h-[72px] w-[72px] relative shrink-0">
              <img 
                src={
                  rankProgress.current.level === 1 ? rookieBadgeImg :
                  rankProgress.current.level === 2 ? amateurBadgeImg :
                  rankProgress.current.level === 3 ? noviceBadgeImg :
                  rankProgress.current.level === 4 ? prodigyBadgeImg :
                  rankProgress.current.level === 5 ? expertBadgeImg :
                  rankProgress.current.level === 6 ? legendBadgeImg :
                  rankProgress.current.level === 7 ? heroBadgeImg :
                  rankProgress.current.level === 8 ? godBadgeImg :
                  rankBadgeImg
                } 
                alt="Rank badge" 
                className="h-full w-full object-contain"
              />
            </div>

            {/* Level Text */}
            <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px not-italic relative shrink-0 text-[#282828]">
              <p className="luckiest-guy leading-[24px] relative shrink-0 text-[20px] w-full">Level {rankProgress.current.level}</p>
              <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {rankProgress.current.name}
              </p>
            </div>

            {/* XP Text */}
            <div className="content-stretch flex flex-col gap-[10px] h-full items-end justify-start relative shrink-0 w-[100px]">
              <div className="content-stretch flex flex-col items-end relative shrink-0 w-full">
                {rankProgress.next ? (
                  <p className="luckiest-guy leading-[20px] not-italic relative shrink-0 text-[#517b34] text-[16px] w-full whitespace-nowrap text-right">{rankProgress.currentRankXP}/{rankProgress.next.xpRequired} XP</p>
                ) : (
                  <p className="luckiest-guy leading-[20px] not-italic relative shrink-0 text-[#517b34] text-[16px] w-full whitespace-nowrap text-right">MAX RANK</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gradient-to-r content-stretch flex flex-col from-[rgba(81,123,52,0.25)] gap-[10px] h-[16px] items-start justify-center overflow-clip relative rounded-[100px] shrink-0 to-[rgba(81,123,52,0.25)] w-full">
            <motion.div 
              className="xp-progress-bar rounded-[100px] shrink-0 h-full" 
              initial={{ width: '0%' }}
              animate={{ width: `${xpProgressWidth}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{ minWidth: '42px' }}
            />
          </div>
        </motion.div>

        {/* Stats Grid - First Row */}
        <div className="content-stretch flex gap-[12px] items-center mb-3 w-full">
          {/* Rounds Won */}
          <motion.div 
            className="basis-0 grow min-h-px min-w-px relative rounded-[32px] shrink-0"
            style={{ background: 'rgba(206, 231, 189, 0.5)' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex flex-col items-center justify-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative w-full">
                <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                  <div className="bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[12px] py-0 relative rounded-[100px] shrink-0">
                    <HeroiconsOutlineTrophy />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#282828] text-center w-full">
                  <p className="luckiest-guy relative shrink-0 text-[48px] w-full">{profile?.roundsWon || 0}</p>
                  <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    Rounds won
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Win Rate */}
          <motion.div 
            className="basis-0 grow min-h-px min-w-px relative rounded-[32px] shrink-0"
            style={{ background: 'rgba(206, 231, 189, 0.5)' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex flex-col items-center justify-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative w-full">
                <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                  <div className="bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[12px] py-0 relative rounded-[100px] shrink-0">
                    <HeroiconsSolidArrowTrendingUp />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#282828] text-center w-full">
                  <p className="luckiest-guy relative shrink-0 text-[48px] w-full">{winRate}%</p>
                  <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    Win rate
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid - Second Row */}
        <div className="content-stretch flex gap-[12px] items-center mb-3 w-full">
          {/* Total Rounds */}
          <motion.div 
            className="basis-0 grow min-h-px min-w-px relative rounded-[32px] shrink-0"
            style={{ background: 'rgba(206, 231, 189, 0.5)' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex flex-col items-center justify-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative w-full">
                <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                  <div className="bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[12px] py-0 relative rounded-[100px] shrink-0">
                    <HeroiconsOutlineFlag />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#282828] text-center w-full">
                  <p className="luckiest-guy relative shrink-0 text-[48px] w-full">{profile?.totalRounds || 0}</p>
                  <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    Total rounds
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Friends */}
          <motion.div 
            className="basis-0 grow min-h-px min-w-px relative rounded-[32px] shrink-0"
            style={{ background: 'rgba(206, 231, 189, 0.5)' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex flex-col items-center justify-center size-full">
              <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[24px] relative w-full">
                <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                  <div className="bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[12px] py-0 relative rounded-[100px] shrink-0">
                    <HeroiconsOutlineUserGroup />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[#282828] text-center w-full">
                  <p className="luckiest-guy relative shrink-0 text-[48px] w-full">{friends.length}</p>
                  <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    Friends
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Round Card (In-Progress) */}
        {activeRound && (
          <motion.div 
            className="box-border content-stretch flex flex-col gap-[16px] p-[24px] rounded-[32px] mb-3 relative"
            style={{ background: 'rgba(206, 231, 189, 0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px relative shrink-0">
                <p className="luckiest-guy leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] w-full">Round in progress</p>
              </div>
            </div>

            <button
              onClick={() => setShowActiveRoundDetails(true)}
              className="box-border content-stretch flex gap-[12px] items-center p-[16px] rounded-[16px] relative w-full hover:bg-[#517b34]/10 transition-colors cursor-pointer"
              style={{ background: 'rgba(81, 123, 52, 0.05)' }}
            >
              {/* Play Icon */}
              <div className="flex items-center justify-center size-[40px] rounded-full shrink-0 bg-[#f97316]">
                <svg className="size-[24px]" fill="white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>

              {/* Round Details */}
              <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                <p className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {activeRound.players?.length || 0} player{activeRound.players?.length !== 1 ? 's' : ''}
                </p>
                {activeRound.course && (
                  <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[12px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    {activeRound.course.name}
                  </p>
                )}
                <p className="font-['Geologica:Light',_sans-serif] font-light text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {activeRound.difficulty?.name} • {activeRound.totalHoles} holes
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="w-[20px] h-[20px] flex-shrink-0" style={{ '--stroke-0': '#517b34' } as React.CSSProperties}>
                <HeroiconsOutlineArrowRight />
              </div>
            </button>
          </motion.div>
        )}

        {/* Recent Rounds Card */}
        <motion.div 
          className="box-border content-stretch flex flex-col gap-[16px] p-[24px] rounded-[32px] mb-3 relative"
          style={{ background: 'rgba(206, 231, 189, 0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
          
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px relative shrink-0">
              <p className="luckiest-guy leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] w-full">Recent rounds</p>
            </div>
          </div>

          {rounds.length === 0 ? (
            <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              No rounds played yet. Start your first round of Hooky Golf.
            </p>
          ) : (
            <div className="flex flex-col gap-[12px] w-full">
              {rounds.map((round, index) => {
                const date = new Date(round.completedAt);
                const formattedDate = date.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                });
                
                return (
                  <motion.button
                    key={round.id}
                    onClick={() => handleRoundClick(round)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + (index * 0.1), ease: "easeOut" }}
                    className="box-border content-stretch flex gap-[12px] items-center p-[16px] rounded-[16px] relative w-full hover:bg-[#517b34]/10 transition-colors cursor-pointer"
                    style={{ background: 'rgba(81, 123, 52, 0.05)' }}
                  >
                    {/* Result Icon */}
                    <div className={`flex items-center justify-center size-[40px] rounded-full shrink-0 ${round.isVictory ? 'bg-[#517b34]' : 'bg-[#C43C3C]'}`}>
                      {round.isVictory ? (
                        <HeroiconsOutlineTrophy />
                      ) : (
                        <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    {/* Round Details */}
                    <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                      <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {formattedDate}
                      </p>
                      <p className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {round.isVictory ? 'Victory!' : 'Caught'}
                      </p>
                      {round.course && (
                        <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[12px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {round.course.name}
                        </p>
                      )}
                      <p className="font-['Geologica:Light',_sans-serif] font-light text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {round.difficulty.name} • {round.totalHoles} holes
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="w-[20px] h-[20px] flex-shrink-0" style={{ '--stroke-0': '#517b34' } as React.CSSProperties}>
                      <HeroiconsOutlineArrowRight />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {rounds.length > 0 && (
            <button
              onClick={() => {
                setShowAllRounds(true);
                setRoundsSheetView('list'); // Always start at list view
              }}
              className="bg-transparent relative rounded-[100px] shrink-0 w-full hover:bg-[#517b34]/5 transition-colors"
            >
              <div className="flex flex-row items-center justify-center overflow-clip size-full">
                <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[39px] py-[12px] relative w-full">
                  <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    <p className="leading-[normal] whitespace-pre">View all rounds</p>
                  </div>
                  <IconOutlineArrowSmRight />
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
            </button>
          )}
        </motion.div>

        {/* Courses Map Card */}
        <CoursesMapCard rounds={allRounds} accessToken={accessToken} />

        {/* Friends Card */}
        <motion.div 
          className="box-border content-stretch flex flex-col gap-[16px] p-[24px] rounded-[32px] mb-3 relative"
          style={{ background: 'rgba(206, 231, 189, 0.5)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        >
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
          
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-center min-h-px min-w-px relative shrink-0">
              <p className="luckiest-guy leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] w-full">Friends</p>
            </div>
          </div>

          {showAddFriend ? (
            <form onSubmit={handleAddFriend} className="flex flex-col gap-4">
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="friend@email.com"
                required
                className="bg-white border-b border-[#517b34] px-[16px] py-[10px] font-['Geologica:Light',_sans-serif] font-light text-[#517b34] text-[16px] outline-none"
                style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
              />
              {addFriendError && (
                <p className="font-['Geologica:Regular',_sans-serif] text-[#C43C3C] text-[14px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {addFriendError}
                </p>
              )}
              {addFriendSuccess && (
                <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[14px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {addFriendSuccess}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#517b34] hover:bg-[#456628] rounded-[100px] px-[24px] py-[12px] text-white font-['Geologica:Regular',_sans-serif] transition-colors text-center"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFriend(false);
                    setAddFriendError("");
                    setAddFriendSuccess("");
                  }}
                  className="flex-1 bg-[#cee7bd] hover:bg-[#b8d1a7] rounded-[100px] px-[24px] py-[12px] text-[#517b34] font-['Geologica:Regular',_sans-serif] border border-[#517b34] transition-colors text-center"
                  style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Friend Requests Section */}
              {(incomingRequests.length > 0 || outgoingRequests.length > 0) && (
                <div className="flex flex-col gap-[12px] w-full">
                  {/* Incoming Requests */}
                  {incomingRequests.map((request, index) => {
                    const initials = request.fromName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <motion.div
                        key={`incoming-${request.fromUserId}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
                        className="box-border content-stretch flex flex-col gap-[12px] p-[16px] rounded-[16px] relative w-full"
                        style={{ background: 'rgba(81, 123, 52, 0.05)' }}
                      >
                        <div className="flex gap-[12px] items-center">
                          {/* Avatar */}
                          <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-[#f97316] flex-shrink-0">
                            <Avatar className="w-full h-full">
                              <AvatarImage 
                                src={request.fromProfilePhotoUrl || defaultAvatarImg} 
                                alt={request.fromName} 
                              />
                              <AvatarFallback className="bg-[#517b34] text-white font-['Geologica:Bold',_sans-serif] text-[18px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Name and Email */}
                          <div className="flex-1 min-w-0">
                            <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[16px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {request.fromName}
                            </p>
                            <p className="font-['Geologica:Regular',_sans-serif] text-[#282828]/60 text-[14px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {request.fromEmail}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptFriendRequest(request.fromUserId)}
                            className="flex-1 bg-[#517b34] hover:bg-[#456628] text-white rounded-[100px] px-4 py-2.5 font-['Geologica:SemiBold',_sans-serif] text-[14px] transition-colors flex items-center justify-center gap-2"
                            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                          >
                            <Check className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDenyFriendRequest(request.fromUserId)}
                            className="flex-1 bg-white hover:bg-[#f1f5f9] text-[#282828] border border-[#517b34] rounded-[100px] px-4 py-2.5 font-['Geologica:SemiBold',_sans-serif] text-[14px] transition-colors flex items-center justify-center gap-2"
                            style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                          >
                            <X className="w-4 h-4" />
                            Deny
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Outgoing Requests */}
                  {outgoingRequests.map((request, index) => {
                    const displayName = request.toName || 'Unknown User';
                    const displayEmail = request.toEmail || 'Pending...';
                    const initials = displayName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <motion.div
                        key={`outgoing-${request.toUserId}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (incomingRequests.length + index) * 0.1, ease: "easeOut" }}
                        className="box-border content-stretch flex flex-col gap-[12px] p-[16px] rounded-[16px] relative w-full"
                        style={{ background: 'rgba(81, 123, 52, 0.05)' }}
                      >
                        <div className="flex gap-[12px] items-center">
                          {/* Avatar */}
                          <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-[#f97316] flex-shrink-0">
                            <Avatar className="w-full h-full">
                              <AvatarImage 
                                src={request.toProfilePhotoUrl || defaultAvatarImg} 
                                alt={displayName} 
                              />
                              <AvatarFallback className="bg-[#517b34] text-white font-['Geologica:Bold',_sans-serif] text-[18px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Name and Email */}
                          <div className="flex-1 min-w-0">
                            <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[16px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {displayName}
                            </p>
                            <p className="font-['Geologica:Regular',_sans-serif] text-[#282828]/60 text-[14px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {displayEmail}
                            </p>
                          </div>
                        </div>

                        {/* Friend Request Status */}
                        <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[14px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Friend request sent
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Friends List */}
              {friends.length === 0 ? (
                <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  No friends yet. Add some to compare stats and start rounds together
                </p>
              ) : (
                <div className="flex flex-col gap-[12px] w-full">
                  {friends.map((friend, index) => (
                    <motion.div
                      key={friend.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + (index * 0.1), ease: "easeOut" }}
                      className="box-border content-stretch flex gap-[12px] items-center p-[16px] rounded-[16px] relative w-full hover:bg-[#517b34]/10 transition-colors group"
                      style={{ background: 'rgba(81, 123, 52, 0.05)' }}
                    >
                      <button
                        onClick={() => handleFriendClick(friend)}
                        className="flex gap-[12px] items-center flex-1 min-w-0 cursor-pointer"
                      >
                        {/* Friend Avatar */}
                        <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-[#f97316] flex-shrink-0">
                          <Avatar className="w-full h-full">
                            <AvatarImage src={friend.profilePhotoUrl || defaultAvatarImg} alt={friend.name} />
                            <AvatarFallback className="bg-transparent">
                              <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Friend Info */}
                        <div className="flex-1 flex flex-col gap-[2px] min-w-0">
                          <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[16px] truncate text-left" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            {friend.name}
                          </p>
                          <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[14px] text-left" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            {getRankFromXP(friend.xp || 0).name}
                          </p>
                        </div>
                      </button>

                      {/* Remove Friend Button */}
                      <button
                        onClick={(e) => handleRemoveFriend(e, friend)}
                        className="p-2 hover:bg-[#C43C3C]/10 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Remove friend"
                        style={{ '--stroke-0': '#C43C3C' } as React.CSSProperties}
                      >
                        <div className="w-[20px] h-[20px]">
                          <HeroiconsOutlineTrash />
                        </div>
                      </button>

                      {/* Arrow Button */}
                      <button
                        onClick={() => handleFriendClick(friend)}
                        className="p-2 hover:bg-[#517b34]/10 rounded-lg transition-colors flex-shrink-0"
                        aria-label="View friend details"
                        style={{ '--stroke-0': '#517b34' } as React.CSSProperties}
                      >
                        <div className="w-[20px] h-[20px]">
                          <HeroiconsOutlineArrowRight />
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowAddFriend(true)}
                className="bg-[#cee7bd] relative rounded-[100px] shrink-0 w-full hover:bg-[#b8d1a7] transition-colors"
              >
                <div className="flex flex-row items-center justify-center overflow-clip size-full">
                  <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[39px] py-[12px] relative w-full">
                    <IconOutlinePlusCircle />
                    <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      <p className="leading-[normal] whitespace-pre">Add friend</p>
                    </div>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#517b34] box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[20px] hover:bg-[#456628] transition-colors cursor-pointer" onClick={() => profile && onStartRound(profile)}>
        <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p className="leading-[normal] whitespace-pre">Start new round</p>
        </div>
        <IconOutlineArrowSmRightWhite />
      </div>

      {/* Image Crop Modal */}
      <ImageCropModal
        open={showCropModal}
        imageSrc={imageSrc}
        onClose={() => setShowCropModal(false)}
        onCropComplete={handleCropComplete}
      />

      {/* All Rounds Sheet with Details View */}
      <Sheet open={showAllRounds} onOpenChange={(open) => {
        setShowAllRounds(open);
        if (!open) {
          // Reset to list view when closing
          setRoundsSheetView('list');
          setSelectedRound(null);
          setShowBackToList(false);
        }
      }}>
        <SheetContent 
          side="bottom" 
          className="bg-[#cee7bd] border-t-2 border-[#517b34] h-[85vh] p-0 [&>button]:hidden"
          aria-describedby={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{roundsSheetView === 'list' ? 'All rounds' : 'Round Details'}</SheetTitle>
          </SheetHeader>
          
          {roundsSheetView === 'list' ? (
            <>
              {/* All Rounds List View */}
              <div className="sticky top-0 bg-[#cee7bd] z-10 border-b border-[#517b34]/20 px-6 py-5 flex items-center justify-between">
                <h2 className="luckiest-guy text-[#282828] text-[24px] leading-none mt-[6px]">All rounds</h2>
                <button
                  onClick={() => setShowAllRounds(false)}
                  className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="size-6 text-[#282828]" />
                </button>
              </div>

              <div className="overflow-y-auto h-full px-6 pb-6">
                {allRounds.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      No rounds played yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 py-4">
                    {allRounds.map((round, index) => {
                      const date = new Date(round.completedAt);
                      const formattedDate = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      });
                      
                      return (
                        <button
                          key={round.id}
                          onClick={() => handleRoundClick(round, true)}
                          className="box-border content-stretch flex gap-[12px] items-center p-[16px] rounded-[16px] relative w-full hover:bg-[#517b34]/10 transition-colors cursor-pointer"
                          style={{ background: 'rgba(81, 123, 52, 0.05)' }}
                        >
                          <div className={`flex items-center justify-center size-[40px] rounded-full shrink-0 ${round.isVictory ? 'bg-[#517b34]' : 'bg-[#C43C3C]'}`}>
                            {round.isVictory ? (
                              <HeroiconsOutlineTrophy />
                            ) : (
                              <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                            <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {formattedDate}
                            </p>
                            <p className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {round.isVictory ? 'Victory!' : 'Caught'}
                            </p>
                            {round.course && (
                              <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[12px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                {round.course.name}
                              </p>
                            )}
                            <p className="font-['Geologica:Light',_sans-serif] font-light text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {round.difficulty.name} • {round.totalHoles} holes
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : selectedRound ? (
            <>
              {/* Round Details View */}
              <div className="sticky top-0 bg-[#cee7bd] z-10 border-b border-[#517b34]/20 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showBackToList && (
                    <button
                      onClick={handleBackToAllRounds}
                      className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors"
                      aria-label="Back to all rounds"
                    >
                      <ArrowLeft className="size-6 text-[#282828]" />
                    </button>
                  )}
                  <h2 className="luckiest-guy text-[#282828] text-[24px] leading-none mt-[6px]">Round details</h2>
                </div>
                <button
                  onClick={() => setShowAllRounds(false)}
                  className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="size-6 text-[#282828]" />
                </button>
              </div>

              <div className="overflow-y-auto h-full px-6 py-6">
                {roundDetailsData && (
                  <>
                    {/* Game Info Card */}
                    <div className="box-border content-stretch flex flex-col gap-[24px] px-[16px] py-[24px] rounded-[32px] mb-6 relative">
                      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
                      
                      {/* Date */}
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                        <HeroiconsOutlineCalendar />
                        <div className="content-stretch flex flex-col font-['Geologica:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap">
                          <div className="flex flex-col justify-end relative shrink-0 text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            <p className="leading-[normal] text-nowrap whitespace-pre">Date</p>
                          </div>
                          <div className="flex flex-col justify-end relative shrink-0 text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            <p className="leading-[normal] whitespace-pre">{roundDetailsData.formattedDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Course */}
                      {selectedRound.course && (
                        <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                          <HeroiconsOutlineMapPin />
                          <div className="content-stretch flex flex-col font-['Geologica:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap">
                            <div className="flex flex-col justify-end relative shrink-0 text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              <p className="leading-[normal] text-nowrap whitespace-pre">Course</p>
                            </div>
                            <div className="flex flex-col justify-end relative shrink-0 text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              <p className="leading-[normal] whitespace-pre">{selectedRound.course.name}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Game Details */}
                      <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                        <HeroiconsOutlineFlagDetails />
                        <div className="content-stretch flex flex-col font-['Geologica:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[16px]">
                          <div className="flex flex-col justify-end relative shrink-0 text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            <p className="leading-[normal]">Game Details</p>
                          </div>
                          <div className="flex flex-col justify-end relative shrink-0 text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            <p className="leading-[normal]">{selectedRound.difficulty.name} • {selectedRound.totalHoles} holes</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Players Card */}
                    <div className="box-border content-stretch flex flex-col gap-[24px] px-[16px] py-[24px] rounded-[32px] relative mb-6">
                      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
                      
                      <div className="content-stretch flex flex-col gap-[16px] items-start relative w-full">
                        {/* Hooky Heroes Section */}
                        {roundDetailsData.survivedPlayers.length > 0 && (
                          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                            <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                              <p className="luckiest-guy leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px]">
                                Hooky heroes
                              </p>
                            </div>
                            <p className="font-['Geologica',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              Escaped the grind and made it to glory.
                            </p>
                            
                            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-2">
                              {roundDetailsData.survivedPlayers.map((player, index) => (
                                <div key={player.id} className="w-full">
                                  {index > 0 && (
                                    <div className="flex items-center h-[26px] relative w-full">
                                      <div aria-hidden="true" className="border-[#517b34] border-t border-solid w-full pointer-events-none" />
                                    </div>
                                  )}
                                  <div className="content-stretch flex flex-col gap-[10px] pb-[16px] pt-0">
                                    <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                                      <Avatar className="size-[40px]">
                                        <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                        <AvatarFallback className="bg-[#517b34] text-white font-['Geologica',_sans-serif] font-bold" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                          {player.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      
                                      <div className="absolute content-stretch flex font-['Geologica',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] left-[56px] not-italic overflow-clip text-[16px] top-0" style={{ width: 'calc(100% - 56px)' }}>
                                        <p className="basis-0 grow min-h-px min-w-px relative shrink-0 truncate text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                          {player.name}
                                        </p>
                                        <p className="relative shrink-0 text-nowrap whitespace-pre text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                          Strikes: {player.strikes}/{player.maxStrikes}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* Individual XP Display */}
                                    {player.xp > 0 && (
                                      <div className="w-full flex items-center justify-center gap-[8px] px-[12px] py-[6px] rounded-[12px] bg-[#517b34]/10 border border-[#517b34]">
                                        <p className="luckiest-guy text-[#517b34] text-[18px]">+{player.xp} XP</p>
                                        {player.strikes === 0 && (
                                          <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                            🏆 Perfect!
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Back to the Office Section */}
                        {roundDetailsData.caughtPlayers.length > 0 && (
                          <div className={`content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full ${roundDetailsData.survivedPlayers.length > 0 ? 'mt-6' : ''}`}>
                            <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                              <p className="luckiest-guy leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px]">
                                Back to the office
                              </p>
                            </div>
                            <p className="font-['Geologica',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              Cubicle captives with no escape.
                            </p>
                            
                            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-2">
                              {roundDetailsData.caughtPlayers.map((player, index) => (
                                <div key={player.id} className="w-full">
                                  {index > 0 && (
                                    <div className="flex items-center h-[26px] relative w-full">
                                      <div aria-hidden="true" className="border-[#517b34] border-t border-solid w-full pointer-events-none" />
                                    </div>
                                  )}
                                  <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                                    <Avatar className="size-[40px]">
                                      <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                      <AvatarFallback className="bg-[#517b34] text-white font-['Geologica',_sans-serif] font-bold" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                        {player.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="absolute content-stretch flex font-['Geologica',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] left-[56px] not-italic overflow-clip text-[16px] top-0" style={{ width: 'calc(100% - 56px)' }}>
                                      <p className="basis-0 grow min-h-px min-w-px relative shrink-0 truncate text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                        {player.name}
                                      </p>
                                      <p className="relative shrink-0 text-nowrap whitespace-pre text-[#c43c3c]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                        CAUGHT
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Friend Stats Drawer */}
      <Sheet open={showFriendStats} onOpenChange={setShowFriendStats}>
        <SheetContent 
          side="bottom" 
          className="bg-[#cee7bd] border-t-2 border-[#517b34] h-[70vh] p-0 [&>button]:hidden"
          aria-describedby={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{selectedFriend?.name}'s Stats</SheetTitle>
          </SheetHeader>
          
          {/* Header */}
          <div className="sticky top-0 bg-[#cee7bd] z-10 border-b border-[#517b34]/20 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFriendStats(false)}
                className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors ml-auto"
                aria-label="Close"
              >
                <X className="size-6 text-[#282828]" />
              </button>
            </div>
            
            {/* Friend Avatar and Name */}
            <div className="flex items-center gap-4">
              <Avatar className="size-[64px] bg-[#f97316]">
                <AvatarImage src={selectedFriend?.profilePhotoUrl} alt={selectedFriend?.name} />
                <AvatarFallback className="bg-transparent p-0">
                  <img src={defaultAvatarImg} alt="Default avatar" className="size-full object-cover rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="luckiest-guy text-[#282828] text-[28px] leading-[1]">
                  {selectedFriend?.name}
                </p>
                <p className="font-['Geologica:Regular',_sans-serif] text-[#517b34] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {selectedFriend && RANKS[selectedFriend.level - 1]?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto h-full px-6 py-6">
            {loadingFriendStats ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Loading stats...
                </p>
              </div>
            ) : friendStats ? (
              <div className="flex flex-col gap-4">
                {/* Stats Grid */}
                <div className="flex flex-col gap-3">
                  {/* Total Rounds */}
                  <div className="box-border p-[20px] rounded-[24px] border border-[#517b34]">
                    <div className="flex items-center gap-2 mb-2">
                      <HeroiconsOutlineFlagGreen />
                      <p className="font-['Geologica:SemiBold',_sans-serif] text-[#517b34] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Total Rounds
                      </p>
                    </div>
                    <p className="luckiest-guy text-[#282828] text-[32px]">
                      {friendStats.totalRounds}
                    </p>
                  </div>

                  {/* Rounds Won */}
                  <div className="box-border p-[20px] rounded-[24px] border border-[#517b34]">
                    <div className="flex items-center gap-2 mb-2">
                      <HeroiconsOutlineTrophyGreen />
                      <p className="font-['Geologica:SemiBold',_sans-serif] text-[#517b34] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Rounds Won
                      </p>
                    </div>
                    <p className="luckiest-guy text-[#282828] text-[32px]">
                      {friendStats.roundsWon}
                    </p>
                  </div>

                  {/* Win Rate */}
                  <div className="box-border p-[20px] rounded-[24px] border border-[#517b34]">
                    <div className="flex items-center gap-2 mb-2">
                      <HeroiconsSolidArrowTrendingUpGreen />
                      <p className="font-['Geologica:SemiBold',_sans-serif] text-[#517b34] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Win Rate
                      </p>
                    </div>
                    <p className="luckiest-guy text-[#282828] text-[32px]">
                      {friendStats.totalRounds > 0 
                        ? `${Math.round((friendStats.roundsWon / friendStats.totalRounds) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px] text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Failed to load stats
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Friend Requests Modal */}
      <FriendRequestsModal
        isOpen={showFriendRequests}
        onClose={() => setShowFriendRequests(false)}
        requests={incomingRequests}
        onAccept={handleAcceptFriendRequest}
        onDeny={handleDenyFriendRequest}
      />

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setImageSrc("");
        }}
        imageSrc={imageSrc}
        onCropComplete={handleCropComplete}
      />

      {/* Remove Friend Confirmation Dialog */}
      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent className="bg-[#cee7bd] border-2 border-[#517b34] max-w-[340px] rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="luckiest-guy text-[#282828] text-[24px] text-center">
              Remove Friend?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[16px] text-center pt-2" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Are you sure you want to remove <span className="font-['Geologica:SemiBold',_sans-serif]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>{friendToRemove?.name}</span> from your friends list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 bg-[#cee7bd] hover:bg-[#b8d1a7] text-[#517b34] border-2 border-[#517b34] rounded-[100px] font-['Geologica:Regular',_sans-serif] mt-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveFriend}
              className="flex-1 bg-[#C43C3C] hover:bg-[#b91c1c] text-white rounded-[100px] font-['Geologica:Regular',_sans-serif]" 
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Active Round Details Sheet */}
      <Sheet open={showActiveRoundDetails} onOpenChange={setShowActiveRoundDetails}>
        <SheetContent 
          side="bottom" 
          className="bg-[#cee7bd] border-t-2 border-[#517b34] h-[85vh] p-0 [&>button]:hidden"
          aria-describedby={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Round in Progress</SheetTitle>
          </SheetHeader>
          
          {/* Header */}
          <div className="sticky top-0 bg-[#cee7bd] z-10 border-b border-[#517b34]/20 px-6 py-5 flex items-center justify-between">
            <h2 className="luckiest-guy text-[#282828] text-[24px] leading-none mt-[6px]">Round in Progress</h2>
            <button
              onClick={() => setShowActiveRoundDetails(false)}
              className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="size-6 text-[#282828]" />
            </button>
          </div>

          {activeRound && (
            <div className="overflow-y-auto h-full px-6 pb-6">
              <div className="flex flex-col gap-6 py-6">
                {/* Round Info */}
                <div className="box-border flex flex-col gap-4 p-6 rounded-[24px] border border-[#517b34]" style={{ background: 'rgba(81, 123, 52, 0.05)' }}>
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <HeroiconsOutlineCalendar />
                    <div className="flex-1">
                      <p className="font-['Geologica:Light',_sans-serif] text-[#282828]/60 text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Started
                      </p>
                      <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {new Date(activeRound.startedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: new Date(activeRound.startedAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Course */}
                  {activeRound.course && (
                    <div className="flex items-center gap-3">
                      <HeroiconsOutlineMapPin />
                      <div className="flex-1 min-w-0">
                        <p className="font-['Geologica:Light',_sans-serif] text-[#282828]/60 text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Course
                        </p>
                        <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[14px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {activeRound.course.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Difficulty & Holes */}
                  <div className="flex items-center gap-3">
                    <HeroiconsOutlineFlagDetails />
                    <div className="flex-1">
                      <p className="font-['Geologica:Light',_sans-serif] text-[#282828]/60 text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Settings
                      </p>
                      <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {activeRound.difficulty?.name} • {activeRound.totalHoles} holes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Players List */}
                <div className="flex flex-col gap-3">
                  <h3 className="luckiest-guy text-[#282828] text-[18px]">Players</h3>
                  
                  {activeRound.players?.map((player: any, index: number) => {
                    const initials = player.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div 
                        key={player.id || index}
                        className="box-border flex gap-3 items-center p-4 rounded-[16px] border border-[#517b34]"
                        style={{ background: 'rgba(81, 123, 52, 0.05)' }}
                      >
                        {/* Avatar */}
                        <div className="w-[48px] h-[48px] rounded-full overflow-hidden flex-shrink-0">
                          <Avatar className="w-full h-full">
                            <AvatarImage 
                              src={player.avatarUrl || defaultAvatarImg} 
                              alt={player.name} 
                            />
                            <AvatarFallback className="bg-[#517b34] text-white font-['Geologica:Bold',_sans-serif] text-[18px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className="font-['Geologica:SemiBold',_sans-serif] text-[#282828] text-[16px] truncate" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            {player.name}
                          </p>
                          <p className="font-['Geologica:Regular',_sans-serif] text-[#282828]/60 text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            {player.strikes || 0} / {player.maxStrikes || activeRound.difficulty?.strikes || 3} strikes
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}