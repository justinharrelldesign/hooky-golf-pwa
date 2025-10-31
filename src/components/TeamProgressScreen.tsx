import svgPaths from "../imports/svg-guajbwnnma";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";

function IconOutlineUserGroup() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/user-group">
      <div className="absolute inset-[16.67%_8.33%]" data-name="Icon">
        <div className="absolute inset-[-6.25%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 18">
            <path d={svgPaths.p33b4a740} id="Icon" stroke="var(--stroke-0, #111827)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

interface Boss {
  name: string;
  challenge: string;
  quote: string;
  avatar: string;
  backgroundColor: string;
}

interface PlayerBossResult {
  playerId: string;
  hole: number;
  bossName: string;
  success: boolean;
}

interface TeamBossResult {
  teamId: string;
  hole: number;
  bossName: string;
  success: boolean;
}

interface TeamProgressScreenProps {
  players: Player[];
  bossResults: PlayerBossResult[];
  bosses: Boss[];
  currentHole: number;
  totalHoles: number;
  onContinue: () => void;
  onExitRound: () => void;
  gameMode?: 'free-for-all' | 'teams';
  teams?: Team[];
  teamBossResults?: TeamBossResult[];
}

export function TeamProgressScreen({ players, bossResults, bosses, currentHole, totalHoles, onContinue, onExitRound, gameMode = 'free-for-all', teams = [], teamBossResults = [] }: TeamProgressScreenProps) {
  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const completedHoles = currentHole;
  
  // Different counts for team vs individual mode
  const caughtCount = gameMode === 'teams' 
    ? teams.filter(team => team.isCaught === true).length
    : players.filter(player => player.isCaught === true).length;
  
  const stillPlayingCount = gameMode === 'teams' 
    ? teams.length - caughtCount
    : players.length - caughtCount;

  // Helper function to get player by ID
  const getPlayerById = (playerId: string) => {
    return players.find(p => p.id === playerId);
  };

  return (
    <div className="bg-[#cee7bd] relative size-full min-h-screen flex flex-col items-center py-[24px]" data-name="iPhone 16 Plus - 5">
      <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center px-[16px] py-[24px] rounded-[32px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        {/* User Group Icon */}
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/user-group">
          <IconOutlineUserGroup />
        </div>
        
        {/* Title and Progress */}
        <div className="h-[55px] relative shrink-0 w-[382px]">
          <div className="absolute content-stretch flex flex-col items-start left-[75.5px] top-0">
            <h2 className="leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">Hooky round status</h2>
          </div>
          <p className="absolute font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] left-[191px] not-italic text-[#282828] text-[18px] text-center top-[32px] translate-x-[-50%] w-[382px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Hole {completedHoles} of {totalHoles} completed
          </p>
        </div>
        
        {/* Game Status Alert */}
        {caughtCount > 0 && stillPlayingCount > 0 && (
          <div className="btn-danger box-border content-stretch flex items-center justify-center px-[16px] py-[12px] relative shrink-0 w-full">
            <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic text-[14px] text-center text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {caughtCount} {gameMode === 'teams' ? 'team' : 'player'}{caughtCount > 1 ? 's' : ''} caught! {stillPlayingCount} still playing.
            </p>
          </div>
        )}
        
        {/* Players/Teams List */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          {gameMode === 'teams' ? (
            // Team Mode - Show teams with members
            teams.map((team, index) => {
              const isFirst = index === 0;
              const needsSeparator = !isFirst;
              
              return (
                <div key={team.id} className="w-full">
                  {needsSeparator && (
                    <div className="w-full py-[12px]">
                      <div className="w-full h-[1px] bg-[#517b34]" />
                    </div>
                  )}
                  
                  <div className="w-full py-[12px]">
                    {/* Team Name and Strikes */}
                    <div className="w-full flex items-center justify-between mb-[8px]">
                      <p className="font-['Geologica:Bold',_sans-serif] font-bold text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {team.name}
                      </p>
                      <p className="font-['Geologica:Light',_sans-serif] font-light text-[#282828] text-[16px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {team.isCaught === true ? <span className="text-[#C43C3C]">CAUGHT</span> : `Strikes: ${team.strikes}/${team.maxStrikes}`}
                      </p>
                    </div>
                    
                    {/* Team Members */}
                    <div className="flex flex-col gap-[4px]">
                      {team.playerIds.map((playerId) => {
                        const player = getPlayerById(playerId);
                        if (!player) return null;
                        
                        return (
                          <div key={playerId} className="flex items-center">
                            {/* Small member avatar */}
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
              );
            })
          ) : (
            // Free-for-all Mode - Show individual players
            players.map((player, index) => {
              const isFirst = index === 0;
              const needsSeparator = !isFirst;
              
              return (
                <div key={player.id} className="w-full">
                  {needsSeparator && (
                    <div className="w-full py-[12px]">
                      <div className="w-full h-[1px] bg-[#517b34]" />
                    </div>
                  )}
                  
                  <div className="w-full py-[12px] flex items-center h-[40px]">
                    {/* Player Avatar */}
                    {player.isCurrentUser || player.friendId ? (
                      <div className={`w-[40px] h-[40px] rounded-[100px] overflow-hidden ${player.isCaught === true ? 'bg-[#C43C3C]' : 'bg-[#517b34]'}`}>
                        <Avatar className="w-full h-full">
                          <AvatarImage src={player.avatarUrl || defaultAvatarImg} alt={player.name} />
                          <AvatarFallback className="bg-transparent">
                            <img src={defaultAvatarImg} alt="Default avatar" className="w-full h-full object-cover" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className={`${player.isCaught === true ? 'bg-[#C43C3C]' : 'bg-[#517b34]'} box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[100px] shrink-0 w-[40px] h-[40px]`}>
                        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {getPlayerInitials(player.name)}
                        </p>
                      </div>
                    )}
                    
                    {/* Player Info */}
                    <div className="ml-[16px] content-stretch flex font-['Geologica:Light',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] not-italic text-[#282828] text-[16px] flex-1">
                      <p className="basis-0 grow min-h-px min-w-px relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {player.name}
                      </p>
                      <p className="relative shrink-0 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {player.isCaught === true ? <span className="text-[#C43C3C]">CAUGHT</span> : `Strikes: ${player.strikes}/${player.maxStrikes}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Continue Button */}
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-0 pt-[16px] px-0 relative shrink-0">
          <div 
            className="btn-primary box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-[350px] cursor-pointer"
            onClick={onContinue}
          >
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">
                {currentHole >= totalHoles ? 'Finish Round' : `Continue to hole ${currentHole + 1}`}
              </p>
            </div>
            <IconOutlineArrowSmRight />
          </div>
        </div>
      </div>
      
      {/* Exit Round Link - Below Card */}
      <div className="mt-[24px] px-[24px]">
        <button
          onClick={onExitRound}
          className="w-full text-center font-['Geologica:Regular',_sans-serif] font-normal text-[14px] text-[#646464] underline cursor-pointer"
          style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}
        >
          Exit Round
        </button>
      </div>
    </div>
  );
}