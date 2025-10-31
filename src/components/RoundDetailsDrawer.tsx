import { X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "./ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import svgPaths from "../imports/svg-07jtzyo4w3";
import { calculatePlayerXP } from "../utils/rankSystem";

interface Player {
  id: string;
  name: string;
  strikes: number;
  maxStrikes: number;
  isCaught?: boolean;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  friendId?: string;
  xp?: number;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
  strikes?: number;
  maxStrikes?: number;
  isCaught?: boolean;
}

interface Round {
  id: string;
  isVictory: boolean;
  course?: {
    placeId: string;
    name: string;
    address: string;
  };
  difficulty: {
    name: string;
    strikes?: number;
  };
  totalHoles: number;
  completedAt: string;
  players: Player[];
  bossResults?: Array<{
    playerId: string;
    hole: number;
    bossName: string;
    success: boolean;
  }>;
  gameMode?: 'free-for-all' | 'teams';
  teams?: Team[];
  teamBossResults?: Array<{
    teamId: string;
    hole: number;
    bossName: string;
    success: boolean;
  }>;
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

interface RoundDetailsDrawerProps {
  round: Round | null;
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile | null;
  friends?: Friend[];
}

// Icon components matching the Figma design
function HeroiconsOutlineCalendar() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p14dab580} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function HeroiconsOutlineMapPin() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p2aabd000} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p16d04a00} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function HeroiconsOutlineFlag() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p127ccb80} stroke="#517B34" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function RoundDetailsDrawer({ round, isOpen, onClose, profile, friends = [] }: RoundDetailsDrawerProps) {
  if (!round) return null;

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

  // Check if this is team mode
  const isTeamMode = round.gameMode === 'teams' && round.teams && round.teams.length > 0;

  // Calculate player survival status and XP
  const playersWithStatus = round.players.map(player => {
    const survived = player.strikes < player.maxStrikes;
    const isCaught = player.strikes >= player.maxStrikes;
    const xp = calculatePlayerXP(
      round.isVictory,
      isCaught,
      player.strikes,
      round.difficulty?.name || 'Easy',
      round.totalHoles || 9
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

  // For team mode, organize players by team
  const teamsWithPlayers = isTeamMode ? round.teams!.map(team => {
    const teamPlayers = playersWithStatus.filter(p => team.playerIds.includes(p.id));
    const teamSurvived = !team.isCaught;
    return {
      ...team,
      players: teamPlayers,
      survived: teamSurvived
    };
  }) : [];

  const survivedTeams = teamsWithPlayers.filter(t => t.survived);
  const caughtTeams = teamsWithPlayers.filter(t => !t.survived);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#cee7bd] border-t-2 border-[#517b34] max-h-[85vh]">
        <DrawerTitle className="sr-only">Round Details</DrawerTitle>
        <DrawerDescription className="sr-only">
          View detailed results for this round including players and outcomes
        </DrawerDescription>
        
        <div className="w-full max-w-[430px] mx-auto relative">
          {/* Header with Title and Close Button */}
          <div className="sticky top-0 bg-[#cee7bd] z-10 border-b border-[#517b34]/20 px-6 py-5 flex items-center justify-between">
            <h2 className="luckiest-guy text-[#282828] text-[24px] leading-none mt-[6px]">Round details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#517b34]/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="size-6 text-[#282828]" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-64px)]">
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
                    <p className="leading-[normal] whitespace-pre">{formatDate(round.completedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Course */}
              {round.course && (
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                  <HeroiconsOutlineMapPin />
                  <div className="content-stretch flex flex-col font-['Geologica:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap">
                    <div className="flex flex-col justify-end relative shrink-0 text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      <p className="leading-[normal] text-nowrap whitespace-pre">Course</p>
                    </div>
                    <div className="flex flex-col justify-end relative shrink-0 text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      <p className="leading-[normal] whitespace-pre">{round.course.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Details */}
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                <HeroiconsOutlineFlag />
                <div className="content-stretch flex flex-col font-['Geologica:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[16px]">
                  <div className="flex flex-col justify-end relative shrink-0 text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    <p className="leading-[normal]">Game Details</p>
                  </div>
                  <div className="flex flex-col justify-end relative shrink-0 text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    <p className="leading-[normal]">{round.difficulty.name} • {round.totalHoles} holes{isTeamMode ? ' • Team Mode' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Players/Teams Card */}
            <div className="box-border content-stretch flex flex-col gap-[24px] px-[16px] py-[24px] rounded-[32px] relative mb-6">
              <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
              
              <div className="content-stretch flex flex-col gap-[16px] items-start relative w-full">
                {isTeamMode ? (
                  <>
                    {/* Team Mode - Winning Teams Section */}
                    {survivedTeams.length > 0 && (
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                        <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                          <p className="luckiest-guy leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px]">
                            Hooky heroes
                          </p>
                        </div>
                        <p className="font-['Geologica',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Teams that escaped the grind.
                        </p>
                        
                        {/* Winning Teams List */}
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-2">
                          {survivedTeams.map((team, teamIndex) => (
                            <div key={team.id} className="w-full">
                              {teamIndex > 0 && (
                                <div className="flex items-center h-[26px] relative w-full">
                                  <div aria-hidden="true" className="border-[#517b34] border-t border-solid w-full pointer-events-none" />
                                </div>
                              )}
                              
                              {/* Team Header */}
                              <div className="content-stretch flex flex-col gap-[12px] pb-[16px] pt-0">
                                <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                                  <p className="font-['Geologica',_sans-serif] font-bold text-[#517b34] text-[18px] flex-1" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                    {team.name}
                                  </p>
                                  <p className="font-['Geologica',_sans-serif] font-light text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                    Strikes: {team.strikes}/{team.maxStrikes}
                                  </p>
                                </div>
                                
                                {/* Team Members */}
                                <div className="content-stretch flex flex-col gap-[8px] pl-[16px]">
                                  {team.players.map((player) => (
                                    <div key={player.id} className="content-stretch flex h-[32px] items-center relative shrink-0 w-full">
                                      {/* Avatar */}
                                      {player.isCurrentUser || player.friendId ? (
                                        <div className="size-[32px] rounded-[100px] overflow-hidden bg-[#f97316] mr-[8px]">
                                          <Avatar className="w-full h-full">
                                            <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                            <AvatarFallback className="bg-transparent">
                                              <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                                            </AvatarFallback>
                                          </Avatar>
                                        </div>
                                      ) : (
                                        <Avatar className="size-[32px] mr-[8px]">
                                          <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                          <AvatarFallback className="bg-[#517b34] text-white text-[12px] font-['Geologica',_sans-serif] font-bold" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                            {player.name.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                      
                                      {/* Name */}
                                      <p className="font-['Geologica',_sans-serif] font-light text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                        {player.name}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Mode - Caught Teams Section */}
                    {caughtTeams.length > 0 && (
                      <div className={`content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full ${survivedTeams.length > 0 ? 'mt-6' : ''}`}>
                        <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                          <p className="luckiest-guy leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px]">
                            Back to the office
                          </p>
                        </div>
                        <p className="font-['Geologica',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Teams sent back to the cubicles.
                        </p>
                        
                        {/* Caught Teams List */}
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-2">
                          {caughtTeams.map((team, teamIndex) => (
                            <div key={team.id} className="w-full">
                              {teamIndex > 0 && (
                                <div className="flex items-center h-[26px] relative w-full">
                                  <div aria-hidden="true" className="border-[#517b34] border-t border-solid w-full pointer-events-none" />
                                </div>
                              )}
                              
                              {/* Team Header */}
                              <div className="content-stretch flex flex-col gap-[12px] pb-[16px] pt-0">
                                <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                                  <p className="font-['Geologica',_sans-serif] font-bold text-[#c43c3c] text-[18px] flex-1" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                    {team.name}
                                  </p>
                                  <p className="font-['Geologica',_sans-serif] font-light text-[#c43c3c] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                    CAUGHT
                                  </p>
                                </div>
                                
                                {/* Team Members */}
                                <div className="content-stretch flex flex-col gap-[8px] pl-[16px]">
                                  {team.players.map((player) => (
                                    <div key={player.id} className="content-stretch flex h-[32px] items-center relative shrink-0 w-full">
                                      {/* Avatar */}
                                      {player.isCurrentUser || player.friendId ? (
                                        <div className="size-[32px] rounded-[100px] overflow-hidden bg-[#c43c3c] mr-[8px]">
                                          <Avatar className="w-full h-full">
                                            <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                            <AvatarFallback className="bg-transparent">
                                              <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                                            </AvatarFallback>
                                          </Avatar>
                                        </div>
                                      ) : (
                                        <Avatar className="size-[32px] mr-[8px]">
                                          <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                          <AvatarFallback className="bg-[#c43c3c] text-white text-[12px] font-['Geologica',_sans-serif] font-bold" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                            {player.name.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                      
                                      {/* Name */}
                                      <p className="font-['Geologica',_sans-serif] font-light text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                        {player.name}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Free-For-All Mode - Hooky Heroes Section */}
                    {survivedPlayers.length > 0 && (
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                        <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                          <p className="luckiest-guy leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px]">
                            Hooky heroes
                          </p>
                        </div>
                        <p className="font-['Geologica',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Escaped the grind and made it to glory.
                        </p>
                        
                        {/* Survived Players List */}
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-2">
                          {survivedPlayers.map((player, index) => (
                            <div key={player.id} className="w-full">
                              {index > 0 && (
                                <div className="flex items-center h-[26px] relative w-full">
                                  <div aria-hidden="true" className="border-[#517b34] border-t border-solid w-full pointer-events-none" />
                                </div>
                              )}
                              <div className="content-stretch flex flex-col gap-[10px] pb-[16px] pt-0">
                                <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                                  {/* Avatar Circle with Initial */}
                                  {player.isCurrentUser || player.friendId ? (
                                    <div className="size-[40px] rounded-[100px] overflow-hidden bg-[#f97316]">
                                      <Avatar className="w-full h-full">
                                        <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                        <AvatarFallback className="bg-transparent">
                                          <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  ) : (
                                    <Avatar className="size-[40px]">
                                      <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                      <AvatarFallback className="bg-[#517b34] text-white font-['Geologica',_sans-serif] font-bold" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                        {player.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  
                                  {/* Name and Strikes */}
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

                    {/* Free-For-All Mode - Back to the Office Section */}
                    {caughtPlayers.length > 0 && (
                      <div className={`content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full ${survivedPlayers.length > 0 ? 'mt-6' : ''}`}>
                        <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-full">
                          <p className="luckiest-guy leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px]">
                            Back to the office
                          </p>
                        </div>
                        <p className="font-['Geologica',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Cubicle captives with no escape.
                        </p>
                        
                        {/* Caught Players List */}
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-2">
                          {caughtPlayers.map((player, index) => (
                            <div key={player.id} className="w-full">
                              {index > 0 && (
                                <div className="flex items-center h-[26px] relative w-full">
                                  <div aria-hidden="true" className="border-[#517b34] border-t border-solid w-full pointer-events-none" />
                                </div>
                              )}
                              <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                                {/* Avatar Circle with Initial */}
                                {player.isCurrentUser || player.friendId ? (
                                  <div className="size-[40px] rounded-[100px] overflow-hidden bg-[#f97316]">
                                    <Avatar className="w-full h-full">
                                      <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                      <AvatarFallback className="bg-transparent">
                                        <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                ) : (
                                  <Avatar className="size-[40px]">
                                    <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                    <AvatarFallback className="bg-[#517b34] text-white font-['Geologica',_sans-serif] font-bold" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                      {player.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                
                                {/* Name and CAUGHT status */}
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
