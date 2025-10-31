import { useEffect } from "react";
import { motion } from "motion/react";
import svgPaths from "../imports/svg-rn5lzjdsev";
import svgPathsHome from "../imports/svg-zoxknpw915";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";
import imgBossesIllustration from "figma:asset/99fe0dd55feba6e2153c6425f78487a2312d27f9.png";

interface Player {
  id: string;
  name: string;
  strikes: number;
  maxStrikes: number;
  isCaught?: boolean;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  friendId?: string;
}

interface Team {
  id: string;
  name: string;
  playerIds: string[];
  strikes?: number;
  maxStrikes?: number;
  isCaught?: boolean;
}

interface PlayerCaughtScreenProps {
  caughtPlayers: Player[];
  allPlayersCaught?: boolean;
  onContinue: () => void;
  onPlayAgain?: () => void;
  onReturnHome?: () => void;
  gameMode?: 'free-for-all' | 'teams';
  caughtTeams?: Team[];
  teams?: Team[];
  players?: Player[];
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

function IconOutlineUserGroup() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/user-group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M1 13c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2ZM13 13c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2ZM7 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM17 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" stroke="var(--stroke-0, #FFFFFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}

export function PlayerCaughtScreen({ 
  caughtPlayers, 
  allPlayersCaught = false, 
  onContinue, 
  onPlayAgain, 
  onReturnHome,
  gameMode = 'free-for-all',
  caughtTeams = [],
  teams = [],
  players = []
}: PlayerCaughtScreenProps) {
  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPlayerById = (playerId: string) => {
    return players.find(p => p.id === playerId);
  };

  const isPlural = gameMode === 'teams' ? caughtTeams.length > 1 : caughtPlayers.length > 1;

  const handleButtonClick = () => {
    if (allPlayersCaught && onPlayAgain) {
      onPlayAgain();
    } else {
      onContinue();
    }
  };

  return (
    <div className="bg-[#cee7bd] relative size-full min-h-screen flex flex-col items-center py-[24px]" data-name="iPhone 16 Plus - 16">
      <div className="box-border content-stretch flex flex-col gap-[8px] items-center pb-0 pt-[24px] px-[16px] rounded-[32px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        {/* Content Section */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[350px]">
          {/* Header Text */}
          <div className="content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic relative shrink-0 text-[#282828] text-center w-full">
            <h1 className="relative shrink-0 text-[32px]" style={{ width: "min-content", minWidth: "100%" }}>
              {gameMode === 'teams' 
                ? (allPlayersCaught ? "All Teams have been caught!" : (isPlural ? "Teams caught!" : "Team caught!"))
                : (allPlayersCaught ? "All Players have been caught!" : (isPlural ? "Players caught!" : "Player caught!"))}
            </h1>
            <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Back to the office they go. Better luck next time...
            </p>
          </div>
          
          {/* Caught Players/Teams List */}
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
            {gameMode === 'teams' ? (
              // Team Mode
              caughtTeams.map((team, index) => (
                <div key={team.id} className="w-full">
                  {index > 0 && (
                    <div className="box-border pb-[16px] relative w-full">
                      <div aria-hidden="true" className="border-[#517b34] border-[0px_0px_1px] border-solid w-full h-[1px]" />
                    </div>
                  )}
                  <div className="w-full flex flex-col gap-[8px]">
                    {/* Team Name and Strikes */}
                    <div className="w-full flex items-center justify-between">
                      <p className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {team.name}
                      </p>
                      <p className="font-['Geologica:Light',_sans-serif] font-light text-[#C43C3C] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Strikes: {team.strikes}/{team.maxStrikes}
                      </p>
                    </div>
                    {/* Team Members */}
                    <div className="flex flex-col gap-[4px]">
                      {team.playerIds.map((playerId) => {
                        const player = getPlayerById(playerId);
                        if (!player) return null;
                        
                        return (
                          <div key={playerId} className="flex items-center">
                            {player.isCurrentUser || player.friendId ? (
                              <div className="w-[20px] h-[20px] rounded-[100px] overflow-hidden bg-[#517b34] mr-[8px]">
                                <Avatar className="w-full h-full">
                                  <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                                  <AvatarFallback className="bg-transparent">
                                    <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            ) : (
                              <div className="bg-[#517b34] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[4px] py-[2px] relative rounded-[100px] shrink-0 w-[20px] h-[20px] mr-[8px]">
                                <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[8px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                                  {getPlayerInitials(player.name)}
                                </p>
                              </div>
                            )}
                            <p className="font-['Geologica:Light',_sans-serif] font-light text-[#282828] text-[14px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                              {player.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Free-for-all Mode
              caughtPlayers.map((player, index) => (
              <div key={player.id} className="w-full">
                {index > 0 && (
                  <div className="box-border pb-[16px] relative w-full">
                    <div aria-hidden="true" className="border-[#517b34] border-[0px_0px_1px] border-solid w-full h-[1px]" />
                  </div>
                )}
                <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
                  {player.isCurrentUser || player.friendId ? (
                    <div className="w-[40px] h-[40px] rounded-[100px] overflow-hidden bg-[#C43C3C]">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                        <AvatarFallback className="bg-transparent">
                          <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div className="bg-[#C43C3C] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[100px] shrink-0 w-[40px]">
                      <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {getPlayerInitials(player.name)}
                      </p>
                    </div>
                  )}
                  <div className="ml-[16px] content-stretch flex font-['Geologica:Light',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] not-italic text-[#282828] text-[16px] flex-1">
                    <p className="basis-0 grow min-h-px min-w-px relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      {player.name}
                    </p>
                    <p className="relative shrink-0 text-nowrap whitespace-pre text-[#C43C3C]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      Strikes: {player.strikes}/{player.maxStrikes}
                    </p>
                  </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Buttons with 16px gap */}
        <div className="flex flex-col gap-[16px] items-center w-[350px] shrink-0 mt-[16px]">
          {/* Primary Action Button */}
          <div className="box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] w-full cursor-pointer btn-primary" onClick={handleButtonClick}>
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">{allPlayersCaught ? "Play again" : "Continue round"}</p>
            </div>
            <IconOutlineArrowSmRight />
          </div>

          {/* Return home button - only show when all players are caught */}
          {allPlayersCaught && onReturnHome && (
            <button
              onClick={onReturnHome}
              className="box-border content-stretch flex gap-[10px] h-[42px] items-center justify-center overflow-clip px-[24px] py-[10px] relative rounded-[100px] w-full cursor-pointer border border-[#517b34] border-solid transition-all hover:bg-[#f8fafc]"
            >
              <IconOutlineHome />
              <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="leading-[normal] whitespace-pre">Or, return home</p>
              </div>
            </button>
          )}
        </div>
        
        {/* Boss Illustration */}
        <motion.div 
          className="h-[513px] relative shrink-0 w-[342px]"
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.15, 0.95, 1.05, 1]
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.4, 0.6, 0.8, 1],
            ease: "easeOut"
          }}
        >
          <div className="h-[513px] w-[342px]" data-name="Bosses Illustration">
            <img alt="Caught by the bosses" className="inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgBossesIllustration} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}