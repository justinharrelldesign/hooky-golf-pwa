import { useState } from "react";
import svgPaths from "../imports/svg-3hdjoh0g6o";
import svgPathsXCircle from "../imports/svg-91t1riqmn2";
import svgPathsHome from "../imports/svg-zoxknpw915";
import svgPathsInfo from "../imports/svg-vqe4wdakee";
import { CourseSearchModal } from "./CourseSearchModal";
import { FriendSelectModal } from "./FriendSelectModal";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

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

interface GameSetupScreenProps {
  onStartGame: (difficulty: { name: string; strikes: number }, players: Player[], holes: number, course?: Course | null) => void;
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
    onStartGame(selectedDifficulty, validPlayers, selectedHoles, selectedCourse);
  };

  const validPlayerCount = players.filter(player => player.name.trim() !== "").length;
  const canStartGame = validPlayerCount >= 1 && selectedDifficulty;

  // Calculate minimum height based on button position plus spacing
  // Return home button is at 908 + player offset, has 42px height, need extra space below
  const returnHomeButtonTop = 908 + ((Math.max(0, players.length - 1)) * 56);
  const minHeight = returnHomeButtonTop + 42 + 200; // button position + button height + 200px bottom spacing

  return (
    <div className="bg-[#cee7bd] relative w-full min-h-screen pb-[200px]" style={{ minHeight: `${minHeight}px` }} data-name="iPhone 16 Plus - 2">
      <h1 className="absolute leading-[normal] not-italic text-[#282828] text-[32px] text-nowrap top-[32px] whitespace-pre" style={{ left: "calc(50% - 131px)" }}>
        New game setup
      </h1>
      
      <p className="absolute font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] left-1/2 not-italic text-[#282828] text-[18px] text-center top-[72px] translate-x-[-50%] w-[382px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Add players and choose difficulty for your day of Hooky Golf.
      </p>

      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center top-[150px] translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Add Players
      </p>

      {/* Player input fields */}
      {players.map((player, index) => (
        <div key={player.id} className="absolute h-[40px] left-1/2 translate-x-[-50%] w-[382px]" style={{ top: `${181 + (index * 56)}px` }}>
          {/* Avatar - Show avatar for current user and friends, initials for manual players */}
          {player.isCurrentUser || player.friendId ? (
            <div className="absolute left-0 top-0 w-[40px] h-[40px] rounded-[100px] overflow-hidden bg-[#517b34]">
              <Avatar className="w-full h-full">
                {player.avatarUrl && (
                  <AvatarImage 
                    src={player.avatarUrl} 
                    alt={player.name}
                    onError={(e) => {
                      // Hide broken image on error
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <AvatarFallback className="bg-[#517b34] text-white text-[16px]">
                  {player.name.charAt(0).toUpperCase()}
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
          
          {/* Name display - plain text for current user and friends, input field for manual entry */}
          {player.isCurrentUser ? (
            <div className="absolute left-[56px] top-0 h-[40px] flex items-center">
              <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                {player.name}
              </p>
            </div>
          ) : player.friendId ? (
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
          {players.length > 1 && !player.isCurrentUser && (
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
          
          {/* Party Leader Badge - positioned on far right */}
          {index === 0 && (
            <div className={`absolute top-0 h-[40px] flex items-center ${players.length > 1 && !player.isCurrentUser ? 'right-[48px]' : 'right-0'}`}>
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

      {/* Add player button */}
      {players.length < 6 && (
        <div 
          className="absolute bg-[#cee7bd] left-1/2 rounded-[100px] translate-x-[-50%] w-[382px] cursor-pointer"
          style={{ top: `${237 + ((players.length - 1) * 56)}px` }}
          onClick={addPlayer}
        >
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] relative w-[382px]">
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

      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0", top: `${317 + ((Math.max(0, players.length - 1)) * 56)}px` }}>
        Select golf course (Optional)
      </p>

      {/* Course selection button */}
      <div 
        className="absolute bg-[#cee7bd] left-1/2 rounded-[100px] translate-x-[-50%] w-[382px] cursor-pointer hover:bg-[#b8d1a7] transition-colors"
        style={{ top: `${348 + ((Math.max(0, players.length - 1)) * 56)}px` }}
        onClick={() => setShowCourseModal(true)}
      >
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] relative w-[382px]">
          <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[#517b34] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            <p className="leading-[normal] whitespace-pre">
              {selectedCourse ? selectedCourse.name : "Choose course"}
            </p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
      </div>

      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0", top: `${422 + ((Math.max(0, players.length - 1)) * 56)}px` }}>
        Select course length
      </p>
      
      {/* How many holes toggle */}
      <div className="absolute h-[42px] left-1/2 rounded-[100px] translate-x-[-50%] w-[382px]" style={{ top: `${453 + ((Math.max(0, players.length - 1)) * 56)}px` }}>
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

      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0", top: `${527 + ((Math.max(0, players.length - 1)) * 56)}px` }}>
        Select Difficulty
      </p>

      {/* Difficulty cards */}
      {difficulties.map((difficulty, index) => {
        const topPosition = 558 + ((Math.max(0, players.length - 1)) * 56) + (index * 94);
        const isSelected = selectedDifficulty?.name === difficulty.name;
        
        return (
          <div 
            key={difficulty.name}
            className={`absolute left-1/2 translate-x-[-50%] rounded-[16px] w-[382px] cursor-pointer transition-colors ${isSelected ? 'btn-primary' : ''}`}
            style={{ top: `${topPosition}px` }}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            <div className="box-border content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] not-italic overflow-clip p-[24px] relative w-[382px]">
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

      {/* Start game button */}
      <div 
        className={`absolute left-1/2 translate-x-[-50%] w-[382px] ${canStartGame ? 'cursor-pointer btn-primary' : 'cursor-not-allowed bg-[#9bb885]'} box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px]`}
        style={{ top: `${868 + ((Math.max(0, players.length - 1)) * 56)}px` }}
        onClick={canStartGame ? handleStartGame : undefined}
      >
        <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p className="leading-[normal] whitespace-pre">Start your Hooky Golf round</p>
        </div>
        <IconOutlineArrowSmRight />
      </div>

      {/* Return home button - 16px below the Start button */}
      {onExitToHome && (
        <button
          onClick={onExitToHome}
          className="absolute left-1/2 translate-x-[-50%] w-[382px] box-border content-stretch flex gap-[10px] h-[42px] items-center justify-center overflow-clip px-[24px] py-[10px] rounded-[100px] cursor-pointer border border-[#517b34] border-solid transition-all hover:bg-[#f8fafc]"
          style={{ top: `${932 + ((Math.max(0, players.length - 1)) * 56)}px` }}
        >
          <IconOutlineHome />
          <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            <p className="leading-[normal] whitespace-pre">Or, return home</p>
          </div>
        </button>
      )}

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