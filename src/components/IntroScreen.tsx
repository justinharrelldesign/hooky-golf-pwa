import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-v518j0m308";
import Frame38 from "../imports/Frame38";
import { ImagePreloader } from "./ImagePreloader";

// Re-import the Figma assets with fresh imports
import secretarySarahImg from "figma:asset/da606b15aaafe7911ca9e1be31b9011a11616444.png";
import deadlineDanImg from "figma:asset/639913f4590217518f4a29a4f9cc4bfc94bde609.png";
import cubicalChuckImg from "figma:asset/88d4ac832cde727bb6ce70e63518f7d9460b6fae.png";
import logoImg from "figma:asset/1f93bfd3dadb5b5c5776c200078549369c5b84da.png";

function IconOutlineArrowSmRight() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/arrow-sm-right">
      <div className="absolute bottom-[29.17%] left-1/4 right-1/4 top-[29.17%]" data-name="Icon">
        <div className="absolute inset-[-10%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
            <path d="M8 1L13 6M13 6L8 11M13 6L1 6" id="Icon" stroke="var(--stroke-0, #FEFFFF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineUserGroup() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/user-group">
      <div className="absolute inset-[16.67%_8.33%]" data-name="Icon">
        <div className="absolute inset-[-6.25%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 18">
            <path d={svgPaths.p33b4a740} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineAdjustments() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/adjustments">
      <div className="absolute inset-[16.667%]" data-name="Icon">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path d={svgPaths.pc786400} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineExclamationCircle() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/exclamation-circle">
      <div className="absolute inset-[12.5%]" data-name="Icon">
        <div className="absolute inset-[-5.556%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p65ccf00} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function IconOutlineThumbUp() {
  return (
    <div className="relative size-full" data-name="Icon/Outline/thumb-up">
      <div className="absolute flex inset-[12.5%_13.47%_12.5%_12.5%] items-center justify-center">
        <div className="flex-none h-[18px] scale-y-[-100%] w-[17.767px]">
          <div className="relative size-full" data-name="Icon">
            <div className="absolute inset-[-5.56%_-5.64%_-5.56%_-5.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d={svgPaths.p255a4100} id="Icon" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface IntroScreenProps {
  onGetStarted: () => void;
}

