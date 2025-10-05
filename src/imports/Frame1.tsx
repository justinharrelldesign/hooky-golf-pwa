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

export default function Frame1() {
  return (
    <div className="bg-[#517b34] relative rounded-[100px] size-full">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[39px] py-[12px] relative size-full">
          <div className="flex flex-col font-['Geologica:Regular',_sans-serif] font-normal justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white" style={{ fontVariationSettings: "'CRSV' 0, 'SHRP' 0" }}>
            <p className="leading-[normal] whitespace-pre">Lets’ play Hooky Golf</p>
          </div>
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon/Outline/arrow-sm-right">
            <IconOutlineArrowSmRight />
          </div>
        </div>
      </div>
    </div>
  );
}