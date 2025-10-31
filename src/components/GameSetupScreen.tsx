import { useState, useMemo } from "react";
import svgPaths from "../imports/svg-3hdjoh0g6o";
import svgPathsXCircle from "../imports/svg-91t1riqmn2";
import svgPathsHome from "../imports/svg-zoxknpw915";
import svgPathsInfo from "../imports/svg-vqe4wdakee";
import { CourseSearchModal } from "./CourseSearchModal";
import { FriendSelectModal } from "./FriendSelectModal";
import { TeamManagementSection } from "./TeamManagementSection";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";

interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  friendId?: string; // Track if this player is a friend
}

interface Course {
  placeId: string;
  name: string;
  address: string;
}

interface CurrentUser {
  userId: string;
  name: string;
  profilePhotoUrl?: string;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
}

interface GameSetupScreenProps {
  onStartGame: (difficulty: { name: string; strikes: number }, players: Player[], holes: number, course?: Course | null, gameMode?: 'free-for-all' | 'teams', teams?: Team[]) => void;
  onExitToHome?: () => void;
  currentUser?: CurrentUser | null;
  accessToken?: string;
}

function IconOutlinePlusCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/plus-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p2782fd00} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineXCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/x-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPathsXCircle.p3f4d7080} id="Icon" stroke="var(--stroke-0, #C43C3C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineArrowSmRight() {
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

