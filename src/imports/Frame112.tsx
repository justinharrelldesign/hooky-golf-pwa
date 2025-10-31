import svgPaths from "./svg-3lxkveo3ea";
import imgFrame96 from "figma:asset/2afabfe6549ba3d0e17a6e5dd37a57b89203a218.png";
import imgRectangle from "figma:asset/9c21fc09b3fda17d2e0a231e63a8c0283cf95721.png";

function Frame107() {
  return <div className="bg-white h-[233px] rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] w-[183px]" />;
}

function Frame96() {
  return (
    <div className="h-[159px] relative rounded-[8px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[8px] size-full" src={imgFrame96} />
    </div>
  );
}

function HeroiconsMiniPhoto() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="heroicons-mini/photo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="heroicons-mini/photo">
          <path clipRule="evenodd" d={svgPaths.p2dab6700} fill="var(--fill-0, #0F172A)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <HeroiconsMiniPhoto />
      <p className="font-['Geologica:Regular',_sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#282828] text-[12px] w-[52px]" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        3 photos
      </p>
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex gap-[16px] h-[20px] items-center relative shrink-0 w-[159px]">
      <Frame98 />
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <p className="font-['Geologica:SemiBold',_sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#282828] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
        Gallery name
      </p>
      <Frame97 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[8px] items-start justify-end left-[5px] p-[12px] rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] top-[12px] w-[183px]">
      <Frame96 />
      <Frame110 />
    </div>
  );
}

export default function Frame112() {
  return (
    <div className="relative size-full">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.03197242692112923)+(var(--transform-inner-height)*0.9994887709617615)))] items-center justify-center left-0 top-[10.13px] w-[calc(1px*((var(--transform-inner-height)*0.03197242692112923)+(var(--transform-inner-width)*0.9994887709617615)))]" style={{ "--transform-inner-width": "183", "--transform-inner-height": "233" } as React.CSSProperties}>
        <div className="flex-none rotate-[358.168deg]">
          <Frame107 />
        </div>
      </div>
      <Frame17 />
      <div className="absolute h-[20px] left-[90px] top-0 w-[16px]" data-name="Rectangle">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[159.23%] left-[-50.99%] max-w-none top-[-25.5%] w-[203.17%]" src={imgRectangle} />
        </div>
      </div>
    </div>
  );
}