export function IntroScreen({ onGetStarted }: IntroScreenProps) {
  const [selectedHoles, setSelectedHoles] = useState<9 | 18>(9);
  
  // Strike counts based on course length
  const difficultyLevels = {
    9: { easy: 5, medium: 3, hard: 1 },
    18: { easy: 9, medium: 6, hard: 3 }
  };

  return (
    <div className="bg-[#cee7bd] relative w-full overflow-auto" style={{ minHeight: '2300px' }} data-name="iPhone 16 Plus - 1">
      {/* Preload all boss images in the background */}
      <ImagePreloader />
      
      {/* Logo */}
      <div className="absolute h-[111px] left-1/2 top-[32px] w-[144px] logo-running" data-name="original-3d1cd6004fb64c8f8b609d5ed046d082 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="Hooky Golf Logo" className="absolute h-[142.34%] left-[-24.72%] max-w-none top-[-20.07%] w-[146.07%]" src={logoImg} />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="absolute leading-[normal] text-[#282828] text-[32px] text-nowrap top-[169px] whitespace-pre left-1/2 translate-x-[-50%] text-center" style={{ fontFamily: "'Luckiest Guy', cursive, system-ui", fontWeight: 400, fontStyle: 'normal' }}>
        Play Hooky Golf
      </h1>

      {/* Subtitle */}
      <p className="absolute font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] left-1/2 not-italic text-[#282828] text-[18px] text-center top-[209px] translate-x-[-50%] w-[382px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Complete golf challenges and avoid getting caught by a cast of workplace characters.
      </p>

      {/* Main CTA Button */}
      <div className="absolute btn-primary box-border content-stretch flex gap-[10px] items-center justify-center left-1/2 overflow-clip px-[39px] py-[12px] rounded-[100px] top-[271px] translate-x-[-50%] cursor-pointer" onClick={onGetStarted}>
        <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
          <p className="leading-[normal] whitespace-pre">Lets' play Hooky Golf</p>
        </div>
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/arrow-sm-right">
          <IconOutlineArrowSmRight />
        </div>
      </div>

      {/* The Challenge Section */}
      <div className="absolute left-1/2 rounded-br-[100px] rounded-tl-[100px] top-[351px] translate-x-[-50%] w-[382px]">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-center leading-[normal] not-italic overflow-clip p-[24px] relative text-[#282828] text-center w-[382px]">
          <p className="font-['Geologica:Bold',_sans-serif] font-bold relative shrink-0 text-[12px] uppercase w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            The Challenge
          </p>
          <p className="font-['Geologica:Light',_sans-serif] font-light relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            You're out for a round of Hooky Golf and the office is hot on your trail. Stay under the radar and on the course by completing 9 to 18 challenges (depending on course length). Don't panic, you're allowed a limited number of strikes before you're dragged back to the cubicle. The number of strikes depends on your chosen difficulty. Play solo or compete with friends.
          </p>
        </div>
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-br-[100px] rounded-tl-[100px]" />
      </div>

      {/* How to Play Section Title */}
      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center top-[628px] translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        How to play
      </p>

      {/* How to Play Steps */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-1/2 top-[659px] translate-x-[-50%] w-[382px]">
        {/* Add players */}
        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/user-group">
              <IconOutlineUserGroup />
            </div>
            <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-[348px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Add players
            </p>
          </div>
          <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Select how many players will be competing. Each player will face the same bosses individually.
          </p>
        </div>

        {/* Choose difficulty */}
        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/adjustments">
              <IconOutlineAdjustments />
            </div>
            <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-[348px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Choose difficulty and course length
            </p>
          </div>
          <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Skipping work for a quick 9 or a full 18? Select which difficulty which will determine how many strikes will get you caught.
          </p>
        </div>

        {/* Avoid bosses */}
        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/exclamation-circle">
              <IconOutlineExclamationCircle />
            </div>
            <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-[348px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Avoid the buzz kill bosses
            </p>
          </div>
          <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Take on and complete challenges on the golf course to avoid receiving a strike. Too many and it's back to the office for you.
          </p>
        </div>

        {/* Victory */}
        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
            <div className="flex items-center justify-center relative shrink-0">
              <div className="flex-none scale-y-[-100%]">
                <div className="overflow-clip relative size-[24px]" data-name="Icon/Outline/thumb-up">
                  <IconOutlineThumbUp />
                </div>
              </div>
            </div>
            <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-[348px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              Victory
            </p>
          </div>
          <p className="font-['Geologica:Light',_sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#282828] text-[16px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            Make it past all the bosses without getting caught and earn that post round beer.
          </p>
        </div>
      </div>

      {/* Different Difficulty Levels Title */}
      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center top-[1091px] translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Different Difficulty levels
      </p>

      {/* Course Length Toggle */}
      <div className="absolute h-[42px] left-1/2 rounded-[100px] top-[1122px] translate-x-[-50%] w-[300px]">
        <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        <div 
          className={`absolute box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-0 translate-x-[-50%] w-[150px] cursor-pointer transition-colors ${selectedHoles === 9 ? 'btn-primary' : ''}`} 
          style={{ left: "calc(50% - 75px)" }}
          onClick={() => setSelectedHoles(9)}
        >
          <p className={`font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${selectedHoles === 9 ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            9 holes
          </p>
        </div>
        <div 
          className={`absolute box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-0 translate-x-[-50%] w-[150px] cursor-pointer transition-colors ${selectedHoles === 18 ? 'btn-primary' : ''}`} 
          style={{ left: "calc(50% + 75px)" }}
          onClick={() => setSelectedHoles(18)}
        >
          <p className={`font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${selectedHoles === 18 ? 'text-white' : 'text-[#282828]'}`} style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            18 holes
          </p>
        </div>
      </div>

      {/* Difficulty Levels */}
      <div className="absolute content-stretch flex gap-[16px] items-center left-1/2 top-[1180px] translate-x-[-50%]">
        {/* Easy */}
        <div className="relative rounded-[100px] shrink-0 size-[120px]">
          <div className="box-border content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] not-italic overflow-clip p-[24px] relative size-[120px] text-[#282828] text-center">
            <h3 className="relative shrink-0 text-[14px] uppercase w-full">Easy</h3>
            <p className="font-['Geologica:Light',_sans-serif] font-light relative shrink-0 text-[14px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {difficultyLevels[selectedHoles].easy} strikes and your caught
            </p>
          </div>
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        </div>

        {/* Medium */}
        <div className="relative rounded-[100px] shrink-0 size-[120px]">
          <div className="box-border content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] not-italic overflow-clip p-[24px] relative size-[120px] text-[#282828] text-center">
            <h3 className="relative shrink-0 text-[14px] uppercase w-full">Medium</h3>
            <p className="font-['Geologica:Light',_sans-serif] font-light relative shrink-0 text-[14px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {difficultyLevels[selectedHoles].medium} strikes and your caught
            </p>
          </div>
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        </div>

        {/* Hard */}
        <div className="relative rounded-[100px] shrink-0 size-[120px]">
          <div className="box-border content-stretch flex flex-col gap-[4px] items-center justify-center leading-[normal] not-italic overflow-clip p-[24px] relative size-[120px] text-[#282828] text-center">
            <h3 className="relative shrink-0 text-[14px] uppercase w-full">Hard</h3>
            <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[14px] w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
              {difficultyLevels[selectedHoles].hard} {difficultyLevels[selectedHoles].hard === 1 ? 'strike' : 'strikes'} and your caught
            </p>
          </div>
          <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[100px]" />
        </div>
      </div>

      {/* Meet some of the bosses Title */}
      <p className="absolute font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] left-1/2 not-italic text-[#282828] text-[12px] text-center top-[1332px] translate-x-[-50%] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Meet some of the bosses
      </p>

      {/* Boss Characters - Horizontal Scroll Container */}
      <div className="absolute left-0 top-[1363px] w-full">
        <div className="flex gap-[12px] items-center overflow-x-auto px-[24px] pb-4 scrollbar-hide">
          {/* Secretary Sarah */}
          <div className="box-border content-stretch flex flex-col gap-[8px] h-[414px] items-center justify-between pt-[16px] px-[16px] pb-[24px] relative rounded-[32px] shrink-0 w-[263px]">
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex-1 flex items-center justify-center relative w-full max-h-[308px]" data-name="Secretary Sarah">
              <div className="relative h-full w-full max-w-[220px] flex items-center justify-center">
                <img alt="Secretary Sarah" className="max-h-full max-w-full object-contain scale-100" src={secretarySarahImg} />
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center relative shrink-0">
              <h3 className="leading-[24px] relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">Secretary Sarah</h3>
            </div>
          </div>

          {/* Deadline Dan */}
          <div className="box-border content-stretch flex flex-col gap-[8px] h-[414px] items-center justify-between pt-[16px] px-[16px] pb-[24px] relative rounded-[32px] shrink-0 w-[263px]">
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex-1 flex items-center justify-center relative w-full max-h-[308px]" data-name="Deadline Dan">
              <div className="relative h-full w-full max-w-[220px] flex items-center justify-center">
                <img alt="Deadline Dan" className="max-h-full max-w-full object-contain" src={deadlineDanImg} />
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center relative shrink-0">
              <h3 className="leading-[24px] relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">Deadline Dan</h3>
            </div>
          </div>

          {/* Cubical Chuck */}
          <div className="box-border content-stretch flex flex-col gap-[8px] h-[414px] items-center justify-between pt-[16px] px-[16px] pb-[24px] relative rounded-[32px] shrink-0 w-[263px]">
            <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
            <div className="flex-1 flex items-center justify-center relative w-full max-h-[308px]" data-name="Cubical Chuck">
              <div className="relative h-full w-full max-w-[220px] flex items-center justify-center">
                <img alt="Cubical Chuck" className="max-h-full max-w-full object-contain" src={cubicalChuckImg} />
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center relative shrink-0">
              <h3 className="leading-[24px] relative shrink-0 text-[#282828] text-[20px] text-center w-[231px]">Cubical Chuck</h3>
            </div>
          </div>

        </div>
      </div>

      {/* Shop Hooky Golf Section - Frame38 component */}
      <div className="absolute left-1/2 top-[1805px] translate-x-[-50%] w-[343px] h-[320px]">
        <div className="cursor-pointer">
          <Frame38 />
        </div>
      </div>

    </div>
  );
}