function IconOutlineHome() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/home">
          <path d={svgPathsHome.pbac00a0} id="Icon" stroke="var(--stroke-0, #517b34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconSolidInformationCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Solid/information-circle">
      <div className="absolute inset-[10%]" data-name="Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path clipRule="evenodd" d={svgPathsInfo.p52c0380} fill="var(--fill-0, #FFFFFF)" fillRule="evenodd" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

export function GameSetupScreen({ onStartGame, onExitToHome, currentUser, accessToken }: GameSetupScreenProps) {
  const [selectedHoles, setSelectedHoles] = useState(9);
  const [players, setPlayers] = useState<Player[]>([
    { 
      id: "1", 
      name: currentUser?.name || "",
      avatarUrl: currentUser?.profilePhotoUrl,
      isCurrentUser: !!currentUser
    }
  ]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [showLeaderInfoModal, setShowLeaderInfoModal] = useState(false);
  const [gameMode, setGameMode] = useState<'free-for-all' | 'teams'>('free-for-all');
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team-1', name: 'Team 1', playerIds: [] }
  ]);
  const getPlayerInitials = (name: string) => {
    if (!name.trim()) return "";
    return name.trim().split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Dynamic difficulties based on selected holes
  const getDifficulties = (holes: number) => {
    if (holes === 9) {
      return [
        { name: "Easy", strikes: 5 },
        { name: "Medium", strikes: 3 },
        { name: "Hard", strikes: 1 },
      ];
    } else { // 18 holes
      return [
        { name: "Easy", strikes: 9 },
        { name: "Medium", strikes: 6 },
        { name: "Hard", strikes: 3 },
      ];
    }
  };

  const difficulties = getDifficulties(selectedHoles);
  
  // Default to Easy difficulty
  const [selectedDifficulty, setSelectedDifficulty] = useState<{ name: string; strikes: number }>(difficulties[0]);

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, name } : player
    ));
  };

  const addPlayer = () => {
    if (players.length < 6) {
      // If user is logged in and has access token, show friend selection modal
      if (accessToken) {
        setShowFriendModal(true);
      } else {
        // If not logged in, just add empty player
        const newId = (Math.max(...players.map(p => parseInt(p.id))) + 1).toString();
        setPlayers([...players, { id: newId, name: "" }]);
      }
    }
  };

  const handleSelectFriend = (friend: { userId: string; name: string; profilePhotoUrl?: string }) => {
    if (players.length < 6) {
      const newId = (Math.max(...players.map(p => parseInt(p.id))) + 1).toString();
      setPlayers([...players, { 
        id: newId, 
        name: friend.name,
        avatarUrl: friend.profilePhotoUrl,
        friendId: friend.userId
      }]);
    }
  };

  const addManualPlayer = () => {
    if (players.length < 6) {
      const newId = (Math.max(...players.map(p => parseInt(p.id))) + 1).toString();
      setPlayers([...players, { id: newId, name: "" }]);
    }
  };

  const removePlayer = (id: string) => {
    if (players.length > 1) {
      setPlayers(players.filter(player => player.id !== id));
    }
  };

  const handleHolesChange = (holes: number) => {
    setSelectedHoles(holes);
    // Update difficulty to match new hole count, keeping the same difficulty level
    const newDifficulties = getDifficulties(holes);
    const currentDifficultyName = selectedDifficulty.name;
    const newDifficulty = newDifficulties.find(d => d.name === currentDifficultyName) || newDifficulties[0];
    setSelectedDifficulty(newDifficulty);
  };

  const handleStartGame = () => {
    const validPlayers = players.filter(player => player.name.trim() !== "");
    if (validPlayers.length < 1) {
      alert("Please enter a name for at least 1 player");
      return;
    }
    if (!selectedDifficulty) {
      alert("Please select a difficulty level");
      return;
    }
    
    // Validate teams mode
    if (gameMode === 'teams') {
      const teamsWithPlayers = teams.filter(t => t.playerIds.length > 0);
      if (teamsWithPlayers.length < 2) {
        alert("Please create at least 2 teams with players assigned");
        return;
      }
      
      // Check that all valid players are assigned to teams
      const assignedPlayerIds = new Set(teams.flatMap(t => t.playerIds));
      const unassignedPlayers = validPlayers.filter(p => !assignedPlayerIds.has(p.id));
      if (unassignedPlayers.length > 0) {
        alert(`Please assign all players to teams. Unassigned: ${unassignedPlayers.map(p => p.name).join(', ')}`);
        return;
      }
    }
    
    onStartGame(selectedDifficulty, validPlayers, selectedHoles, selectedCourse, gameMode, teams);
  };

  const handleGameModeChange = (mode: 'free-for-all' | 'teams') => {
    setGameMode(mode);
    // If switching to teams mode and no teams exist, create a default team
    if (mode === 'teams' && teams.length === 0) {
      setTeams([{ id: 'team-1', name: 'Team 1', playerIds: [] }]);
    }
  };

  // Check if there are any unassigned players with names
  const hasUnassignedPlayers = useMemo(() => {
    const assignedPlayerIds = new Set(teams.flatMap(t => t.playerIds));
    return players.some(p => p.name.trim() !== "" && !assignedPlayerIds.has(p.id));
  }, [players, teams]);

  // Check if game can start based on mode
  const canStartGame = useMemo(() => {
    const validPlayers = players.filter(player => player.name.trim() !== "");
    const validPlayerCount = validPlayers.length;
    
    if (validPlayerCount < 1 || !selectedDifficulty) return false;
    
    if (gameMode === 'teams') {
      const teamsWithPlayers = teams.filter(t => t.playerIds.length > 0);
      if (teamsWithPlayers.length < 2) return false;
      
      const assignedPlayerIds = new Set(teams.flatMap(t => t.playerIds));
      const allPlayersAssigned = validPlayers.every(p => assignedPlayerIds.has(p.id));
      
      return allPlayersAssigned;
    }
    
    return true;
  }, [players, selectedDifficulty, gameMode, teams]);

  return (
    <div className="bg-[#cee7bd] w-full min-h-screen flex flex-col items-center px-4 py-8 pb-[100px]" data-name="iPhone 16 Plus - 2">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-2 mb-[32px]">
        <h1 className="leading-[normal] not-italic text-[#282828] text-[32px] text-nowrap whitespace-pre">
          New game setup
        </h1>
        
        <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[#282828] text-[18px] text-center w-[382px] max-w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Add players and choose difficulty for your day of Hooky Golf.
        </p>
      </div>

      {/* Add Players Section */}
      <div className="flex flex-col items-center w-full max-w-[382px] mb-[32px]">
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic text-[#282828] text-[12px] text-center uppercase mb-[16px] w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Add Players
        </p>

        {/* Player input fields */}
        <div className="flex flex-col gap-[16px] w-full">
          {players.map((player, index) => (
            <div key={player.id} className="relative h-[40px] w-full">
            {/* Avatar - Show avatar for first player, current user and friends, initials for manual players */}
            {index === 0 || player.isCurrentUser || player.friendId ? (
              <div className="absolute left-0 top-0 w-[40px] h-[40px] rounded-[100px] overflow-hidden bg-[#517b34]">
                <Avatar className="w-full h-full">
                  <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                  <AvatarFallback className="bg-transparent">
                    <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="absolute bg-[#282828] box-border flex items-center justify-center left-0 overflow-clip rounded-[100px] top-0 w-[40px] h-[40px]">
                <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic text-[16px] text-white text-center" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {player.name.trim() ? getPlayerInitials(player.name) : index + 1}
                </p>
              </div>
            )}
            
            {/* Name display - plain text for first player (party leader), current user, and friends; input field for manual entry */}
            {index === 0 || player.isCurrentUser || player.friendId ? (
              <div className="absolute left-[56px] top-0 h-[40px] flex items-center">
                <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  {player.name}
                </p>
              </div>
            ) : (
              <div className="absolute bg-white left-[56px] top-0 w-[326px]">
                <div className="box-border content-stretch flex gap-[10px] items-center overflow-clip px-[16px] py-[10px] relative w-[326px]">
                  <input
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    placeholder={`Player ${index + 1} name`}
                    className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap whitespace-pre bg-transparent border-none outline-none w-full"
                    style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
                  />
                </div>
                <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
              </div>
            )}
            {players.length > 1 && index !== 0 && (
              <button
                onClick={() => removePlayer(player.id)}
                className="absolute right-0 top-0 w-[40px] h-[40px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="Remove player"
              >
                <div className="overflow-clip relative shrink-0 size-[24px]">
                  <IconOutlineXCircle />
                </div>
              </button>
            )}
            
            {/* Party Leader Badge - positioned on far right for first player */}
            {index === 0 && (
              <div className="absolute top-0 h-[40px] flex items-center right-0">
                <button 
                  type="button"
                  onClick={() => setShowLeaderInfoModal(true)}
                  className="flex items-center justify-center gap-[4px] bg-[#517b34] px-[10px] py-[6px] rounded-[100px] cursor-pointer touch-manipulation select-none active:scale-95 transition-transform relative z-10"
                  aria-label="Party leader information"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="font-['Geologica:Bold',_sans-serif] text-white text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    PARTY LEADER
                  </span>
                  <div className="size-[16px]">
                    <IconSolidInformationCircle />
                  </div>
                </button>
              </div>
            )}
          </div>
          ))}
        </div>

        {/* Add player button */}
        {players.length < 6 && (
          <div 
            className="relative bg-[#cee7bd] rounded-[100px] w-full cursor-pointer mt-[16px]"
            onClick={addPlayer}
          >
            <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] relative w-full">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/plus-circle">
                <IconOutlinePlusCircle />
              </div>
              <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="leading-[normal] whitespace-pre">Add player</p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
          </div>
        )}
      </div>

      {/* Team Management Section */}
      <div className="w-full max-w-[382px] mb-[32px]">
        <TeamManagementSection
          players={players}
          teams={teams}
          onTeamsChange={setTeams}
          gameMode={gameMode}
          onGameModeChange={handleGameModeChange}
        />
      </div>

      {/* Golf Course Section */}
      <div className="flex flex-col items-center w-full max-w-[382px] mb-[32px]">
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic text-[#282828] text-[12px] text-center uppercase mb-[16px] w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Select golf course (Optional)
        </p>

        {/* Course selection button */}
        <div 
          className="relative bg-[#cee7bd] rounded-[100px] w-full cursor-pointer hover:bg-[#b8d1a7] transition-colors"
          onClick={() => setShowCourseModal(true)}
        >
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] relative w-full">
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">
                {selectedCourse ? selectedCourse.name : "Choose course"}
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        </div>
      </div>

      {/* Course Length Section */}
      <div className="flex flex-col items-center w-full max-w-[382px] mb-[32px]">
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic text-[#282828] text-[12px] text-center uppercase mb-[16px] w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Select course length
        </p>
        
        {/* How many holes toggle */}
        <div className="relative h-[42px] rounded-[100px] w-full">
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
          
          {/* 9 holes button */}
          <div 
            className={`absolute box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-0 translate-x-[-50%] w-[191px] cursor-pointer transition-colors ${selectedHoles === 9 ? 'btn-primary' : ''}`} 
            style={{ left: "calc(50% - 95.5px)" }}
            onClick={() => handleHolesChange(9)}
          >
            <p className={`font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${selectedHoles === 9 ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              9 holes
            </p>
          </div>
          
          {/* 18 holes button */}
          <div 
            className={`absolute box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-0 translate-x-[-50%] w-[191px] cursor-pointer transition-colors ${selectedHoles === 18 ? 'btn-primary' : ''}`} 
            style={{ left: "calc(50% + 95.5px)" }}
            onClick={() => handleHolesChange(18)}
          >
            <p className={`font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#282828] text-[14px] text-nowrap whitespace-pre ${selectedHoles === 18 ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              18 holes
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty Section */}
      <div className="flex flex-col items-center w-full max-w-[382px] mb-[32px]">
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic text-[#282828] text-[12px] text-center uppercase mb-[16px] w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Select Difficulty
        </p>

        {/* Difficulty cards */}
        <div className="flex flex-col gap-[10px] w-full">
          {difficulties.map((difficulty) => {
            const isSelected = selectedDifficulty?.name === difficulty.name;
            
            return (
              <div 
                key={difficulty.name}
                className={`relative rounded-[16px] w-full cursor-pointer transition-colors ${isSelected ? 'btn-primary' : ''}`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] not-italic overflow-clip p-[24px] relative w-full">
                  <h3 className={`relative shrink-0 text-[14px] uppercase w-full text-center ${isSelected ? 'text-white' : 'text-[#282828]'}`}>
                    {difficulty.name}
                  </h3>
                  <p className={`font-['Geologica:Light',_sans-serif] font-light relative shrink-0 text-[16px] w-full text-center ${isSelected ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    {difficulty.strikes} strike{difficulty.strikes !== 1 ? 's' : ''} and your caught
                  </p>
                </div>
                <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[16px] ${isSelected ? 'border-[#517b34]' : 'border-[#517b34]'}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-[16px] w-full max-w-[382px]">
        {/* Start game button */}
        <div 
          className={`relative w-full ${canStartGame ? 'cursor-pointer btn-primary' : 'cursor-not-allowed bg-[#9bb885]'} box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px]`}
          onClick={canStartGame ? handleStartGame : undefined}
        >
          <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            <p className="leading-[normal] whitespace-pre">Start your Hooky Golf round</p>
          </div>
          <IconOutlineArrowSmRight />
        </div>

        {/* Return home button */}
        {onExitToHome && (
          <button
            onClick={onExitToHome}
            className="relative w-full box-border content-stretch flex gap-[10px] h-[42px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[100px] cursor-pointer border border-[#517b34] border-solid transition-all hover:bg-[#f8fafc]"
          >
            <IconOutlineHome />
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">Or, return home</p>
            </div>
          </button>
        )}
      </div>

      {/* Course Search Modal */}
      {showCourseModal && (
        <CourseSearchModal
          selectedCourse={selectedCourse}
          onSelectCourse={setSelectedCourse}
          onClose={() => setShowCourseModal(false)}
        />
      )}

      {/* Friend Select Modal */}
      {showFriendModal && accessToken && (
        <FriendSelectModal
          isOpen={showFriendModal}
          onClose={() => setShowFriendModal(false)}
          onSelectFriend={handleSelectFriend}
          onManualEntry={addManualPlayer}
          accessToken={accessToken}
          excludedFriendIds={players.filter(p => p.friendId).map(p => p.friendId!)}
        />
      )}

      {/* Party Leader Info Modal */}
      <AlertDialog open={showLeaderInfoModal} onOpenChange={setShowLeaderInfoModal}>
        <AlertDialogContent className="bg-[#cee7bd] border-[#517b34] max-w-[90%] rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-['Luckiest_Guy',_cursive] text-[24px] text-[#282828]">
              Party Leader
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="font-['Geologica:Regular',_sans-serif] text-[16px] text-[#282828] space-y-3" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="font-['Geologica:Bold',_sans-serif]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Responsibilities:
                </p>
                <div className="space-y-2">
                  <p>• Enters results for all players after each hole</p>
                  <p>• Manages the game flow and progression</p>
                  <p>• Leads the team through each boss encounter</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowLeaderInfoModal(false)}
              className="bg-[#517b34] hover:bg-[#456628] text-white font-['Geologica:Bold',_sans-serif]"
              style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
            >
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}