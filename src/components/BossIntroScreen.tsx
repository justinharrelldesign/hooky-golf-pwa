import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-oe96zkqr5y";
import svgPathsInfo from "../imports/svg-uvgumwh0ix";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { X } from "lucide-react";
import secretarySarahImg from "figma:asset/da606b15aaafe7911ca9e1be31b9011a11616444.png";
import deadlineDanImg from "figma:asset/639913f4590217518f4a29a4f9cc4bfc94bde609.png";
import cubicalChuckImg from "figma:asset/88d4ac832cde727bb6ce70e63518f7d9460b6fae.png";
import coffeeBreathKarenImg from "figma:asset/0cb85757b9ceba4d82522da1b60933c8a40fb2e5.png";
import gumSmackerStaceyImg from "figma:asset/05b9ab854e1d69de46cf06658c5c9365d280d4b2.png";
import replyAllRebeccaImg from "figma:asset/1d0b13e3e884f69508ae1819b92e7061b4df5a6b.png";
import lunchBanditBarbImg from "figma:asset/30b9f5a045cd191b57005ecc8177bbdc0ef0d43c.png";
import hrRandyImg from "figma:asset/a4d63fb045927dc52d8d5f380de662d53bd3f1db.png";
import ibbBrianImg from "figma:asset/192a05458036112f4c6abb6a37675ddaa22e4cb3.png";
import janitorJerryImg from "figma:asset/860e3ef3c71304f24c8de304a36e1d94e7b9dff4.png";
import itLordLeonardImg from "figma:asset/c2a4d4774071bda822f36da11ba7bac792895c71.png";
import sweatyStanImg from "figma:asset/42b256c1f0c0fc042cef8d402a041a8fb7473125.png";
import loudLouiseImg from "figma:asset/257133d885eb6d6f7e93e1e8e829dbac0299c9a6.png";
import awfulOfficeCoupleImg from "figma:asset/ce1a18758397c1af669651b01fcda2ce2f7b035d.png";
import smokeBreakSteveImg from "figma:asset/f6c69b0ebd60e291018ba93006b91f2aade891c7.png";
import wheelieBagWendyImg from "figma:asset/91b6e581832895955629438cad630af81fc8e271.png";
import happyHourHankImg from "figma:asset/2aaac5198899e182e376567f848b1ec80c50d827.png";
import bikeCommuteBrandonImg from "figma:asset/36d54dcbf13c11a43b31ff102ad3d5610d314599.png";

// Map boss names to their illustration images
const bossImageMap: Record<string, string> = {
  "Secretary Sarah": secretarySarahImg,
  "Deadline Dan": deadlineDanImg,
  "Cubical Chuck": cubicalChuckImg,
  "Coffee Breath Karen": coffeeBreathKarenImg,
  "Gum smacker Stacey": gumSmackerStaceyImg,
  "Reply-All Rebecca": replyAllRebeccaImg,
  "Lunch Bandit Barb": lunchBanditBarbImg,
  "Human Resources Randy": hrRandyImg,
  "Irritable Bowel Brian": ibbBrianImg,
  "Janitor Jerry": janitorJerryImg,
  "IT Lord Leonard": itLordLeonardImg,
  "Sweaty Stan": sweatyStanImg,
  "Loud Louise": loudLouiseImg,
  "Awful Office couple": awfulOfficeCoupleImg,
  "Smoke Break Steve": smokeBreakSteveImg,
  "Wheelie bag Wendy": wheelieBagWendyImg,
  "Happy Hour Hank": happyHourHankImg,
  "Bike commute Brandon": bikeCommuteBrandonImg,
};

