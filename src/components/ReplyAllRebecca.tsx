import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-7at7zhgs51";
import imgReplyAllRebecca from "figma:asset/1d0b13e3e884f69508ae1819b92e7061b4df5a6b.png";

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

interface ReplyAllRebeccaProps {
  hole: number;
  onContinue: () => void;
  onExitRound: () => void;
}

export function ReplyAllRebecca({ hole, onContinue, onExitRound }: ReplyAllRebeccaProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start the flip animation after a brief delay
    const flipTimer = setTimeout(() => {
      setIsFlipped(true);
    }, 200);

    // Show the actual content after the flip completes
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Show flip animation first
  if (!showContent) {
    return (
      <div className="bg-[#cee7bd] relative size-full min-h-screen">
        <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-1/2 -translate-x-1/2 px-[16px] py-[24px] rounded-[32px] top-[24px] w-[382px]">
          <div className={`boss-card-flip w-[350px] h-[600px] ${isFlipped ? 'flipped' : ''}`}>
            <div className="boss-card-inner">
              {/* Back of card - blank */}
              <div className="boss-card-back"></div>
              
              {/* Front of card - blank */}
              <div className="boss-card-front"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#cee7bd] relative size-full min-h-screen flex flex-col items-center py-[24px]" data-name="iPhone 16 Plus - 10">
      <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[16px] py-[24px] rounded-[32px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
        <IconOutlineFlag />
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[12px] text-center uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Hole {hole}
        </p>
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <p className="font-['Luckiest_Guy:Regular',_sans-serif] leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">Reply-all Rebecca</p>
        </div>
        <div className="content-stretch flex gap-[10px] h-[308px] items-end justify-center relative shrink-0">
          <div className="h-[303px] relative shrink-0 w-[202px]" data-name="ChatGPT Image Sep 26, 2025 at 04_01_29 PM 1">
            <img alt="Reply-All Rebecca illustration" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgReplyAllRebecca} />
          </div>
        </div>
        <div className="box-border content-stretch flex flex-col items-start pb-[16px] pt-0 px-0 relative shrink-0 w-full">
          <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
          <p className="font-['Luckiest_Guy:Regular',_sans-serif] leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-full">"I was about to Reply-All to the potluck invite saying I'd bring my famous egg salad… instead, I'll tell everyone about your little golf outing!"</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
          <div className="box-border content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic pb-0 pt-[16px] px-0 relative shrink-0 text-[#282828] text-center">
            <p className="font-['Geologica:Bold',_sans-serif] font-bold relative shrink-0 text-[12px] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Challenge
            </p>
            <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Putt as clueless as Rebecca. Make one putt with your eyes closed and make bogey or better.
            </p>
          </div>
          <button 
            onClick={onContinue}
            className="btn-primary box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]"
          >
            <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              <p className="leading-[normal] whitespace-pre">Enter results</p>
            </div>
            <IconOutlineArrowSmRight />
          </button>
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