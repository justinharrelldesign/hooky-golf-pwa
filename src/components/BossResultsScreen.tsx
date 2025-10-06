import { useState } from "react";
import svgPaths from "../imports/svg-cix37t044t";
import svgPathsInfo from "../imports/svg-vqe4wdakee";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import defaultAvatarImg from "figma:asset/6ee3186278c9cc7ba61d44c3a4ce6717ab8d7e8b.png";

function IconOutlineCheckCircle({ isSelected }: { isSelected: boolean }) {
  return (
    <div className="relative size-full" data-name="Icon/Outline/check-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.pec9e000} id="Icon" stroke={isSelected ? "var(--stroke-0, #FFFFFF)" : "var(--stroke-0, #517B34)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineXCircle({ isSelected }: { isSelected: boolean }) {
  return (
    <div className="relative size-full" data-name="Icon/Outline/x-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p3f4d7080} id="Icon" stroke={isSelected ? "var(--stroke-0, #FFFFFF)" : "var(--stroke-0, #C43C3C)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineFlag() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Outline/flag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Outline/flag">
          <path d={svgPaths.p3b2f49c0} id="Icon" stroke="var(--stroke-0, #111827)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
          <path d={svgPaths.p22f0df80} id="Icon" stroke="var(--stroke-0, #FEFFFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

interface Boss {
  name: string;
  challenge: string;
  quote: string;
  avatar: string;
  backgroundColor: string;
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

interface PlayerResult {
  playerId: string;
  success: boolean | null;
}

interface BossResultsScreenProps {
  hole: number;
  boss: Boss;
  players: Player[];
  onSubmitResults: (results: PlayerResult[]) => void;
  onExitRound: () => void;
}

export function BossResultsScreen({ hole, boss, players, onSubmitResults, onExitRound }: BossResultsScreenProps) {
  // Only initialize results for players who are not caught
  const [results, setResults] = useState<PlayerResult[]>(
    players.map(player => ({ 
      playerId: player.id, 
      success: player.isCaught === true ? null : null // Will be set to null for caught players too, but they won't be editable
    }))
  );

  const getPlayerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const updateResult = (playerId: string, success: boolean) => {
    setResults(prev => 
      prev.map(result => 
        result.playerId === playerId 
          ? { ...result, success }
          : result
      )
    );
  };

  // Only check if results are set for active players (not caught)
  const activeResults = results.filter((result, index) => players[index].isCaught !== true);
  const allResultsSet = activeResults.every(result => result.success !== null);

  const handleSubmit = () => {
    if (allResultsSet) {
      onSubmitResults(results);
    }
  };

  return (
    <div className="bg-[#cee7bd] relative size-full min-h-screen flex flex-col items-center py-[24px]" data-name="iPhone 16 Plus - 4">
      <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[16px] py-[24px] rounded-[32px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        {/* Flag Icon */}
        <IconOutlineFlag />
        
        {/* Hole Number */}
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[12px] text-center uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Hole {hole}
        </p>
        
        {/* Boss Name */}
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <h2 className="leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">{boss.name}</h2>
        </div>
        
        {/* Challenge Section */}
        <div className="box-border content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic pb-0 pt-[16px] px-0 relative shrink-0 text-[#282828] text-center">
          <p className="font-['Geologica:Bold',_sans-serif] font-bold relative shrink-0 text-[12px] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Challenge
          </p>
          <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            {boss.challenge}
          </p>
        </div>
        


        {/* Players List */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          {players.map((player, index) => {
            const playerResult = results.find(r => r.playerId === player.id);
            const isSuccess = playerResult?.success === true;
            const isFail = playerResult?.success === false;
            const isCaught = player.isCaught === true;
            const isFirst = index === 0;
            const isLast = index === players.length - 1;
            const needsSeparator = !isFirst;
            
            return (
              <div key={player.id} className="w-full">
                {needsSeparator && (
                  <div className="w-full py-[12px]">
                    <div className="w-full h-[1px] bg-[#517b34]" />
                     </div>
                  )}
                
                <div className="w-full py-[12px] flex flex-col gap-[16px]">
                  {/* Player Info */}
                  <div className="w-full flex items-center h-[40px]">
                    {player.isCurrentUser || player.friendId ? (
                      <div className={`w-[40px] h-[40px] rounded-[100px] overflow-hidden ${isCaught ? 'bg-[#C43C3C]' : 'bg-[#517b34]'}`}>
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
                          <AvatarFallback className={`${isCaught ? 'bg-[#C43C3C]' : 'bg-[#517b34]'} text-white text-[16px]`}>
                            {player.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <div className={`${isCaught ? 'btn-danger' : 'bg-[#282828]'} box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[100px] shrink-0 w-[40px]`}>
                        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          {getPlayerInitials(player.name)}
                        </p>
                      </div>
                    )}
                    <div className="ml-[16px] content-stretch flex font-['Geologica:Light',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] not-italic text-[#282828] text-[16px] flex-1">
                      <p className="basis-0 grow min-h-px min-w-px relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {player.name}
                      </p>
                      <p className="relative shrink-0 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                        {isCaught ? <span className="text-[#C43C3C]">CAUGHT</span> : `Strikes: ${player.strikes}/${player.maxStrikes}`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Success/Failure Buttons - Only show for active players */}
                  {!isCaught && (
                    <div className="w-full flex gap-[16px]">
                  {/* Success Button */}
                  <div 
                    className={`basis-0 grow h-[48px] min-h-px min-w-px relative rounded-[100px] shrink-0 cursor-pointer ${isSuccess ? 'btn-primary' : ''}`}
                    onClick={() => updateResult(player.id, true)}
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
                      <div className="box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[39px] py-[12px] relative w-full">
                        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/check-circle">
                          <IconOutlineCheckCircle isSelected={isSuccess} />
                        </div>
                        <div className={`flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap ${isSuccess ? 'text-white' : 'text-[#517b34]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          <p className="leading-[normal] whitespace-pre">Success</p>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
                  </div>
                  
                  {/* Failure Button */}
                  <div 
                    className={`basis-0 grow h-[48px] min-h-px min-w-px relative rounded-[100px] shrink-0 cursor-pointer ${isFail ? 'btn-danger' : ''}`}
                    onClick={() => updateResult(player.id, false)}
                  >
                    <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
                      <div className="box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[39px] py-[12px] relative w-full">
                        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/x-circle">
                          <IconOutlineXCircle isSelected={isFail} />
                        </div>
                        <div className={`flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap ${isFail ? 'text-white' : 'text-[#c43c3c]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                          <p className="leading-[normal] whitespace-pre">Failure</p>
                        </div>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#c43c3c] border-solid inset-0 pointer-events-none rounded-[100px]" />
                  </div>
                </div>
                )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Continue Button */}
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start pb-0 pt-[16px] px-0 relative shrink-0">
          <div 
            className={`box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-[350px] cursor-pointer transition-opacity ${allResultsSet ? 'btn-primary' : 'btn-primary opacity-50 cursor-not-allowed'}`}
            onClick={handleSubmit}
          >
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">Enter results</p>
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