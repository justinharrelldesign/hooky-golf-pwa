import svgPaths from "./svg-z84qyjnkv6";
import imgHat01Jpg1 from "figma:asset/2aaac5198899e182e376567f848b1ec80c50d827.png";

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

function Frame19() {
  return (
    <div className="absolute bg-[#517b34] box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] rounded-[100px] top-[260px] translate-x-[-50%]" style={{ left: "calc(50% + 0.5px)" }}>
      <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        <p className="leading-[normal] whitespace-pre">Shop Hooky Golf</p>
      </div>
      <IconOutlineArrowSmRight />
    </div>
  );
}

export default function Frame38() {
  return (
    <div className="relative size-full">
      <p className="absolute font-['Luckiest_Guy:Regular',_sans-serif] h-[64px] leading-[normal] left-1/2 not-italic text-[#282828] text-[32px] text-center top-[172px] translate-x-[-50%] w-[343px]">Look good skipping work</p>
      <Frame19 />
      <div className="absolute h-[156px] left-[81px] top-0 w-[181px]" data-name="Hat-01.jpg 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[142.51%] left-[-11.34%] max-w-none top-[-21.56%] w-[122.68%]" src={imgHat01Jpg1} />
        </div>
      </div>
    </div>
  );
}