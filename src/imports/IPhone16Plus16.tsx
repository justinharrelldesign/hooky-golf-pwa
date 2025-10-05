import svgPaths from "./svg-rn5lzjdsev";
import imgChatGptImageSep292025At032607Pm1 from "figma:asset/99fe0dd55feba6e2153c6425f78487a2312d27f9.png";

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center leading-[normal] not-italic relative shrink-0 text-[#282828] text-center">
      <p className="font-['Luckiest_Guy:Regular',_sans-serif] min-w-full relative shrink-0 text-[32px]" style={{ width: "min-content" }}>
        Player caught!
      </p>
      <p className="font-['Geologica:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-[350px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Back to the office they go. Better luck next time...
      </p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-[#282828] box-border content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[100px] shrink-0 w-[40px]">
      <p className="font-['Geologica:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-white w-full" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        J
      </p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute content-stretch flex font-['Geologica:Light',_sans-serif] font-light gap-[2px] h-[40px] items-center justify-center leading-[normal] left-[56px] not-italic overflow-clip text-[#282828] text-[16px] top-0 w-[294px]">
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Justin
      </p>
      <p className="relative shrink-0 text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Strikes: 5/5
      </p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-[350px]">
      <Frame20 />
      <Frame21 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0">
      <Frame22 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-0 top-px">
      <Frame49 />
      <Frame32 />
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
    <div className="absolute bg-[#517b34] box-border content-stretch flex gap-[10px] h-[48px] items-center justify-center left-0 overflow-clip px-[39px] py-[12px] rounded-[100px] top-[167px] w-[350px]">
      <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] whitespace-pre">Continue round</p>
      </div>
      <IconOutlineArrowSmRight />
    </div>
  );
}

function Frame52() {
  return (
    <div className="h-[215px] relative shrink-0 w-[350px]">
      <Frame50 />
      <Frame27 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="h-[513px] relative shrink-0 w-[342px]">
      <div className="absolute h-[513px] left-0 top-0 w-[342px]" data-name="ChatGPT Image Sep 29, 2025 at 03_26_07 PM 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgChatGptImageSep292025At032607Pm1} />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-[24px] pb-0 pt-[24px] px-[16px] rounded-[32px] top-[24px] w-[382px]">
      <div aria-hidden="true" className="absolute border border-[#517b34] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <Frame52 />
      <Frame48 />
    </div>
  );
}

export default function IPhone16Plus16() {
  return (
    <div className="bg-[#cee7bd] relative size-full" data-name="iPhone 16 Plus - 16">
      <Frame16 />
    </div>
  );
}