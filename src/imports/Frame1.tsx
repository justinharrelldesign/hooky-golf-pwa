import svgPaths from "./svg-nkoddeamr7";

function HeroiconsOutlineHome() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/home">
          <path d={svgPaths.p11460780} id="Vector" stroke="var(--stroke-0, #282828)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame93() {
  return (
    <div className="bg-[#cee7bd] content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px]">
      <HeroiconsOutlineHome />
    </div>
  );
}

function HeroiconsOutlineBookOpen() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/book-open">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/book-open">
          <path d={svgPaths.p3cac5680} id="Vector" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <HeroiconsOutlineBookOpen />
    </div>
  );
}

function HeroiconsOutlineUserCircle() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/user-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/user-circle">
          <path d={svgPaths.p22e17a00} id="Vector" stroke="var(--stroke-0, #517B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute border border-[#cee7bd] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <HeroiconsOutlineUserCircle />
    </div>
  );
}

function HeroiconsOutlineFlag() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="heroicons-outline/flag">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="heroicons-outline/flag">
          <path d={svgPaths.p127ccb80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame92() {
  return (
    <div className="basis-0 bg-[#517b34] grow min-h-px min-w-px relative rounded-[8px] shrink-0">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative w-full">
          <HeroiconsOutlineFlag />
          <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            <p className="leading-[normal] whitespace-pre">Start round</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white relative shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.15)] size-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[24px] items-center justify-center px-[16px] py-[12px] relative size-full">
          <Frame93 />
          <Frame94 />
          <Frame95 />
          <Frame92 />
        </div>
      </div>
    </div>
  );
}