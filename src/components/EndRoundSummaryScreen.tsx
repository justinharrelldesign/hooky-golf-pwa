import svgPaths from "../imports/svg-aael66jt0f";
import svgPathsHome from "../imports/svg-zoxknpw915";
import { ConfettiBurst } from "./ConfettiBurst";
import Frame38 from "../imports/Frame38";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
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

interface EndRoundSummaryScreenProps {
  isVictory: boolean;
  failedAtHole?: number;
  players: Player[];
  bossResults: PlayerBossResult[];
  bosses: Boss[];
  skippedBosses: string[];
  difficulty?: { name: string; strikes: number };
  totalHoles?: number;
  onPlayAgain: () => void;
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

function getPlayerInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

export function EndRoundSummaryScreen({ isVictory, failedAtHole, players, bossResults, bosses, skippedBosses, difficulty, totalHoles, onPlayAgain }: EndRoundSummaryScreenProps) {
  const escapedPlayers = players.filter(p => !p.isCaught);
  const caughtPlayers = players.filter(p => p.isCaught);
  
  // Calculate individual XP for each player with difficulty and hole multipliers
  const playerXPs = players.map(player => ({
    playerId: player.id,
    xp: calculatePlayerXP(
      isVictory,
      player.isCaught || false,
      player.strikes,
      difficulty?.name || 'Easy',
      totalHoles || 9
    )
  }));

  return (
    <div className="bg-[#cee7bd] relative size-full min-h-screen flex flex-col items-center py-[24px]" data-name="iPhone 16 Plus - 15">
      <div className="box-border content-stretch flex flex-col gap-[24px] items-center px-[16px] py-[24px] rounded-[32px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        {/* Beer Mug Image */}
        <div className="h-[169px] relative shrink-0 w-[184px]">
          <div className="absolute h-[169px] left-0 top-0 w-[184px]" data-name="Rectangle">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[108.88%] left-0 max-w-none top-[-3.55%] w-full" src={imgRectangle} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="h-[24px] relative shrink-0 w-[232px]">
          <div className="absolute content-stretch flex flex-col items-start left-[0.5px] top-0">
            <h2 className="leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">Round complete!</h2>
          </div>
        </div>

        {/* Results Container */}
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[350px]">
          
          {/* Hooky Heroes Section */}
          {escapedPlayers.length > 0 && (
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
                <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-[350px]">
                  <h1 className="leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px] whitespace-nowrap">Hooky heroes</h1>
                </div>
                <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Escaped the grind and made it to glory.
                </p>
              </div>

              {escapedPlayers.map((player, index) => {
                const playerXP = playerXPs.find(p => p.playerId === player.id)?.xp || 0;
                return (
                  <div key={player.id} className={`box-border content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-0 px-0 relative shrink-0 ${index < escapedPlayers.length - 1 ? 'border-b border-[#517b34]' : ''}`}>
                    <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-[350px]">
                      {player.isCurrentUser || player.friendId ? (
                        <div className="w-[40px] h-[40px] rounded-[100px] overflow-visible relative">
                          <ConfettiBurst particleCount={12} />
                          <div className="w-full h-full rounded-[100px] overflow-hidden bg-[#f97316] z-10 relative">
                            <Avatar className="w-full h-full">
                              <AvatarImage src={player.avatarUrl} alt={player.name} />
                              <AvatarFallback className="bg-[#517b34] text-white text-[24px]">
                                {player.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-[#517b34] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-visible px-[16px] py-[10px] relative rounded-[100px] shrink-0 w-[40px]">
                          <ConfettiBurst particleCount={12} />
                          <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full z-10" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            {getPlayerInitials(player.name)}
                          </p>
                        </div>
                      )}
                      <div className="absolute content-stretch flex font-['Geologica:Light',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] left-[56px] not-italic overflow-clip text-[#282828] text-[16px] top-0 w-[294px]">
                        <p className="basis-0 grow min-h-px min-w-px relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {player.name}
                        </p>
                        <p className="relative shrink-0 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          Strikes: {player.strikes}/{player.maxStrikes}
                        </p>
                      </div>
                    </div>
                    
                    {/* Individual XP Display */}
                    {playerXP > 0 && (
                      <div className="w-full flex items-center justify-center gap-[8px] px-[12px] py-[6px] rounded-[12px] bg-[#517b34]/10 border border-[#517b34]">
                        <p className="luckiest-guy text-[#517b34] text-[18px]">+{playerXP} XP</p>
                        {player.strikes === 0 && (
                          <p className="font-['Geologica:Regular',_sans-serif] text-[#282828] text-[12px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                            🏆 Perfect!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Back to the Office Section */}
          {caughtPlayers.length > 0 && (
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
                <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0 w-[350px]">
                  <h1 className="leading-[normal] not-italic relative shrink-0 text-[#282828] text-[32px] whitespace-nowrap">Back to the office</h1>
                </div>
                <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] text-center w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                  Cubicle captives with no escape.
                </p>
              </div>

              {caughtPlayers.map((player, index) => (
                <div key={player.id} className={`box-border content-stretch flex flex-col gap-[10px] items-start pb-[16px] pt-0 px-0 relative shrink-0 ${index < caughtPlayers.length - 1 ? 'border-b border-[#517b34]' : ''}`}>
                  <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-[350px]">
                    {player.isCurrentUser || player.friendId ? (
                      <div className="w-[40px] h-[40px] rounded-[100px] overflow-hidden bg-[#C43C3C]">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={player.avatarUrl} alt={player.name} />
                          <AvatarFallback className="bg-[#517b34] text-white text-[16px]">
                            {player.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className="bg-[#c43c3c] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[100px] shrink-0 w-[40px]">
                        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {getPlayerInitials(player.name)}
                        </p>
                      </div>
                    )}
                    <div className="absolute content-stretch flex font-['Geologica:Light',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] left-[56px] not-italic overflow-clip text-[#282828] text-[16px] top-0 w-[294px]">
                      <p className="basis-0 grow min-h-px min-w-px relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {player.name}
                      </p>
                      <p className="relative shrink-0 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        Strikes: {player.strikes}/{player.maxStrikes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons with 16px gap */}
        <div className="flex flex-col gap-[16px] items-center w-[350px] shrink-0">
          {/* Play Again Button */}
          <div 
            onClick={onPlayAgain}
            className="btn-primary box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] w-full cursor-pointer"
          >
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">Play again</p>
            </div>
            <IconOutlineArrowSmRight />
          </div>

          {/* Return home button */}
          <button
            onClick={onPlayAgain}
            className="box-border content-stretch flex gap-[10px] h-[42px] items-center justify-center overflow-clip px-[24px] py-[10px] relative rounded-[100px] w-full cursor-pointer border border-[#517b34] border-solid transition-all hover:bg-[#f8fafc]"
          >
            <IconOutlineHome />
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">Or, return home</p>
            </div>
          </button>
        </div>
      </div>

      {/* Shop Hooky Golf Section */}
      <div className="w-[343px] h-[320px] mt-[24px] cursor-pointer">
        <Frame38 />
      </div>
    </div>
  );
}