function IconOutlineFlag() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/flag">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p2b702180} id="Icon" stroke="var(--stroke-0, #111827)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

function IconSolidInformationCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Solid/information-circle">
      <div className="absolute inset-[10%]" data-name="Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <path clipRule="evenodd" d={svgPathsInfo.p52c0380} fill="var(--fill-0, #517b34)" fillRule="evenodd" id="Icon" />
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

// Pool of alternative challenges - only 3 available, each can be used once per round
const alternativeChallenges = [
  "Make par or better.",
  "Don't lose a ball on this hole.",
  "Reach the green in the expected number of strokes (par minus two)."
];

interface BossIntroScreenProps {
  hole: number;
  boss: Boss;
  onContinue: () => void;
  onExitRound: () => void;
  playerCount?: number;
  skipsRemaining: number;
  hasSkippedThisBoss: boolean;
  onSkipChallenge: (usedChallenge: string) => void;
  usedChallenges: string[];
}

export function BossIntroScreen({ hole, boss, onContinue, onExitRound, playerCount = 1, skipsRemaining, hasSkippedThisBoss, onSkipChallenge, usedChallenges }: BossIntroScreenProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(boss.challenge);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Get dynamic challenge text for Sweaty Stan based on player count
  const getChallengeText = () => {
    if (boss.name === "Sweaty Stan" && currentChallenge === boss.challenge) {
      const timeLimit = playerCount <= 2 ? "8" : "10";
      return `Time for you to work up a sweat. Finish the hole in less than ${timeLimit} minutes.`;
    }
    return currentChallenge;
  };

  // Handle skipping the challenge
  const handleSkip = () => {
    // Get available challenges (not yet used in this round)
    const availableChallenges = alternativeChallenges.filter(
      challenge => !usedChallenges.includes(challenge)
    );
    
    // If no challenges are available, don't allow skip
    if (availableChallenges.length === 0) {
      return;
    }
    
    // Randomly select one of the available challenges
    const newChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    
    setCurrentChallenge(newChallenge);
    onSkipChallenge(newChallenge);
  };



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

  // Temporarily disable specific boss components to avoid potential timeout issues
  // if (showContent) {
  //   // Use special boss components based on boss name (not hole number)
  //   if (boss.name === "Deadline Dan") {
  //     return <DeadlineDanBoss hole={hole} onContinue={onContinue} onExitRound={onExitRound} />;
  //   }

  //   if (boss.name === "Cubical Chuck") {
  //     return <CubicalChuckBoss hole={hole} onContinue={onContinue} onExitRound={onExitRound} />;
  //   }

  //   if (boss.name === "Coffee Breath Karen") {
  //     return <CoffeeBreathKaren hole={hole} onContinue={onContinue} onExitRound={onExitRound} />;
  //   }

  //   if (boss.name === "Gum smacker Stacey") {
  //     return <GumSmackingStacey hole={hole} onContinue={onContinue} onExitRound={onExitRound} />;
  //   }

  //   if (boss.name === "Reply-All Rebecca") {
  //     return <ReplyAllRebecca hole={hole} onContinue={onContinue} onExitRound={onExitRound} />;
  //   }

  //   if (boss.name === "Lunch Bandit Barb") {
  //     return <LunchBanditBarb hole={hole} onContinue={onContinue} onExitRound={onExitRound} />;
  //   }
  // }

  // Show flip animation or actual content
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
    <div className="bg-[#cee7bd] relative size-full min-h-screen flex flex-col items-center py-[24px]" data-name="iPhone 16 Plus - 3">
      <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[16px] py-[24px] rounded-[32px] w-[382px] relative">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
        
        {/* Flag Icon */}
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/flag">
          <IconOutlineFlag />
        </div>
        
        {/* Hole Number */}
        <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[12px] text-center uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          Hole {hole}
        </p>
        
        {/* Boss Name */}
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <h2 className="leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">{boss.name}</h2>
        </div>
        
        {/* Boss Illustration */}
        <div className="relative shrink-0 boss-slam-animation -mt-4 -mb-3 flex items-center justify-center" data-name="Boss Illustration">
          {bossImageMap[boss.name] ? (
            <img 
              src={bossImageMap[boss.name]} 
              alt={boss.name}
              className="w-[240px] h-auto object-contain"
              loading="eager"
            />
          ) : (
            <div className="text-[160px] leading-none">{boss.avatar}</div>
          )}
        </div>
        
        {/* Boss Quote */}
        <div className="box-border content-stretch flex flex-col items-start pb-[16px] pt-0 px-0 relative shrink-0 w-full">
          <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
          <h3 className="leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-full">"{boss.quote}"</h3>
        </div>
        
        {/* Challenge Section and Button */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
          {/* Challenge */}
          <div className="box-border content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic pb-0 pt-[16px] px-0 relative shrink-0 text-[#282828] text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="font-['Geologica:Bold',_sans-serif] font-bold relative shrink-0 text-[12px] uppercase" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                Challenge
              </p>
              <AlertDialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                <AlertDialogTrigger asChild>
                  <button className="shrink-0 size-[16px] cursor-pointer" aria-label="Challenge help">
                    <IconSolidInformationCircle />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white max-w-[340px] rounded-[24px] p-[24px]">
                  <div className="flex items-start justify-between mb-[16px]">
                    <AlertDialogTitle className="font-['Geologica:Bold',_sans-serif] font-bold text-[18px] text-[#282828]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      Challenge Skips
                    </AlertDialogTitle>
                    <button
                      onClick={() => setShowHelpDialog(false)}
                      className="shrink-0 size-[24px] cursor-pointer text-[#646464] hover:text-[#282828] transition-colors"
                      aria-label="Close"
                    >
                      <X className="size-full" />
                    </button>
                  </div>
                  <AlertDialogDescription className="font-['Geologica:Regular',_sans-serif] font-normal text-[16px] text-[#646464] mb-[24px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                    You may take on a different challenge, but are limited to 1 a hole and 3 a round. Use them wisely!
                  </AlertDialogDescription>
                  <AlertDialogAction
                    onClick={() => setShowHelpDialog(false)}
                    className="btn-primary box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[24px] py-[12px] rounded-[100px] w-full cursor-pointer border-0"
                  >
                    <span className="font-['Geologica:Regular',_sans-serif] font-normal text-[16px] text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                      Got it
                    </span>
                  </AlertDialogAction>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {getChallengeText()}
            </p>
          </div>
          
          {/* Skip challenge button - only show if skips remain, boss hasn't been skipped, and there are available challenges */}
          {skipsRemaining > 0 && !hasSkippedThisBoss && alternativeChallenges.some(c => !usedChallenges.includes(c)) && (
            <button
              onClick={handleSkip}
              className="box-border content-stretch flex gap-[10px] h-[42px] items-center justify-center overflow-clip px-[24px] py-[10px] relative rounded-[100px] shrink-0 w-[350px] cursor-pointer border border-[#517b34] border-solid transition-all hover:bg-[#f8fafc]"
            >
              <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-[#517b34]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
                <p className="leading-[normal] whitespace-pre">Take on a different challenge</p>
              </div>
            </button>
          )}
          
          {/* Face the boss button */}
          <div 
            className="btn-primary box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-[350px] cursor-pointer"
            onClick={onContinue}
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