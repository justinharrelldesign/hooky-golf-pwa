import svgPaths from "./svg-6v0w1ldfke";
import imgChatGptImageSep262025At040129Pm1 from "figma:asset/9d77d47261c01e8318f1a4f284b3a74b2f520cd5.png";

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

function Frame17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <p className="font-['Luckiest_Guy:Regular',_sans-serif] leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-full">Smoke Break Steve</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[313px] items-end justify-center left-[8px] top-0 w-[216px]">
      <div className="h-[318px] relative shrink-0 w-[212px]" data-name="ChatGPT Image Sep 26, 2025 at 04_01_29 PM 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgChatGptImageSep262025At040129Pm1} />
      </div>
    </div>
  );
}

function ItNerdNed() {
  return (
    <div className="absolute bg-[#cee7bd] h-[308px] left-0 overflow-clip top-0 w-[226px]" data-name="IT Nerd Ned">
      <Frame19 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="h-[308px] relative shrink-0 w-[226px]">
      <ItNerdNed />
    </div>
  );
}

function Frame18() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pb-[16px] pt-0 px-0 relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#517b34] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Luckiest_Guy:Regular',_sans-serif] leading-[24px] not-italic relative shrink-0 text-[#282828] text-[20px] text-center w-full">“While you’re hitting out of sand traps, I’m spitting tar pits and ratting your ass out.”</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic pb-0 pt-[16px] px-0 relative shrink-0 text-[#282828] text-center">
      <p className="font-['Geologica:Bold',_sans-serif] font-bold relative shrink-0 text-[12px] uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Challenge
      </p>
      <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Avoid any sand traps or your day of Hooky could be up in smoke.
      </p>
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

function Frame27() {
  return (
    <div className="bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center overflow-clip px-[39px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]">
      <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] whitespace-pre">Face the boss</p>
      </div>
      <IconOutlineArrowSmRight />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame28 />
      <Frame27 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[24px] px-[16px] py-[24px] rounded-[32px] top-[24px] w-[382px]">
      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <IconOutlineFlag />
      <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[12px] text-center uppercase w-[334px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Hole 15
      </p>
      <Frame17 />
      <Frame20 />
      <Frame18 />
      <Frame29 />
    </div>
  );
}

export default function IPhone16Plus26() {
  return (
    <div className="bg-[#cee7bd] relative size-full" data-name="iPhone 16 Plus - 26">
      <Frame16 />
    </div>
  );
}